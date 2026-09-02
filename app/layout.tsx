import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth/auth-context";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sınıf İçi Bilgi Yarışması",
  description: "Öğretmenler için soru bankası ve quiz yönetim sistemi, öğrenciler için interaktif bilgi yarışması platformu",
  keywords: ["quiz", "bilgi yarışması", "soru bankası", "eğitim", "fen bilimleri"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className={`${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col font-sans antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
