"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInterceptor } from "@/config/axios.config";
import { getApi } from "@/utils/helpers/getApi";
import { endpoints } from "@/utils/constants/endpoints.const";
import { toast } from "sonner";
import { Button } from "@/components/custom-ui/Button";
import { TextField } from "@/components/custom-ui/TextField";
import { Select } from "@/components/custom-ui/Select";
import { ImageUpload } from "@/components/admin/shared/ImageUpload";
import { RichTextEditor } from "@/components/admin/shared/RichTextEditor";
import { CategorySelect } from "@/components/admin/articles/CategorySelect";
import type { Article, ArticlePayload } from "@/interface/admin.interface";

const schema = z.object({
  slug: z.string().min(1, "Slug wajib diisi"),
  category_id: z.string().min(1, "Pilih kategori"),
  featured_image: z.string().url("URL gambar tidak valid").or(z.literal("")),
  status: z.enum(["draft", "published"]),
  is_featured: z.boolean(),
  title_id: z.string().min(1, "Judul (ID) wajib diisi"),
  title_en: z.string().min(1, "Title (EN) is required"),
  excerpt_id: z.string().min(1, "Ringkasan (ID) wajib diisi"),
  excerpt_en: z.string().min(1, "Excerpt (EN) is required"),
  body_id: z.string().min(1, "Isi artikel (ID) wajib diisi"),
  body_en: z.string().min(1, "Article body (EN) is required"),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  article?: Article;
  onSuccess: () => void;
}

export function ArticleForm({ article, onSuccess }: Props) {
  const qc = useQueryClient();
  const isEdit = !!article;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      slug: article?.slug ?? "",
      category_id: article?.category_id ?? "",
      featured_image: article?.featured_image ?? "",
      status: article?.status ?? "draft",
      is_featured: article?.is_featured ?? false,
      title_id: article?.content.title_id ?? "",
      title_en: article?.content.title_en ?? "",
      excerpt_id: article?.content.excerpt_id ?? "",
      excerpt_en: article?.content.excerpt_en ?? "",
      body_id: article?.content.body_id ?? "",
      body_en: article?.content.body_en ?? "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const payload: ArticlePayload = {
        slug: values.slug,
        category_id: values.category_id,
        featured_image: values.featured_image,
        status: values.status,
        is_featured: values.is_featured,
        content: {
          title_id: values.title_id,
          title_en: values.title_en,
          excerpt_id: values.excerpt_id,
          excerpt_en: values.excerpt_en,
          body_id: values.body_id,
          body_en: values.body_en,
        },
      };
      if (isEdit) {
        return axiosInterceptor.put(
          getApi(endpoints.articles.update(article!.id)),
          payload,
        );
      }
      return axiosInterceptor.post(getApi(endpoints.articles.create), payload);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-articles"] });
      toast.success(isEdit ? "Artikel diperbarui" : "Artikel dibuat");
      onSuccess();
    },
  });

  const onSubmit = handleSubmit((values) => mutation.mutate(values));

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* ── Informasi Dasar ─────────────────────────────────────────────── */}
      <div className="rounded-lg border border-neutral-100 bg-white p-6">
        <h2 className="mb-4 text-sm font-semibold text-neutral-700">
          Informasi Dasar
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <TextField
            label="Slug URL"
            {...register("slug")}
            onChange={(e) => {
              const transformed = e.target.value
                .toLowerCase()
                .replace(/[\s\W_]+/g, "-")
                .replace(/^-+/, "");

              e.target.value = transformed;
              register("slug").onChange(e);
            }}
            error={errors.slug?.message}
          />

          <Controller
            name="category_id"
            control={control}
            render={({ field }) => (
              <CategorySelect
                value={field.value}
                onChange={field.onChange}
                error={errors.category_id?.message}
              />
            )}
          />

          <div className="sm:col-span-2">
            <Controller
              name="featured_image"
              control={control}
              render={({ field }) => (
                <ImageUpload
                  label="Gambar Featured"
                  folder="articles"
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.featured_image?.message}
                />
              )}
            />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-4">
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <Select
                label="Status"
                options={[
                  { value: "draft", label: "Draft" },
                  { value: "published", label: "Publikasikan" },
                ]}
                value={field.value}
                onChange={field.onChange}
                error={errors.status?.message}
                className="w-48"
              />
            )}
          />

          <label className="flex items-center gap-2 text-sm text-neutral-700">
            <input
              type="checkbox"
              {...register("is_featured")}
              className="h-4 w-4 accent-primary"
            />
            Artikel Unggulan
          </label>
        </div>
      </div>

      {/* ── Konten Bahasa Indonesia ──────────────────────────────────────── */}
      <div className="rounded-lg border border-neutral-100 bg-white p-6">
        <h2 className="mb-4 text-sm font-semibold text-neutral-700">
          Konten <span className="text-primary">Bahasa Indonesia</span>
        </h2>
        <div className="space-y-4">
          <TextField
            label="Judul (ID)"
            {...register("title_id")}
            error={errors.title_id?.message}
          />
          <TextField
            label="Ringkasan (ID)"
            {...register("excerpt_id")}
            error={errors.excerpt_id?.message}
          />
          <Controller
            name="body_id"
            control={control}
            render={({ field }) => (
              <RichTextEditor
                label="Isi Artikel (ID)"
                placeholder="Tulis isi artikel dalam Bahasa Indonesia..."
                value={field.value}
                onChange={field.onChange}
                error={errors.body_id?.message}
              />
            )}
          />
        </div>
      </div>

      {/* ── Content English ─────────────────────────────────────────────── */}
      <div className="rounded-lg border border-neutral-100 bg-white p-6">
        <h2 className="mb-4 text-sm font-semibold text-neutral-700">
          Content <span className="text-primary">English</span>
        </h2>
        <div className="space-y-4">
          <TextField
            label="Title (EN)"
            {...register("title_en")}
            error={errors.title_en?.message}
          />
          <TextField
            label="Excerpt (EN)"
            {...register("excerpt_en")}
            error={errors.excerpt_en?.message}
          />
          <Controller
            name="body_en"
            control={control}
            render={({ field }) => (
              <RichTextEditor
                label="Article Body (EN)"
                placeholder="Write article content in English..."
                value={field.value}
                onChange={field.onChange}
                error={errors.body_en?.message}
              />
            )}
          />
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending
            ? "Menyimpan..."
            : isEdit
              ? "Simpan Perubahan"
              : "Buat Artikel"}
        </Button>
      </div>
    </form>
  );
}
