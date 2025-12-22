import type { Metadata } from "next";
import { Lexend, Fira_Code } from "next/font/google";
import "./globals.css";
import AppShell from "@/components/AppShell";

const lexend = Lexend({
  variable: "--font-lexend",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const firaCode = Fira_Code({
  variable: "--font-fira-code",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Helios - Blog",
  description: "Helios personal blog for sharing my thoughts and experiences",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${lexend.variable} ${firaCode.variable} antialiased`}>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
