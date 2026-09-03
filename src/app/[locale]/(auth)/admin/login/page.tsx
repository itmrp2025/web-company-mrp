"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Image from "next/image";
import { axiosInterceptor } from "@/config/axios.config";
import { endpoints } from "@/utils/constants/endpoints.const";
import { getApi } from "@/utils/helpers/getApi";
import { useAuthStore } from "@/store/use-auth";
import { toast } from "sonner";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { Link } from "@/i18n/navigation";

function getLoginSchema(locale: string) {
  const id = locale === "id";
  return z.object({
    email: z
      .string()
      .min(1, id ? "Email wajib diisi" : "Email is required")
      .email(id ? "Format email tidak valid" : "Invalid email format"),
    password: z
      .string()
      .min(1, id ? "Kata sandi wajib diisi" : "Password is required")
      .min(6, id ? "Kata sandi minimal 6 karakter" : "Password must be at least 6 characters"),
  });
}

type LoginFormValues = { email: string; password: string };

export default function AdminLoginPage() {
  const t = useTranslations("admin.login");
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const setUser = useAuthStore((s) => s.setUser);
  const [showPassword, setShowPassword] = useState(false);

  const loginSchema = getLoginSchema(locale);

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
      const rawReturn = searchParams.get("returnURL") || `/${locale}/admin`;
      // Strip leading locale prefix to avoid double-prefixing via i18n router
      const localePrefix = `/${locale}`;
      const cleanPath = rawReturn.startsWith(localePrefix)
        ? rawReturn.slice(localePrefix.length) || "/admin"
        : rawReturn;
      router.replace(cleanPath as never);
    },
    onError: () => {
      toast.error(t("invalidCredentials"));
    },
  });

  return (
    <div className="flex min-h-screen bg-white">
      {/* Left panel — image + green overlay */}
      <div className="relative hidden lg:flex lg:w-[45%] flex-col justify-between overflow-hidden p-12">
        {/* Background image */}
        <Image
          src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1200&q=80&auto=format&fit=crop"
          alt=""
          fill
          className="object-cover"
          priority
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-neutral-950/70" />

        {/* Subtle pattern on top of overlay */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: "28px 28px",
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between h-full">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center bg-white/10 backdrop-blur-sm border border-white/20">
              <Image src="/logo-mrp.png" alt="MRP" width={28} height={28} className="object-contain brightness-0 invert" />
            </div>
            <div className="leading-none">
              <p className="font-sans text-sm font-semibold text-white">MRP Law Office</p>
              <p className="text-[10px] uppercase tracking-[0.14em] text-white/50">Advocates & Consultants</p>
            </div>
          </Link>

          <div>
            {/* Logo mark */}
            <div className="mb-8">
              <Image
                src="/logo-mrp.png"
                alt="MRP"
                width={72}
                height={72}
                className="object-contain brightness-0 invert opacity-80"
              />
            </div>
            <h2 className="mb-4 font-sans text-3xl font-semibold leading-snug text-white">
              {locale === "id"
                ? "Kelola konten website Anda dengan mudah"
                : "Manage your website content with ease"}
            </h2>
            <p className="text-sm leading-relaxed text-white/60">
              {locale === "id"
                ? "Panel administrasi terpadu untuk mengelola artikel, layanan, tim, dan semua konten MRP Law Office."
                : "Unified administration panel to manage articles, services, team, and all MRP Law Office content."}
            </p>
          </div>

          <p className="text-xs text-white/30">
            © {new Date().getFullYear()} MRP Law Office. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 lg:px-16">
        {/* Mobile logo */}
        <div className="mb-10 flex flex-col items-center gap-2 lg:hidden">
          <Image src="/logo-mrp.png" alt="MRP Law Office" width={56} height={56} className="object-contain" />
          <div className="text-center leading-none mt-1">
            <p className="font-sans text-sm font-semibold text-neutral-900">MRP Law Office</p>
            <p className="text-[10px] uppercase tracking-[0.14em] text-neutral-400">Advocates & Consultants</p>
          </div>
        </div>

        <div className="w-full max-w-sm">
          <div className="mb-8">
            <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-primary">
              {locale === "id" ? "Portal Admin" : "Admin Portal"}
            </p>
            <h1 className="font-sans text-2xl font-semibold text-neutral-900">
              {t("title")}
            </h1>
            <p className="mt-1.5 text-sm text-neutral-500">{t("subtitle")}</p>
          </div>

          <form
            className="flex flex-col gap-5"
            onSubmit={handleSubmit((values) => loginMutation.mutate(values))}
          >
            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-neutral-700">{t("email")}</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                <input
                  type="email"
                  autoComplete="email"
                  placeholder={locale === "id" ? "nama@email.com" : "name@email.com"}
                  className={`h-11 w-full border bg-neutral-50 pl-10 pr-4 text-sm text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary ${errors.email ? "border-red-400 focus:border-red-400 focus:ring-red-400" : "border-neutral-200"}`}
                  {...register("email")}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-neutral-700">{t("password")}</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className={`h-11 w-full border bg-neutral-50 pl-10 pr-11 text-sm text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary ${errors.password ? "border-red-400 focus:border-red-400 focus:ring-red-400" : "border-neutral-200"}`}
                  {...register("password")}
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-500">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="mt-1 flex h-11 w-full items-center justify-center gap-2 bg-primary text-sm font-semibold text-white transition-all hover:bg-primary/90 disabled:opacity-60"
            >
              {loginMutation.isPending ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  {locale === "id" ? "Memproses..." : "Signing in..."}
                </>
              ) : t("submit")}
            </button>
          </form>

          <div className="mt-8 border-t border-neutral-100 pt-6">
            <Link
              href="/"
              className="flex items-center justify-center gap-2 text-xs text-neutral-400 hover:text-primary transition-colors"
            >
              ← {locale === "id" ? "Kembali ke website" : "Back to website"}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
