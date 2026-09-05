import Link from "next/link";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import CardTrending from "@/app/components/CardTrending";
import CardRecommend from "./components/CardRecommend";
import CardAvailable from "./components/CardAvailable";
import SearchBar from "./components/SearchBar";

import {
  MapPin,
  Star,
  BadgeCheck,
  Heart,
  Users,
  Wifi,
  Snowflake,
} from "lucide-react";

import { ArrowRight, CheckCircle2, Leaf, ShieldCheck } from "lucide-react";

const highlights = [
  {
    icon: Leaf,
    title: "Berorientasi Dampak",
    text: "Hubungkan fitur dengan indikator SDG yang dapat diukur.",
  },
  {
    icon: ShieldCheck,
    title: "Aman Sejak Awal",
    text: "Validasi server, secret terisolasi, dan error yang aman.",
  },
  {
    icon: CheckCircle2,
    title: "Siap Didemokan",
    text: "Loading, empty, error, success, health check, dan skenario cadangan.",
  },
];

const trendingSpaces = [
  {
    imageSrc: "/images/image.png",
    title: "Ruang Kreatif",
    location: "Jakarta Selatan",
    rating: 4.8,
    capacity: 20,
  },
  {
    imageSrc: "/images/image.png",
    title: "Studio Seni",
    location: "Jakarta Pusat",
    rating: 4.7,
    capacity: 15,
  },
  {
    imageSrc: "/images/image.png",
    title: "Creative Hub",
    location: "Jakarta Barat",
    rating: 4.9,
    capacity: 30,
  },
  {
    imageSrc: "/images/image.png",
    title: "Creative Hub",
    location: "Jakarta Barat",
    rating: 4.9,
    capacity: 30,
  },
];

const recommendedSpaces = [
  {
    imageSrc: "/images/image.png",
    title: "Ruang Kolaborasi Menteng",
    description:
      "Ruang nyaman untuk bekerja, berdiskusi, dan berkolaborasi bersama komunitas.",
    rating: 4.8,
    areaTag: "Jakarta Pusat",
    href: "/ruang/kolaborasi-menteng",
  },
  {
    imageSrc: "/images/image.png",
    title: "Creative Space Senayan",
    description:
      "Tempat kreatif dengan fasilitas lengkap untuk berbagai kebutuhan komunitas.",
    rating: 4.7,
    areaTag: "Jakarta Selatan",
    href: "/ruang/creative-space-senayan",
  },
  {
    imageSrc: "/images/recommend3.png",
    title: "Studio Komunitas",
    description:
      "Ruang fleksibel yang cocok untuk workshop, meeting, dan kegiatan komunitas.",
    rating: 4.9,
    areaTag: "Jakarta Barat",
    href: "/ruang/studio-komunitas",
  },
  {
    imageSrc: "/images/recommend4.png",
    title: "Ruang Kreatif Jakarta",
    description:
      "Ruang publik untuk mendukung kegiatan kreatif dan kolaborasi masyarakat.",
    rating: 4.6,
    areaTag: "Jakarta Timur",
    href: "/ruang/ruang-kreatif",
  },
];

const availableSpaces = [
  {
    imageSrc: "/images/available1.png",
    title: "Ruang Kreatif Kemang",
    location: "Jakarta Selatan",
    distanceKm: 2.4,
    rating: 4.8,
    verified: true,
    tags: [
      { type: "capacity", label: "20 orang" },
      { type: "wifi", label: "WiFi" },
      { type: "ac", label: "AC" },
    ],
    price: 150000,
    priceUnit: "sesi",
  },
  {
    imageSrc: "/images/available2.png",
    title: "Community Hub Senayan",
    location: "Jakarta Selatan",
    distanceKm: 3.1,
    rating: 4.7,
    verified: true,
    tags: [
      { type: "capacity", label: "30 orang" },
      { type: "wifi", label: "WiFi" },
    ],

    price: 200000,
    priceUnit: "sesi",
  },
  {
    imageSrc: "/images/available3.png",
    title: "Studio Kolaborasi Menteng",
    location: "Jakarta Pusat",
    distanceKm: 5.2,
    rating: 4.9,
    verified: true,
    tags: [
      { type: "capacity", label: "20 orang" },
      { type: "wifi", label: "WiFi" },
      { type: "ac", label: "AC" },
    ],
    price: 125000,
    priceUnit: "sesi",
  },
  {
    imageSrc: "/images/available4.png",
    title: "Ruang Komunitas Tebet",
    location: "Jakarta Selatan",
    distanceKm: 4.6,
    rating: 4.6,
    verified: false,
    tags: [
      { type: "capacity", label: "20 orang" },
      { type: "wifi", label: "WiFi" },
      { type: "ac", label: "AC" },
    ],
    price: 100000,
    priceUnit: "sesi",
  },
];

export default function HomePage() {
  return (
    <main>
      <Navbar />

      <section className="mx-auto max-w-7xl px-6 py-20 md:py-28">
        <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-800">
          ITechno Cup Starter
        </span>

        <h1 className="mt-6 max-w-4xl text-4xl font-bold tracking-tight md:text-6xl">
          Bangun solusi digital yang inklusif, stabil, dan mudah dikembangkan.
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
          Ganti konten placeholder ini dengan masalah utama, pengguna sasaran,
          nilai pembeda, dan dampak terukur solusi tim Anda.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 font-semibold text-white hover:bg-emerald-800"
          >
            Buka dashboard
            <ArrowRight size={18} />
          </Link>

          <a
            href="#keunggulan"
            className="rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold hover:bg-slate-50"
          >
            Lihat fondasi
          </a>
        </div>
        {/* <SearchBar /> */}
        {/* <section className="mt-10">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
            {trendingSpaces.map((space) => (
              <CardTrending key={space.title} {...space} />
            ))}
          </div>
        </section> */}

        {/* <section className="mt-10">
          <div className="grid grid-cols-1  md:grid-cols-4">
            {recommendedSpaces.map((space) => (
              <CardRecommend key={space.imageSrc} {...space} />
            ))}
          </div>
        </section> */}
        {/* <section className="mt-10">
          <div className="flex flex-col gap-5">
            {availableSpaces.map((space) => (
              <CardAvailable key={space.title} {...space} />
            ))}
          </div>
        </section> */}
      </section>

      <section id="keunggulan" className="border-y border-slate-200 bg-white">
        <div className="mx-auto grid max-w-6xl gap-5 px-6 py-16 md:grid-cols-3">
          {highlights.map(({ icon: Icon, title, text }) => (
            <article
              key={title}
              className="rounded-2xl border border-slate-200 p-6 shadow-sm"
            >
              <Icon className="text-emerald-700" aria-hidden="true" />

              <h2 className="mt-4 text-xl font-bold">{title}</h2>

              <p className="mt-2 leading-7 text-slate-600">{text}</p>
            </article>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
