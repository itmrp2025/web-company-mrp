"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInterceptor } from "@/config/axios.config";
import { getApi } from "@/utils/helpers/getApi";
import { endpoints } from "@/utils/constants/endpoints.const";
import { toast } from "sonner";
import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  GripVertical,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/custom-ui/Button";
import { TeamMemberModal } from "@/components/admin/team/TeamMemberModal";
import type { ApiResponse, TeamMember } from "@/interface/admin.interface";

const QUERY_KEY = ["admin-team"];

export function TeamDataPanel() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<TeamMember | null | "new">(null);
  const [dragId, setDragId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: async () => {
      const res = await axiosInterceptor.get<ApiResponse<TeamMember[]>>(
        getApi(endpoints.team.adminList)
      );
      return res.data.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      axiosInterceptor.delete(getApi(endpoints.team.delete(id))),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEY });
      toast.success("Anggota tim dihapus");
    },
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, member }: { id: string; member: TeamMember }) =>
      axiosInterceptor.put(getApi(endpoints.team.update(id)), {
        is_visible: !member.is_visible,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });

  // Urutan diubah langsung di tampilan (optimistic), lalu disimpan ke server.
  // Kalau gagal, urutan lama dikembalikan.
  const reorderMutation = useMutation({
    mutationFn: (ids: string[]) =>
      axiosInterceptor.put(
        getApi(endpoints.team.reorder),
        { ids },
        { skipErrorToast: true }
      ),
    onMutate: async (ids) => {
      await qc.cancelQueries({ queryKey: QUERY_KEY });
      const previous = qc.getQueryData<TeamMember[]>(QUERY_KEY);
      if (previous) {
        const byId = new Map(previous.map((m) => [m.id, m]));
        qc.setQueryData<TeamMember[]>(
          QUERY_KEY,
          ids.map((id) => byId.get(id)).filter((m): m is TeamMember => !!m)
        );
      }
      return { previous };
    },
    onError: (_err, _ids, ctx) => {
      if (ctx?.previous) qc.setQueryData(QUERY_KEY, ctx.previous);
      toast.error("Gagal menyimpan urutan");
    },
    onSuccess: () => toast.success("Urutan disimpan"),
    onSettled: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  });

  const resetDrag = () => {
    setDragId(null);
    setOverId(null);
  };

  // Pindahkan satu id ke posisi id lain, lalu simpan.
  const moveTo = (id: string, targetId: string) => {
    if (!data || id === targetId) return;
    const ids = data.map((m) => m.id);
    const from = ids.indexOf(id);
    const to = ids.indexOf(targetId);
    if (from < 0 || to < 0) return;
    ids.splice(from, 1);
    ids.splice(to, 0, id);
    reorderMutation.mutate(ids);
  };

  const handleDrop = (targetId: string) => {
    if (dragId) moveTo(dragId, targetId);
    resetDrag();
  };

  // Alternatif drag-and-drop untuk layar sentuh dan keyboard.
  const moveBy = (id: string, direction: -1 | 1) => {
    if (!data || reorderMutation.isPending) return;
    const target = data[data.findIndex((m) => m.id === id) + direction];
    if (target) moveTo(id, target.id);
  };

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-neutral-500">
          {data?.length ?? 0} anggota
          {(data?.length ?? 0) > 1 && " · seret baris atau pakai tombol panah untuk mengubah urutan"}
        </p>
        <Button startIcon={<Plus className="h-4 w-4" />} size="sm" onClick={() => setEditing("new")}>
          Tambah Anggota
        </Button>
      </div>

      <div className="rounded-lg border border-neutral-100 bg-white">
        {isLoading ? (
          <div className="flex items-center justify-center py-16 text-sm text-neutral-400">Memuat...</div>
        ) : !data?.length ? (
          <div className="flex flex-col items-center justify-center py-16">
            <p className="text-sm text-neutral-400">Belum ada anggota tim</p>
            <button onClick={() => setEditing("new")} className="mt-3 text-sm font-medium text-primary hover:underline">
              Tambah anggota pertama
            </button>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-100">
                <th className="w-8 px-3 py-3" />
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-400">Nama</th>
                <th className="hidden px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-400 sm:table-cell">Role</th>
                <th className="hidden px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-400 md:table-cell">Status</th>
                <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-neutral-400">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-50">
              {data.map((member, index) => (
                <tr
                  key={member.id}
                  draggable={!reorderMutation.isPending}
                  onDragStart={(e) => {
                    setDragId(member.id);
                    e.dataTransfer.effectAllowed = "move";
                    e.dataTransfer.setData("text/plain", member.id);
                  }}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = "move";
                    if (overId !== member.id) setOverId(member.id);
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    handleDrop(member.id);
                  }}
                  onDragEnd={resetDrag}
                  className={`hover:bg-neutral-50/50 ${
                    dragId === member.id ? "opacity-40" : ""
                  } ${overId === member.id && dragId !== member.id ? "bg-neutral-100" : ""}`}
                >
                  <td className="px-3 py-4 text-neutral-300">
                    <GripVertical className="h-4 w-4 cursor-grab active:cursor-grabbing" aria-hidden="true" />
                  </td>
                  <td className="px-5 py-4">
                    <p className="font-medium text-neutral-900">{member.content.name_id}</p>
                    <p className="text-xs text-neutral-500">{member.content.title_id}</p>
                  </td>
                  <td className="hidden px-5 py-4 text-neutral-600 sm:table-cell capitalize">
                    {member.role_type.replace(/_/g, " ")}
                  </td>
                  <td className="hidden px-5 py-4 md:table-cell">
                    <span className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium ${member.is_visible ? "bg-green-50 text-green-700" : "bg-neutral-100 text-neutral-500"}`}>
                      {member.is_visible ? "Tampil" : "Tersembunyi"}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => moveBy(member.id, -1)}
                        disabled={index === 0 || reorderMutation.isPending}
                        className="rounded p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
                        aria-label="Naikkan urutan"
                        title="Naikkan urutan"
                      >
                        <ChevronUp className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => moveBy(member.id, 1)}
                        disabled={index === data.length - 1 || reorderMutation.isPending}
                        className="rounded p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
                        aria-label="Turunkan urutan"
                        title="Turunkan urutan"
                      >
                        <ChevronDown className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => toggleMutation.mutate({ id: member.id, member })}
                        className="rounded p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
                        aria-label={member.is_visible ? "Sembunyikan" : "Tampilkan"}
                        title={member.is_visible ? "Sembunyikan" : "Tampilkan"}
                      >
                        {member.is_visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                      </button>
                      <button
                        onClick={() => setEditing(member)}
                        className="rounded p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
                        aria-label="Edit"
                        title="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Hapus "${member.content.name_id}"?`)) deleteMutation.mutate(member.id);
                        }}
                        className="rounded p-1.5 text-neutral-400 hover:bg-red-50 hover:text-red-600"
                        aria-label="Hapus"
                        title="Hapus"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {editing !== null && (
        <TeamMemberModal
          member={editing === "new" ? null : editing}
          onClose={() => setEditing(null)}
          onSuccess={() => {
            qc.invalidateQueries({ queryKey: QUERY_KEY });
            setEditing(null);
          }}
        />
      )}
    </>
  );
}