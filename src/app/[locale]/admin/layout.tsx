import { AdminLayout } from "@/components/admin/layout/AdminLayout";

export default async function AdminSectionLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return <AdminLayout locale={locale}>{children}</AdminLayout>;
}
