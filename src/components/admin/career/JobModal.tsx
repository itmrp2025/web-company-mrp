"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { axiosInterceptor } from "@/config/axios.config";
import { getApi } from "@/utils/helpers/getApi";
import { endpoints } from "@/utils/constants/endpoints.const";
import { toast } from "sonner";
import { X } from "lucide-react";
import { Button } from "@/components/custom-ui/Button";
import { TextField } from "@/components/custom-ui/TextField";
import type { JobListing, JobListingPayload } from "@/interface/admin.interface";

const schema = z.object({
  slug: z.string().min(1, "Slug wajib diisi"),
  department: z.string().min(1, "Departemen wajib diisi"),
  location: z.string().min(1, "Lokasi wajib diisi"),
  employment_type: z.string().min(1, "Tipe pekerjaan wajib dipilih"),
  deadline: z.string(),
  status: z.enum(["open", "closed"]),
  title_id: z.string().min(1, "Judul (Indonesia) wajib diisi"),
  title_en: z.string().min(1, "Judul (Inggris) wajib diisi"),
  description_id: z.string().min(1, "Deskripsi (Indonesia) wajib diisi"),
  description_en: z.string().min(1, "Deskripsi (Inggris) wajib diisi"),
  requirements_id: z.string(),
  requirements_en: z.string(),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  job: JobListing | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function JobModal({ job, onClose, onSuccess }: Props) {
  const isEdit = !!job;

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      slug: job?.slug ?? "",
      department: job?.department ?? "",
      location: job?.location ?? "",
      employment_type: job?.employment_type ?? "full_time",
      deadline: job?.deadline?.slice(0, 10) ?? "",
      status: job?.status ?? "open",
      title_id: job?.content.title_id ?? "",
      title_en: job?.content.title_en ?? "",
      description_id: job?.content.description_id ?? "",
      description_en: job?.content.description_en ?? "",
      requirements_id: job?.content.requirements_id ?? "",
      requirements_en: job?.content.requirements_en ?? "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const payload: JobListingPayload = {
        slug: values.slug,
        department: values.department,
        location: values.location,
        employment_type: values.employment_type,
        deadline: values.deadline,
        status: values.status,
        content: {
          title_id: values.title_id,
          title_en: values.title_en,
          description_id: values.description_id,
          description_en: values.description_en,
          requirements_id: values.requirements_id,
          requirements_en: values.requirements_en,
        },
      };
      if (isEdit) {
        return axiosInterceptor.put(getApi(endpoints.career.update(job!.id)), payload);
      }
      return axiosInterceptor.post(getApi(endpoints.career.create), payload);
    },
    onSuccess: () => {
      toast.success(isEdit ? "Lowongan diperbarui" : "Lowongan ditambahkan");
      onSuccess();
    },
  });

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4 pt-10">
      <div className="w-full max-w-2xl rounded-lg border border-neutral-100 bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-neutral-100 px-6 py-4">
          <h2 className="text-base font-semibold text-neutral-900">
            {isEdit ? "Edit Lowongan" : "Tambah Lowongan"}
          </h2>
          <button onClick={onClose} className="rounded p-1 text-neutral-400 hover:text-neutral-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit((v) => mutation.mutate(v))} className="divide-y divide-neutral-50">
          {/* Info dasar */}
          <div className="space-y-4 px-6 py-5">
            <div className="grid grid-cols-2 gap-4">
              <TextField label="Slug" {...register("slug")} error={errors.slug?.message} />
              <div>
                <label className="mb-1.5 block text-sm font-medium text-neutral-700">Status</label>
                <select {...register("status")} className="w-full rounded border border-neutral-200 px-3 py-2 text-sm focus:border-primary focus:outline-none">
                  <option value="open">Buka</option>
                  <option value="closed">Tutup</option>
                </select>
              </div>
              <TextField label="Departemen" {...register("department")} error={errors.department?.message} />
              <TextField label="Lokasi" {...register("location")} error={errors.location?.message} />
              <div>
                <label className="mb-1.5 block text-sm font-medium text-neutral-700">Tipe Pekerjaan</label>
                <select {...register("employment_type")} className="w-full rounded border border-neutral-200 px-3 py-2 text-sm focus:border-primary focus:outline-none">
                  <option value="full_time">Full Time</option>
                  <option value="part_time">Part Time</option>
                  <option value="contract">Kontrak</option>
                  <option value="internship">Magang</option>
                </select>
              </div>
              <TextField label="Deadline" type="date" {...register("deadline")} />
            </div>
          </div>

          {/* Konten ID */}
          <div className="space-y-4 px-6 py-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Bahasa Indonesia</p>
            <TextField label="Judul Posisi (ID)" {...register("title_id")} error={errors.title_id?.message} />
            <div>
              <label className="mb-1.5 block text-sm font-medium text-neutral-700">Deskripsi (ID)</label>
              <textarea {...register("description_id")} rows={4} className="w-full rounded border border-neutral-200 px-3 py-2 text-sm focus:border-primary focus:outline-none" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-neutral-700">Persyaratan (ID)</label>
              <textarea {...register("requirements_id")} rows={4} className="w-full rounded border border-neutral-200 px-3 py-2 text-sm focus:border-primary focus:outline-none" />
            </div>
          </div>

          {/* Konten EN */}
          <div className="space-y-4 px-6 py-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">English</p>
            <TextField label="Position Title (EN)" {...register("title_en")} error={errors.title_en?.message} />
            <div>
              <label className="mb-1.5 block text-sm font-medium text-neutral-700">Description (EN)</label>
              <textarea {...register("description_en")} rows={4} className="w-full rounded border border-neutral-200 px-3 py-2 text-sm focus:border-primary focus:outline-none" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-neutral-700">Requirements (EN)</label>
              <textarea {...register("requirements_en")} rows={4} className="w-full rounded border border-neutral-200 px-3 py-2 text-sm focus:border-primary focus:outline-none" />
            </div>
          </div>

          <div className="flex justify-end gap-3 px-6 py-4">
            <Button variant="outlined" color="neutral" onClick={onClose} type="button">Batal</Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Menyimpan..." : isEdit ? "Simpan" : "Tambah"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
