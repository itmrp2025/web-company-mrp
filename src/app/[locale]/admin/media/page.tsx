"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInterceptor } from "@/config/axios.config";
import { getApi } from "@/utils/helpers/getApi";
import { toast } from "sonner";
import { Upload, Trash2, Copy, Check } from "lucide-react";
import { Button } from "@/components/custom-ui/Button";

interface MediaFile {
  id: string;
  filename: string;
  url: string;
  file_type: string;
  mime_type: string;
  file_size: number;
  alt_text: string;
  created_at: string;
}

interface ApiResponse<T> { success: boolean; data: T; message: string; }

function formatBytes(bytes: number) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

export default function AdminMediaPage() {
  const qc = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-media"],
    queryFn: async () => {
      const res = await axiosInterceptor.get<ApiResponse<MediaFile[]>>(
        getApi("/admin/media")
      );
      return res.data.data;
    },
  });

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      return axiosInterceptor.post(getApi("/admin/media"), formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-media"] });
      toast.success("File berhasil diupload");
    },
    onError: () => toast.error("Gagal upload file"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => axiosInterceptor.delete(getApi(`/admin/media/${id}`)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-media"] });
      toast.success("File dihapus");
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    files.forEach((file) => uploadMutation.mutate(file));
    e.target.value = "";
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(url);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-neutral-900">Media</h1>
          <p className="mt-0.5 text-sm text-neutral-500">{data?.length ?? 0} file</p>
        </div>
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFileChange}
          />
          <Button
            startIcon={<Upload className="h-4 w-4" />}
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadMutation.isPending}
          >
            {uploadMutation.isPending ? "Mengupload..." : "Upload File"}
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20 text-sm text-neutral-400">Memuat...</div>
      ) : !data?.length ? (
        <div
          className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-neutral-200 py-20 cursor-pointer hover:border-primary/40 transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="mb-3 h-8 w-8 text-neutral-300" />
          <p className="text-sm font-medium text-neutral-500">Klik untuk upload gambar</p>
          <p className="mt-1 text-xs text-neutral-400">PNG, JPG, WEBP hingga 10MB</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {/* Upload tile */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-neutral-200 p-4 text-neutral-400 hover:border-primary/40 hover:text-primary transition-colors aspect-square"
          >
            <Upload className="h-6 w-6 mb-1" />
            <span className="text-xs">Upload</span>
          </button>

          {data.map((file) => (
            <div key={file.id} className="group relative rounded-lg border border-neutral-100 bg-white overflow-hidden">
              <div className="relative aspect-square overflow-hidden bg-neutral-50">
                <Image
                  src={file.url}
                  alt={file.alt_text || file.filename}
                  fill
                  unoptimized
                  className="object-cover transition-transform group-hover:scale-105"
                  sizes="200px"
                />
              </div>
              <div className="p-2">
                <p className="truncate text-xs font-medium text-neutral-700">{file.filename}</p>
                <p className="text-[10px] text-neutral-400">{formatBytes(file.file_size)}</p>
              </div>
              {/* Overlay actions */}
              <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  onClick={() => copyUrl(file.url)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-neutral-700 hover:bg-neutral-100"
                  title="Salin URL"
                >
                  {copied === file.url ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Hapus "${file.filename}"?`)) deleteMutation.mutate(file.id);
                  }}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-red-600 hover:bg-red-50"
                  title="Hapus"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
