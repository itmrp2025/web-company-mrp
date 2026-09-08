"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { Upload, X, ImageIcon, Loader2 } from "lucide-react";
import { axiosInterceptor } from "@/config/axios.config";
import { getApi } from "@/utils/helpers/getApi";
import { toast } from "sonner";

interface Props {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  folder?: string;
  error?: string;
}

interface UploadResponse {
  success: boolean;
  data: { url: string };
}

export function ImageUpload({ value, onChange, label = "Gambar", folder = "general", error }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);

  const doUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Hanya file gambar yang diizinkan");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Ukuran file maksimal 10MB");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);
      const res = await axiosInterceptor.post<UploadResponse>(
        getApi("/admin/media"),
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      onChange(res.data.data.url);
      toast.success("Gambar berhasil diupload");
    } catch {
      toast.error("Gagal mengupload gambar");
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) doUpload(file);
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) doUpload(file);
  };

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-neutral-700">{label}</label>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {value ? (
        <div className="relative group h-48 w-full overflow-hidden border border-neutral-200 bg-neutral-50">
          <Image
            src={value}
            alt="Preview"
            fill
            unoptimized
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <div className="hidden h-48 w-full items-center justify-center flex-col gap-2 bg-neutral-100">
            <ImageIcon className="h-8 w-8 text-neutral-300" />
            <p className="text-xs text-neutral-400 text-center px-4 break-all">{value}</p>
          </div>
          {/* Overlay */}
          <div className="absolute inset-0 flex items-center justify-center gap-3 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="flex items-center gap-1.5 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-100 transition-colors"
            >
              {uploading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Upload className="h-3.5 w-3.5" />
              )}
              Ganti
            </button>
            <button
              type="button"
              onClick={() => onChange("")}
              className="flex items-center gap-1.5 bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700 transition-colors"
            >
              <X className="h-3.5 w-3.5" />
              Hapus
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => !uploading && inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className={`flex h-48 w-full cursor-pointer flex-col items-center justify-center border-2 border-dashed transition-colors ${
            dragging
              ? "border-primary bg-primary/5"
              : "border-neutral-200 bg-neutral-50 hover:border-primary/50 hover:bg-neutral-100"
          } ${uploading ? "pointer-events-none opacity-60" : ""}`}
        >
          {uploading ? (
            <>
              <Loader2 className="mb-2 h-7 w-7 animate-spin text-primary" />
              <p className="text-sm text-neutral-500">Mengupload...</p>
            </>
          ) : (
            <>
              <ImageIcon className="mb-2 h-7 w-7 text-neutral-300" />
              <p className="text-sm font-medium text-neutral-500">
                Klik atau drag & drop gambar
              </p>
              <p className="mt-1 text-xs text-neutral-400">PNG, JPG, WEBP — maks 10MB</p>
            </>
          )}
        </div>
      )}

      {/* Manual URL input fallback */}
      <div className="flex items-center gap-2 mt-1">
        <span className="text-xs text-neutral-400 shrink-0">atau masukkan URL:</span>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://..."
          className="h-8 flex-1 border border-neutral-200 bg-white px-2 text-xs text-neutral-700 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
        />
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
