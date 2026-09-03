import Link from "next/link";
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

export default function HomePage() {
  return (
    <main>
      <section className="mx-auto max-w-6xl px-6 py-20 md:py-28">
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
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 font-semibold text-white hover:bg-emerald-800"
          >
            Buka dashboard <ArrowRight size={18} />
          </Link>
          <a
            href="#keunggulan"
            className="rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold hover:bg-slate-50"
          >
            Lihat fondasi
          </a>
        </div>
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
    </main>
  );
}
