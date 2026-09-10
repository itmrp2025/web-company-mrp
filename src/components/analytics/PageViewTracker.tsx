"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import { getApi } from "@/utils/helpers/getApi";
import { endpoints } from "@/utils/constants/endpoints.const";

const SESSION_KEY = "mrp_session_id";

function getSessionId(): string {
  try {
    const existing = sessionStorage.getItem(SESSION_KEY);
    if (existing) return existing;

    const id = crypto.randomUUID();
    sessionStorage.setItem(SESSION_KEY, id);
    return id;
  } catch {
    // sessionStorage bisa diblokir (mode privat / cookie dimatikan).
    return "";
  }
}

/**
 * Mengirim satu pageview tiap kali path berubah.
 *
 * Dipasang di layout locale, jadi ikut hidup selama sesi berlangsung dan
 * menangkap navigasi antar halaman tanpa reload.
 */
export function PageViewTracker() {
  const pathname = usePathname();
  const locale = useLocale();

  // Path terakhir yang sudah dikirim. Tanpa penjaga ini, React Strict Mode
  // di dev menjalankan effect dua kali dan setiap kunjungan tercatat ganda.
  const lastSent = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname) return;

    // Aktivitas admin bukan kunjungan pengunjung — jangan dicatat.
    if (pathname.startsWith("/admin")) return;

    if (lastSent.current === pathname) return;
    lastSent.current = pathname;

    const payload = JSON.stringify({
      path: pathname,
      locale,
      referrer: document.referrer,
      session_id: getSessionId(),
    });

    const url = getApi(endpoints.analytics.pageview);

    try {
      // sendBeacon tidak menahan navigasi dan tetap terkirim saat halaman
      // ditinggalkan. Tidak semua browser punya, jadi ada cadangannya.
      if (navigator.sendBeacon) {
        navigator.sendBeacon(url, new Blob([payload], { type: "application/json" }));
      } else {
        fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: payload,
          keepalive: true,
        }).catch(() => {});
      }
    } catch {
      // Kegagalan pelacakan tidak boleh mengganggu pengunjung.
    }
  }, [pathname, locale]);

  return null;
}
