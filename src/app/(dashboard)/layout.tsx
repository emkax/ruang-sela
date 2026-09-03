import Link from "next/link";
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-200 bg-white">
        <nav
          aria-label="Navigasi utama"
          className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4"
        >
          <Link href="/" className="font-bold text-emerald-700">
            FutureReady
          </Link>
          <Link href="/dashboard" className="text-sm font-semibold">
            Dashboard
          </Link>
        </nav>
      </header>
      {children}
    </div>
  );
}
