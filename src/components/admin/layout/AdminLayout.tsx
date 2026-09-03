import { AdminSidebar } from "./AdminSidebar";
import { AdminTopbar } from "./AdminTopbar";
import { SessionHydrator } from "@/components/admin/SessionHydrator";

interface AdminLayoutProps {
  children: React.ReactNode;
  locale: string;
  title?: string;
}

export function AdminLayout({ children, locale, title }: AdminLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-neutral-50">
      <SessionHydrator />
      <AdminSidebar locale={locale} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <AdminTopbar title={title} />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
