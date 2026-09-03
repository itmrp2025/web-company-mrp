"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useQuery, useMutation } from "@tanstack/react-query";
import { axiosInterceptor } from "@/config/axios.config";
import { getApi } from "@/utils/helpers/getApi";
import { endpoints } from "@/utils/constants/endpoints.const";
import { toast } from "sonner";
import { Button } from "@/components/custom-ui/Button";
import { TextField } from "@/components/custom-ui/TextField";

interface SettingsForm {
  site_name: string;
  site_tagline_id: string;
  site_tagline_en: string;
  contact_email: string;
  contact_phone: string;
  contact_address: string;
  office_hours_id: string;
  office_hours_en: string;
  whatsapp_number: string;
  google_maps_embed: string;
}

export default function AdminSettingsGeneralPage() {
  const { data: settings, isLoading } = useQuery({
    queryKey: ["admin-settings"],
    queryFn: async () => {
      const res = await axiosInterceptor.get<{ success: boolean; data: Record<string, unknown> }>(
        getApi(endpoints.cms.settings)
      );
      return res.data.data;
    },
  });

  const { register, handleSubmit, reset } = useForm<SettingsForm>();

  useEffect(() => {
    if (!settings) return;
    reset({
      site_name: (settings.site_name as string) ?? "",
      site_tagline_id: (settings.site_tagline_id as string) ?? "",
      site_tagline_en: (settings.site_tagline_en as string) ?? "",
      contact_email: (settings.contact_email as string) ?? "",
      contact_phone: (settings.contact_phone as string) ?? "",
      contact_address: (settings.contact_address as string) ?? "",
      office_hours_id: (settings.office_hours_id as string) ?? "",
      office_hours_en: (settings.office_hours_en as string) ?? "",
      whatsapp_number: (settings.whatsapp_number as string) ?? "",
      google_maps_embed: (settings.google_maps_embed as string) ?? "",
    });
  }, [settings, reset]);

  const mutation = useMutation({
    mutationFn: async (values: SettingsForm) => {
      return axiosInterceptor.put(getApi(endpoints.cms.adminUpdateSettings), values);
    },
    onSuccess: () => toast.success("Pengaturan disimpan"),
  });

  if (isLoading) {
    return <div className="flex items-center justify-center py-20 text-sm text-neutral-400">Memuat...</div>;
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-neutral-900">Pengaturan Umum</h1>
        <p className="mt-0.5 text-sm text-neutral-500">Informasi dasar dan kontak kantor</p>
      </div>

      <form onSubmit={handleSubmit((v) => mutation.mutate(v))} className="space-y-6">
        {/* Identitas */}
        <div className="rounded-lg border border-neutral-100 bg-white p-6">
          <h2 className="mb-4 text-sm font-semibold text-neutral-700">Identitas Website</h2>
          <div className="space-y-4">
            <TextField label="Nama Website" {...register("site_name")} />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <TextField label="Tagline (Indonesia)" {...register("site_tagline_id")} />
              <TextField label="Tagline (English)" {...register("site_tagline_en")} />
            </div>
          </div>
        </div>

        {/* Kontak */}
        <div className="rounded-lg border border-neutral-100 bg-white p-6">
          <h2 className="mb-4 text-sm font-semibold text-neutral-700">Informasi Kontak</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <TextField label="Email" type="email" {...register("contact_email")} />
              <TextField label="Telepon" {...register("contact_phone")} />
              <TextField label="WhatsApp" {...register("whatsapp_number")} />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-neutral-700">Alamat Kantor</label>
              <textarea
                {...register("contact_address")}
                rows={3}
                className="w-full rounded border border-neutral-200 px-3 py-2 text-sm focus:border-primary focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Jam operasional */}
        <div className="rounded-lg border border-neutral-100 bg-white p-6">
          <h2 className="mb-4 text-sm font-semibold text-neutral-700">Jam Operasional</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-neutral-700">Jam Operasional (Indonesia)</label>
              <textarea
                {...register("office_hours_id")}
                rows={3}
                className="w-full rounded border border-neutral-200 px-3 py-2 text-sm focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-neutral-700">Office Hours (English)</label>
              <textarea
                {...register("office_hours_en")}
                rows={3}
                className="w-full rounded border border-neutral-200 px-3 py-2 text-sm focus:border-primary focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Google Maps */}
        <div className="rounded-lg border border-neutral-100 bg-white p-6">
          <h2 className="mb-4 text-sm font-semibold text-neutral-700">Google Maps</h2>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-neutral-700">Embed URL Google Maps</label>
            <textarea
              {...register("google_maps_embed")}
              rows={3}
              placeholder="https://www.google.com/maps/embed?pb=..."
              className="w-full rounded border border-neutral-200 px-3 py-2 text-sm focus:border-primary focus:outline-none"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? "Menyimpan..." : "Simpan Pengaturan"}
          </Button>
        </div>
      </form>
    </div>
  );
}
