"use client";

import { useForm, Controller } from "react-hook-form";
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
import { ImageUpload } from "@/components/admin/shared/ImageUpload";
import type { Service, ServicePayload } from "@/interface/admin.interface";

const schema = z.object({
  slug: z.string().min(1, "Slug wajib diisi"),
  icon: z.string(),
  cover_image_url: z.string().url("Format URL gambar tidak valid").or(z.literal("")),
  order_index: z.number().int().min(0, "Urutan tidak boleh negatif"),
  is_featured: z.boolean(),
  is_active: z.boolean(),
  name_id: z.string().min(1, "Nama layanan (Indonesia) wajib diisi"),
  name_en: z.string().min(1, "Nama layanan (Inggris) wajib diisi"),
  short_desc_id: z.string().min(1, "Deskripsi singkat (Indonesia) wajib diisi"),
  short_desc_en: z.string().min(1, "Deskripsi singkat (Inggris) wajib diisi"),
  description_id: z.string(),
  description_en: z.string(),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  service: Service | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function ServiceModal({ service, onClose, onSuccess }: Props) {
  const isEdit = !!service;

  const { register, handleSubmit, control, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      slug: service?.slug ?? "",
      icon: service?.icon ?? "",
      cover_image_url: service?.cover_image_url ?? "",
      order_index: service?.order_index ?? 0,
      is_featured: service?.is_featured ?? false,
      is_active: service?.is_active ?? true,
      name_id: service?.content.name_id ?? "",
      name_en: service?.content.name_en ?? "",
      short_desc_id: service?.content.short_desc_id ?? "",
      short_desc_en: service?.content.short_desc_en ?? "",
      description_id: service?.content.description_id ?? "",
      description_en: service?.content.description_en ?? "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const payload: ServicePayload = {
        slug: values.slug,
        icon: values.icon,
        cover_image_url: values.cover_image_url,
        order_index: values.order_index,
        is_featured: values.is_featured,
        is_active: values.is_active,
        content: {
          name_id: values.name_id,
          name_en: values.name_en,
          short_desc_id: values.short_desc_id,
          short_desc_en: values.short_desc_en,
          description_id: values.description_id,
          description_en: values.description_en,
        },
      };
      if (isEdit) {
        return axiosInterceptor.put(getApi(endpoints.services.update(service!.id)), payload);
      }
      return axiosInterceptor.post(getApi(endpoints.services.create), payload);
    },
    onSuccess: () => {
      toast.success(isEdit ? "Layanan diperbarui" : "Layanan ditambahkan");
      onSuccess();
    },
  });

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4 pt-10">
      <div className="w-full max-w-xl rounded-lg border border-neutral-100 bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-neutral-100 px-6 py-4">
          <h2 className="text-base font-semibold text-neutral-900">
            {isEdit ? "Edit Layanan" : "Tambah Layanan"}
          </h2>
          <button onClick={onClose} className="rounded p-1 text-neutral-400 hover:text-neutral-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit((v: FormValues) => mutation.mutate(v))} className="divide-y divide-neutral-50">
          <div className="space-y-4 px-6 py-5">
            <div className="grid grid-cols-2 gap-4">
              <TextField label="Slug" {...register("slug")} error={errors.slug?.message} />
              <TextField label="Icon (nama lucide)" {...register("icon")} error={errors.icon?.message} />
            </div>
            <Controller
              name="cover_image_url"
              control={control}
              render={({ field }) => (
                <ImageUpload
                  label="Gambar Cover"
                  folder="services"
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.cover_image_url?.message}
                />
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <TextField label="Order" type="number" {...register("order_index", { valueAsNumber: true })} />
              <div className="flex items-end gap-4 pb-1">
                <label className="flex items-center gap-2 text-sm text-neutral-700">
                  <input type="checkbox" {...register("is_active")} className="h-4 w-4 accent-primary" />
                  Aktif
                </label>
                <label className="flex items-center gap-2 text-sm text-neutral-700">
                  <input type="checkbox" {...register("is_featured")} className="h-4 w-4 accent-primary" />
                  Unggulan
                </label>
              </div>
            </div>
          </div>

          <div className="space-y-4 px-6 py-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Bahasa Indonesia</p>
            <TextField label="Nama (ID)" {...register("name_id")} error={errors.name_id?.message} />
            <TextField label="Deskripsi Singkat (ID)" {...register("short_desc_id")} error={errors.short_desc_id?.message} />
            <div>
              <label className="mb-1.5 block text-sm font-medium text-neutral-700">Deskripsi Lengkap (ID)</label>
              <textarea {...register("description_id")} rows={4}
                className="w-full rounded border border-neutral-200 px-3 py-2 text-sm focus:border-primary focus:outline-none" />
            </div>
          </div>

          <div className="space-y-4 px-6 py-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">English</p>
            <TextField label="Name (EN)" {...register("name_en")} error={errors.name_en?.message} />
            <TextField label="Short Description (EN)" {...register("short_desc_en")} error={errors.short_desc_en?.message} />
            <div>
              <label className="mb-1.5 block text-sm font-medium text-neutral-700">Description (EN)</label>
              <textarea {...register("description_en")} rows={4}
                className="w-full rounded border border-neutral-200 px-3 py-2 text-sm focus:border-primary focus:outline-none" />
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
