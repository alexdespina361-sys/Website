import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { SITE_DESCRIPTION, SITE_WORDMARK } from "@/lib/site";

export const metadata: Metadata = {
  title: `${SITE_WORDMARK} - Curatorial de Obiecte si Experiente`,
  description: SITE_DESCRIPTION,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ro">
      <body className="overflow-x-hidden bg-background font-body text-on-background selection:bg-primary-fixed selection:text-on-primary-fixed">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
