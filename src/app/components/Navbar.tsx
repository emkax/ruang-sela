"use client";

import Link from "next/link";

export interface NavLink {
  label: string;
  href: string;
}

export interface NavbarProps {
  logoText?: string;
  links?: NavLink[];
  activeHref?: string;
  onSignIn?: () => void;
  onSignUp?: () => void;
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
  onSignIn,
  onSignUp,
}: NavbarProps) {
  return (
    <nav className="w-full bg-white border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-indigo-600">
          {logoText}
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => {
            const isActive = link.href === activeHref;
            return (
              <Link
                key={link.label}
                href={link.href}
                className={
                  isActive
                    ? "text-indigo-600 font-semibold text-sm"
                    : "text-gray-600 hover:text-gray-900 text-sm transition-colors"
                }
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onSignIn}
            className="text-sm font-medium text-gray-700 hover:text-gray-900 px-3 py-2 transition-colors"
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={onSignUp}
            className="text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg px-4 py-2 transition-colors"
          >
            Sign Up
          </button>
        </div>
      </div>
    </nav>
  );
}
