"use client";

import Link from "next/link";
import { Globe2, Share2 } from "lucide-react";

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterColumn {
  title: string;
  links: FooterLink[];
}

export interface FooterProps {
  brandName?: string;
  tagline?: string;
  columns?: FooterColumn[];
  year?: number;
  copyrightNote?: string;
  onLanguageClick?: () => void;
  onShareClick?: () => void;
}

const DEFAULT_COLUMNS: FooterColumn[] = [
  {
    title: "Platform",
    links: [
      { label: "Cari Ruang", href: "/cari" },   
      { label: "Daftarkan Ruang", href: "/daftar" },
      { label: "Acara Komunitas", href: "/acara" },
    ],
  },
  {
    title: "Tentang",
    links: [
      { label: "Kisah Kami", href: "/tentang" },
      { label: "Pusat Bantuan", href: "/bantuan" },
      { label: "Kontak", href: "/kontak" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Syarat & Ketentuan", href: "/syarat" },
      { label: "Kebijakan Privasi", href: "/privasi" },
    ],
  },
];

export default function Footer({
  brandName = "RuangSela",
  tagline = "Menghubungkan masyarakat dengan ruang publik dan fasilitas untuk mendukung kolaborasi dan inovasi warga.",
  columns = DEFAULT_COLUMNS,
  year = new Date().getFullYear(),
  copyrightNote = "Digital Citizenship for All.",
  onLanguageClick,
  onShareClick,
}: FooterProps) {
  return (
    <footer className="w-full bg-gradient-to-br from-[#1a0f3d] to-[#4c3399] text-white">
      <div className="max-w-6xl mx-auto px-6 pt-14 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr_1fr_1fr] gap-10">
          <div>
            <h3 className="text-2xl font-bold mb-3">{brandName}</h3>
            <p className="text-sm text-indigo-200 leading-relaxed max-w-xs">
              {tagline}
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold mb-4">{col.title}</h4>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-indigo-200 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/15 mt-10 pt-5 flex items-center justify-between">
          <p className="text-xs text-indigo-200">
            © {year} {brandName}. {copyrightNote}
          </p>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={onLanguageClick}
              aria-label="Ganti bahasa"
              className="text-indigo-200 hover:text-white transition-colors"
            >
              <Globe2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onShareClick}
              aria-label="Bagikan"
              className="text-indigo-200 hover:text-white transition-colors"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}