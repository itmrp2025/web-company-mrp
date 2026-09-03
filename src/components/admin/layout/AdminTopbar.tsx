"use client";

import { useAuthStore } from "@/store/use-auth";
import { Avatar } from "@/components/custom-ui/Avatar";
import { Bell } from "lucide-react";

export function AdminTopbar({ title }: { title?: string }) {
  const user = useAuthStore((s) => s.user);

  return (
    <header className="flex h-16 items-center justify-between border-b border-neutral-100 bg-white px-6">
      <div>
        {title && <h1 className="text-lg font-semibold text-neutral-900">{title}</h1>}
      </div>

      <div className="flex items-center gap-3">
        <button className="flex h-9 w-9 items-center justify-center rounded-lg text-neutral-500 transition-colors hover:bg-neutral-50 hover:text-neutral-900">
          <Bell className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-2">
          <Avatar
            fallback={user?.name ?? "Admin"}
            size="sm"
          />
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-neutral-900">{user?.name ?? "Admin"}</p>
            <p className="text-xs text-neutral-500 capitalize">{user?.role?.replace("_", " ")}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
