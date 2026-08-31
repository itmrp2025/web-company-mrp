"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { axiosInterceptor } from "@/config/axios.config";
import { Button } from "@/components/custom-ui/Button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/custom-ui/Card";
import { TextField } from "@/components/custom-ui/TextField";
import { endpoints } from "@/utils/constants/endpoints.const";
import { getApi } from "@/utils/helpers/getApi";
import { useAuthStore } from "@/store/use-auth";
import { toast } from "sonner";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function AdminLoginPage() {
  const t = useTranslations("admin.login");
  const router = useRouter();
  const searchParams = useSearchParams();
  const setUser = useAuthStore((s) => s.setUser);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const loginMutation = useMutation({
    mutationFn: async (values: LoginFormValues) => {
      const res = await axiosInterceptor.post(getApi(endpoints.auth.login), values);
      return res.data;
    },
    onSuccess: (data) => {
      setUser(data.data);
      toast.success(data.message);
      const returnUrl = searchParams.get("returnURL") || "/admin";
      router.replace(returnUrl as never);
    },
    onError: () => {
      toast.error(t("invalidCredentials"));
    },
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
          <CardDescription>{t("subtitle")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit((values) => loginMutation.mutate(values))}
          >
            <TextField
              label={t("email")}
              type="email"
              error={errors.email?.message}
              {...register("email")}
            />
            <TextField
              label={t("password")}
              type="password"
              error={errors.password?.message}
              {...register("password")}
            />
            <Button type="submit" loading={loginMutation.isPending} className="mt-2">
              {t("submit")}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
