"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInterceptor } from "@/config/axios.config";
import { getApi } from "@/utils/helpers/getApi";
import { endpoints } from "@/utils/constants/endpoints.const";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/custom-ui/Button";
import { TeamMemberModal } from "@/components/admin/team/TeamMemberModal";
import type { ApiResponse, TeamMember } from "@/interface/admin.interface";

export default function AdminTeamPage() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<TeamMember | null | "new">(null);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-team"],
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
      qc.invalidateQueries({ queryKey: ["admin-team"] });
      toast.success("Anggota tim dihapus");
    },
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, member }: { id: string; member: TeamMember }) =>
      axiosInterceptor.put(getApi(endpoints.team.update(id)), {
        ...member,
        is_visible: !member.is_visible,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-team"] });
    },
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-neutral-900">Tim</h1>
          <p className="mt-0.5 text-sm text-neutral-500">{data?.length ?? 0} anggota</p>
        </div>
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
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-400">Nama</th>
                <th className="hidden px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-400 sm:table-cell">Role</th>
                <th className="hidden px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-400 md:table-cell">Status</th>
                <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-neutral-400">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-50">
              {data.map((member) => (
                <tr key={member.id} className="hover:bg-neutral-50/50">
                  <td className="px-5 py-4">
                    <p className="font-medium text-neutral-900">{member.content.name_id}</p>
                    <p className="text-xs text-neutral-400">{member.content.title_id}</p>
                  </td>
                  <td className="hidden px-5 py-4 text-neutral-600 sm:table-cell capitalize">
                    {member.role_type.replace("_", " ")}
                  </td>
                  <td className="hidden px-5 py-4 md:table-cell">
                    <span className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium ${member.is_visible ? "bg-green-50 text-green-700" : "bg-neutral-100 text-neutral-500"}`}>
                      {member.is_visible ? "Tampil" : "Tersembunyi"}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => toggleMutation.mutate({ id: member.id, member })}
                        className="rounded p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
                        title={member.is_visible ? "Sembunyikan" : "Tampilkan"}
                      >
                        {member.is_visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                      </button>
                      <button
                        onClick={() => setEditing(member)}
                        className="rounded p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Hapus "${member.content.name_id}"?`)) deleteMutation.mutate(member.id);
                        }}
                        className="rounded p-1.5 text-neutral-400 hover:bg-red-50 hover:text-red-600"
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
            qc.invalidateQueries({ queryKey: ["admin-team"] });
            setEditing(null);
          }}
        />
      )}
    </div>
  );
}
