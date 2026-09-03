"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/use-auth";
import { axiosInterceptor } from "@/config/axios.config";
import { getApi } from "@/utils/helpers/getApi";
import { endpoints } from "@/utils/constants/endpoints.const";
import type { ApiResponse } from "@/interface/admin.interface";
import type { AdminUser } from "@/store/use-auth";

export function SessionHydrator() {
  const { user, isLoaded, setUser } = useAuthStore();

  useEffect(() => {
    if (isLoaded) return;
    axiosInterceptor
      .get<ApiResponse<AdminUser>>(getApi(endpoints.auth.me))
      .then((res) => setUser(res.data.data))
      .catch(() => setUser(null));
  }, [isLoaded, setUser]);

  return null;
}
