"use client";

import { usePathname, useRouter } from "next/navigation";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import Navbar from "@/app/components/Navbar";

export default function PublicNavbar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleNotificationClick = () => {
    router.push("/notifications");
  };

  const handleSettingsClick = () => {
    router.push("/settings");
  };

  const handleProfileClick = () => {
    router.push("/profile/andi-wijaya");
  };

  return (
    <Navbar
      activeHref={pathname}
      authenticated
      userInitial="A"
      onNotificationClick={handleNotificationClick}
      onSettingsClick={handleSettingsClick}
      onProfileClick={handleProfileClick}
    />
  );
}
