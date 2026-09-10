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
import type {
  TeamMember,
  TeamMemberPayload,
} from "@/interface/admin.interface";

const schema = z.object({
  slug: z.string().min(1, "Slug wajib diisi"),
  role_type: z.string().min(1, "Tipe peran wajib dipilih"),
  order_index: z.number().int().min(0, "Urutan tidak boleh negatif"),
  photo_url: z.string().url("Format URL foto tidak valid").or(z.literal("")),
  linkedin_url: z
    .string()
    .url("Format URL LinkedIn tidak valid")
    .or(z.literal("")),
  instagram_url: z
    .string()
    .url("Format URL Instagram tidak valid")
    .or(z.literal("")),
  is_visible: z.boolean(),
  name_id: z.string().min(1, "Nama (Indonesia) wajib diisi"),
  name_en: z.string().min(1, "Nama (Inggris) wajib diisi"),
  title_id: z.string().min(1, "Jabatan (Indonesia) wajib diisi"),
  title_en: z.string().min(1, "Jabatan (Inggris) wajib diisi"),
  bio_id: z.string().min(1, "Bio (Indonesia) wajib diisi"),
  bio_en: z.string().min(1, "Bio (Inggris) wajib diisi"),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  member: TeamMember | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function TeamMemberModal({ member, onClose, onSuccess }: Props) {
  const isEdit = !!member;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      slug: member?.slug ?? "",
      role_type: member?.role_type ?? "associate",
      order_index: member?.order_index ?? 0,
      photo_url: member?.photo_url ?? "",
      linkedin_url: member?.linkedin_url ?? "",
      instagram_url: member?.instagram_url ?? "",
      is_visible: member?.is_visible ?? true,
      name_id: member?.content.name_id ?? "",
      name_en: member?.content.name_en ?? "",
      title_id: member?.content.title_id ?? "",
      title_en: member?.content.title_en ?? "",
      bio_id: member?.content.bio_id ?? "",
      bio_en: member?.content.bio_en ?? "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const payload: TeamMemberPayload = {
        slug: values.slug,
        role_type: values.role_type,
        order_index: values.order_index,
        photo_url: values.photo_url,
        linkedin_url: values.linkedin_url,
        instagram_url: values.instagram_url,
        is_visible: values.is_visible,
        content: {
          name_id: values.name_id,
          name_en: values.name_en,
          title_id: values.title_id,
          title_en: values.title_en,
          bio_id: values.bio_id,
          bio_en: values.bio_en,
          specializations: member?.content.specializations ?? [],
          languages: member?.content.languages ?? [],
        },
      };
      if (isEdit) {
        return axiosInterceptor.put(
          getApi(endpoints.team.update(member!.id)),
          payload,
        );
      }
      return axiosInterceptor.post(getApi(endpoints.team.create), payload);
    },
    onSuccess: () => {
      toast.success(
        isEdit ? "Anggota tim diperbarui" : "Anggota tim ditambahkan",
      );
      onSuccess();
    },
  });

  const onSubmit = handleSubmit((values: FormValues) =>
    mutation.mutate(values),
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4 pt-10">
      <div className="w-full max-w-xl rounded-lg border border-neutral-100 bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-neutral-100 px-6 py-4">
          <h2 className="text-base font-semibold text-neutral-900">
            {isEdit ? "Edit Anggota Tim" : "Tambah Anggota Tim"}
          </h2>
          <button
            onClick={onClose}
            className="rounded p-1 text-neutral-400 hover:text-neutral-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="divide-y divide-neutral-50">
          {/* Info dasar */}
          <div className="space-y-4 px-6 py-5">
            <div className="grid grid-cols-2 gap-4">
              <TextField
                label="Slug"
                {...register("slug")}
                error={errors.slug?.message}
                onChange={(e) => {
                  const transformed = e.target.value
                    .toLowerCase()
                    .replace(/[\s\W_]+/g, "-")
                    .replace(/^-+/, "");

                  e.target.value = transformed;
                  register("slug").onChange(e);
                }}
              />
              <div>
                <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                  Tipe Role
                </label>
                <select
                  {...register("role_type")}
                  className="w-full rounded border border-neutral-200 px-3 py-2 text-sm focus:border-primary focus:outline-none"
                >
                  <option value="magang">Magang</option>
                  <option value="trainee">Trainee</option>
                  <option value="junior_associate">Junior Associate</option>
                  <option value="associate">Associate</option>
                  <option value="intermediate_associate">
                    Intermediate Associate
                  </option>
                  <option value="senior_associate">Senior Associate</option>
                  <option value="partner">Partner</option>
                  <option value="senior_partner">Senior Partner</option>
                  <option value="managing_partner">Managing Partner</option>
                  <option value="equity_partner">Equity Partner</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <TextField
                label="Order"
                type="number"
                {...register("order_index", { valueAsNumber: true })}
                error={errors.order_index?.message}
              />
              <div className="flex items-end pb-1">
                <label className="flex items-center gap-2 text-sm text-neutral-700">
                  <input
                    type="checkbox"
                    {...register("is_visible")}
                    className="h-4 w-4 accent-primary"
                  />
                  Tampilkan di website
                </label>
              </div>
            </div>
            <Controller
              name="photo_url"
              control={control}
              render={({ field }) => (
                <ImageUpload
                  label="Foto"
                  folder="team"
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.photo_url?.message}
                />
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <TextField
                label="LinkedIn URL"
                {...register("linkedin_url")}
                error={errors.linkedin_url?.message}
              />
              <TextField
                label="Instagram URL"
                {...register("instagram_url")}
                error={errors.instagram_url?.message}
              />
            </div>
          </div>

          {/* Konten ID */}
          <div className="space-y-4 px-6 py-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
              Bahasa Indonesia
            </p>
            <TextField
              label="Nama (ID)"
              {...register("name_id")}
              error={errors.name_id?.message}
            />
            <TextField
              label="Jabatan (ID)"
              {...register("title_id")}
              error={errors.title_id?.message}
            />
            <div>
              <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                Bio (ID)
              </label>
              <textarea
                {...register("bio_id")}
                rows={4}
                className="w-full rounded border border-neutral-200 px-3 py-2 text-sm focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          {/* Konten EN */}
          <div className="space-y-4 px-6 py-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
              English
            </p>
            <TextField
              label="Name (EN)"
              {...register("name_en")}
              error={errors.name_en?.message}
            />
            <TextField
              label="Title (EN)"
              {...register("title_en")}
              error={errors.title_en?.message}
            />
            <div>
              <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                Bio (EN)
              </label>
              <textarea
                {...register("bio_en")}
                rows={4}
                className="w-full rounded border border-neutral-200 px-3 py-2 text-sm focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 px-6 py-4">
            <Button
              variant="outlined"
              color="neutral"
              onClick={onClose}
              type="button"
            >
              Batal
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending
                ? "Menyimpan..."
                : isEdit
                  ? "Simpan"
                  : "Tambah"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
