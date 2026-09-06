"use client";

import Link from "next/link";
import { Bell, Menu, Settings, X } from "lucide-react";
import { useState } from "react";

export interface NavLink {
  label: string;
  href: string;
}

export interface NavbarProps {
  logoText?: string;
  links?: NavLink[];
  activeHref?: string;

  authenticated?: boolean;
  userInitial?: string;

  onSignIn?: () => void;
  onSignUp?: () => void;

  onNotificationClick?: () => void;
  onSettingsClick?: () => void;
  onProfileClick?: () => void;
}

const DEFAULT_LINKS: NavLink[] = [
  { label: "Beranda", href: "/" },
  { label: "Cari Tempat", href: "/cari" },
  { label: "Kegiatan", href: "/kegiatan" },
  { label: "Pengajuan Saya", href: "/pengajuan" },
];

export default function Navbar({
  logoText = "RuangSela",
  links = DEFAULT_LINKS,
  activeHref = "/",

  authenticated = false,
  userInitial = "A",

  onSignIn,
  onSignUp,

  onNotificationClick,
  onSettingsClick,
  onProfileClick,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/") {
      return activeHref === "/";
    }

    return activeHref.startsWith(href);
  };

  const handleSignIn = () => {
    setMobileMenuOpen(false);
    onSignIn?.();
  };

  const handleSignUp = () => {
    setMobileMenuOpen(false);
    onSignUp?.();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white">
      <nav
        aria-label="Navigasi utama"
        className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6"
      >
        {/* Logo */}
        <Link href="/" onClick={() => setMobileMenuOpen(false)}
          className="text-xl font-bold text-indigo-600"
        >
          {logoText}
        </Link>

        {/* Navigasi desktop */}
        <div className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={
                isActive(link.href)
                  ? "text-sm font-semibold text-indigo-600"
                  : "text-sm text-gray-600 transition-colors hover:text-gray-900"
              }
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Bagian kanan navbar */}
        <div className="flex items-center gap-1 sm:gap-2">
          {authenticated ? (
            /*
             * Layout kedua:
             * ditampilkan ketika pengguna sudah login
             */
            <>
              <button
                type="button"
                onClick={onNotificationClick}
                aria-label="Buka notifikasi"
                className="rounded-full p-2 text-gray-600 transition-colors hover:bg-gray-50 hover:text-indigo-600"
              >
                <Bell className="h-5 w-5" />
              </button>

              <button
                type="button"
                onClick={onSettingsClick}
                aria-label="Buka pengaturan"
                className="hidden rounded-full p-2 text-gray-600 transition-colors hover:bg-gray-50 hover:text-indigo-600 sm:inline-flex"
              >
                <Settings className="h-5 w-5" />
              </button>

              <button
                type="button"
                onClick={onProfileClick}
                aria-label="Buka profil"
                className="ml-1 flex h-9 w-9 items-center justify-center rounded-full bg-gray-900 text-sm font-bold text-white shadow-sm transition hover:ring-2 hover:ring-indigo-600 hover:ring-offset-2"
              >
                {userInitial.slice(0, 1).toUpperCase()}
              </button>
            </>
          ) : (
            /*
             * Layout pertama:
             * ditampilkan ketika pengguna belum login
             */
            <div className="hidden items-center gap-3 sm:flex">
              <button
                type="button"
                onClick={onSignIn}
                className="px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:text-gray-900"
              >
                Sign In
              </button>

              <button
                type="button"
                onClick={onSignUp}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
              >
                Sign Up
              </button>
            </div>
          )}

          {/* Tombol menu mobile */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((value) => !value)}
            aria-label={
              mobileMenuOpen ? "Tutup navigasi" : "Buka navigasi"
            }
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
            className="ml-1 rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-50 md:hidden"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </nav>

      {/* Navigasi mobile */}
      {mobileMenuOpen && (
        <div
          id="mobile-navigation"
          className="border-t border-gray-100 bg-white px-5 py-4 md:hidden"
        >
          <div className="flex flex-col gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={
                  isActive(link.href)
                    ? "rounded-lg bg-indigo-50 px-4 py-3 text-sm font-bold text-indigo-600"
                    : "rounded-lg px-4 py-3 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900"
                }
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Tombol autentikasi khusus mobile */}
          {!authenticated && (
            <div className="mt-4 grid grid-cols-2 gap-3 border-t border-gray-100 pt-4 sm:hidden">
              <button
                type="button"
                onClick={handleSignIn}
                className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
              >
                Sign In
              </button>

              <button
                type="button"
                onClick={handleSignUp}
                className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
              >
                Sign Up
              </button>
            </div>
          )}

          {/* Menu pengguna khusus mobile */}
          {authenticated && (
            <div className="mt-4 grid grid-cols-2 gap-3 border-t border-gray-100 pt-4 sm:hidden">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNotificationClick?.();
                }}
                className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
              >
                <Bell className="h-4 w-4" />
                Notifikasi
              </button>

              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onSettingsClick?.();
                }}
                className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
              >
                <Settings className="h-4 w-4" />
                Pengaturan
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}