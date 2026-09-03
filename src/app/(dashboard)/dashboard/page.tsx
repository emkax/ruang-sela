import { Suspense } from "react";
import { ExampleList } from "@/features/example";
import { DashboardSkeleton } from "@/shared/components/feedback/dashboard-skeleton";
export const metadata = {
  title: "Dashboard",
  description: "Ringkasan aktivitas aplikasi.",
};
export default function DashboardPage() {
  return (
    <main className="mx-auto max-w-6xl space-y-8 px-6 py-10">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Dampak</h1>
        <p className="mt-2 text-slate-600">
          Ganti metrik dan data ini sesuai fitur utama aplikasi.
        </p>
      </header>
      <Suspense fallback={<DashboardSkeleton />}>
        <ExampleList />
      </Suspense>
    </main>
  );
}
