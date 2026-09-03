import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "FutureReady", template: "%s | FutureReady" },
  description:
    "Starter solusi digital berkelanjutan dan inklusif untuk ITechno Cup 2026.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
