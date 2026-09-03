"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInterceptor } from "@/config/axios.config";
import { getApi } from "@/utils/helpers/getApi";
import { endpoints } from "@/utils/constants/endpoints.const";
import { toast } from "sonner";
import { Check, Trash2, Star } from "lucide-react";
import type { ApiResponse, Review } from "@/interface/admin.interface";

export default function AdminReviewsPage() {
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admin-reviews"],
    queryFn: async () => {
      const res = await axiosInterceptor.get<ApiResponse<Review[]>>(
        getApi(endpoints.reviews.adminList)
      );
      return res.data.data;
    },
  });

  const approveMutation = useMutation({
    mutationFn: (id: string) =>
      axiosInterceptor.patch(getApi(endpoints.reviews.approve(id))),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-reviews"] });
      toast.success("Ulasan disetujui");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      axiosInterceptor.delete(getApi(endpoints.reviews.delete(id))),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-reviews"] });
      toast.success("Ulasan dihapus");
    },
  });

  const pending = data?.filter((r) => r.status === "pending") ?? [];
  const approved = data?.filter((r) => r.status === "approved") ?? [];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-neutral-900">Ulasan</h1>
        <p className="mt-0.5 text-sm text-neutral-500">
          {pending.length} pending · {approved.length} disetujui
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16 text-sm text-neutral-400">Memuat...</div>
      ) : (
        <div className="space-y-8">
          {pending.length > 0 && (
            <div>
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-neutral-400">
                Menunggu Persetujuan ({pending.length})
              </h2>
              <div className="divide-y divide-neutral-100 rounded-lg border border-neutral-100 bg-white">
                {pending.map((review) => (
                  <ReviewRow
                    key={review.id}
                    review={review}
                    onApprove={() => approveMutation.mutate(review.id)}
                    onDelete={() => {
                      if (confirm("Hapus ulasan ini?")) deleteMutation.mutate(review.id);
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {approved.length > 0 && (
            <div>
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-neutral-400">
                Disetujui ({approved.length})
              </h2>
              <div className="divide-y divide-neutral-100 rounded-lg border border-neutral-100 bg-white">
                {approved.map((review) => (
                  <ReviewRow
                    key={review.id}
                    review={review}
                    onDelete={() => {
                      if (confirm("Hapus ulasan ini?")) deleteMutation.mutate(review.id);
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {!pending.length && !approved.length && (
            <div className="flex items-center justify-center py-16 text-sm text-neutral-400">
              Belum ada ulasan
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ReviewRow({
  review,
  onApprove,
  onDelete,
}: {
  review: Review;
  onApprove?: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex items-start gap-4 px-5 py-4">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="font-medium text-neutral-900 text-sm">{review.client_name}</p>
          {review.client_company && (
            <span className="text-xs text-neutral-400">— {review.client_company}</span>
          )}
          <div className="flex items-center gap-0.5 ml-auto">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-3.5 w-3.5 ${i < review.rating ? "fill-amber-400 text-amber-400" : "text-neutral-200"}`}
              />
            ))}
          </div>
        </div>
        <p className="mt-1.5 text-sm text-neutral-600 leading-relaxed">{review.review_text}</p>
        {review.service_type && (
          <p className="mt-1 text-xs text-neutral-400">Layanan: {review.service_type}</p>
        )}
      </div>
      <div className="flex shrink-0 items-center gap-2">
        {onApprove && (
          <button
            onClick={onApprove}
            className="flex items-center gap-1.5 rounded border border-green-200 bg-green-50 px-3 py-1.5 text-xs font-medium text-green-700 hover:bg-green-100 transition-colors"
          >
            <Check className="h-3.5 w-3.5" />
            Setujui
          </button>
        )}
        <button
          onClick={onDelete}
          className="rounded p-1.5 text-neutral-400 hover:bg-red-50 hover:text-red-600"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
