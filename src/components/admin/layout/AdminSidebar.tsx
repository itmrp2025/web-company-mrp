"use client";

import { usePathname } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import Image from "next/image";
import {
  LayoutDashboard,
  FileText,
  Users,
  Briefcase,
  Star,
  Newspaper,
  Settings,
  Image as ImageIcon,
  BarChart2,
  LogOut,
  ChevronRight,
  HelpCircle,
  Search,
} from "lucide-react";
import { useAuthStore } from "@/store/use-auth";
import { useRouter } from "@/i18n/navigation";
import { axiosInterceptor } from "@/config/axios.config";
import { getApi } from "@/utils/helpers/getApi";
import { endpoints } from "@/utils/constants/endpoints.const";
import { toast } from "sonner";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  {
    label: "Konten",
    items: [
      { href: "/admin/pages/home", label: "Halaman Home", icon: FileText },
      { href: "/admin/pages/about", label: "Tentang Kami", icon: FileText },
      { href: "/admin/pages/services", label: "Layanan", icon: Briefcase },
      { href: "/admin/pages/team", label: "Tim", icon: Users },
      { href: "/admin/pages/contact", label: "Kontak", icon: FileText },
      { href: "/admin/pages/faq", label: "FAQ", icon: HelpCircle },
      { href: "/admin/pages/career", label: "Karir", icon: Briefcase },
      { href: "/admin/pages/gallery", label: "Galeri", icon: ImageIcon },
      { href: "/admin/pages/articles", label: "Artikel", icon: FileText },
    ],
  },
  { href: "/admin/articles", label: "Artikel", icon: Newspaper },
  { href: "/admin/team", label: "Tim", icon: Users },
  { href: "/admin/services", label: "Layanan", icon: Briefcase },
  { href: "/admin/reviews", label: "Ulasan", icon: Star },
  { href: "/admin/career", label: "Karir", icon: Briefcase },
  { href: "/admin/media", label: "Media", icon: ImageIcon },
  { href: "/admin/faq", label: "FAQ", icon: HelpCircle },
  { href: "/admin/seo", label: "SEO", icon: Search },
  { href: "/admin/analytics", label: "Analitik", icon: BarChart2 },
  {
    label: "Pengaturan",
    items: [
      { href: "/admin/settings/general", label: "Umum", icon: Settings },
      { href: "/admin/settings/navigation", label: "Navigasi", icon: Settings },
    ],
  },
];

export function AdminSidebar({ locale }: { locale: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);

  const handleLogout = async () => {
    try {
      await axiosInterceptor.delete(getApi(endpoints.auth.logout));
    } catch {
      // ignore
    }
    logout();
    toast.success("Berhasil logout");
    router.replace("/admin/login");
  };

  const isActive = (href: string) => {
    const localePath = `/${locale}${href}`;
    return pathname === localePath || (href !== "/admin" && pathname.startsWith(localePath));
  };

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-neutral-100 bg-white">
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-neutral-100 px-5">
        <Link href="/admin" className="flex items-center gap-2.5">
          <Image
            src="/logo-mrp.png"
            alt="MRP Law Office"
            width={32}
            height={32}
            className="object-contain"
          />
          <div className="leading-none">
            <p className="text-sm font-semibold text-neutral-900">MRP Law Office</p>
            <p className="text-[9px] uppercase tracking-widest text-neutral-400">Admin Panel</p>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {navItems.map((item, idx) => {
          if ("items" in item && item.items) {
            return (
              <div key={idx} className="mb-4">
                <p className="mb-1 px-3 text-xs font-medium uppercase tracking-wider text-neutral-400">
                  {item.label}
                </p>
                {item.items.map((sub) => (
                  <SidebarLink key={sub.href} href={sub.href} label={sub.label} Icon={sub.icon} active={isActive(sub.href)} />
                ))}
              </div>
            );
          }
          if ("href" in item) {
            return (
              <SidebarLink key={item.href} href={item.href} label={item.label} Icon={item.icon} active={isActive(item.href)} />
            );
          }
          return null;
        })}
      </nav>

      {/* Logout */}
      <div className="border-t border-neutral-100 p-3">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-neutral-600 transition-colors hover:bg-neutral-50 hover:text-neutral-900"
        >
          <LogOut className="h-4 w-4" />
          Keluar
        </button>
      </div>
    </aside>
  );
}

function SidebarLink({
  href,
  label,
  Icon,
  active,
}: {
  href: string;
  label: string;
  Icon: React.ElementType;
  active: boolean;
}) {
  return (
    <Link
      href={href as Parameters<typeof Link>[0]["href"]}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
        active
          ? "bg-primary/10 font-medium text-primary"
          : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
      )}
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span className="flex-1">{label}</span>
      {active && <ChevronRight className="h-3 w-3 opacity-50" />}
    </Link>
  );
}
