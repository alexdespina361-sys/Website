import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";

export const metadata: Metadata = {
  title: "RED STUDIO — Curatorial de Obiecte și Experiențe",
  description:
    "O curatorie de obiecte și experiențe pentru minimalistul modern.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ro">
      <body className="bg-background text-on-background font-body selection:bg-primary-fixed selection:text-on-primary-fixed overflow-x-hidden">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
