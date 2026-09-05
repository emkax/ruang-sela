import Link from "next/link";
type IconProps = {
  className?: string;
  size?: number;
  "aria-hidden"?: boolean | "true" | "false";
};

const Icon = ({ children, className, size = 24, ...props }: IconProps & { children: React.ReactNode }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    {children}
  </svg>
);

const ArrowRight = (props: IconProps) => <Icon {...props}><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></Icon>;
const CheckCircle2 = (props: IconProps) => <Icon {...props}><circle cx="12" cy="12" r="10" /><path d="m9 12 2 2 4-4" /></Icon>;
const Leaf = (props: IconProps) => <Icon {...props}><path d="M11 20A7 7 0 0 1 9.8 6.1C14.5 3.3 20 4 20 4s.7 5.5-2.1 10.2A7 7 0 0 1 11 20Z" /><path d="M9 18c2.5-2.5 4.5-5 6-8" /></Icon>;
const ShieldCheck = (props: IconProps) => <Icon {...props}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" /><path d="m9 12 2 2 4-4" /></Icon>;

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
