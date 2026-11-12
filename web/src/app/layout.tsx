import "./globals.css";
import { Sidebar } from "@/components/Sidebar/Sidebar";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { type ReactNode, Suspense } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"]
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"]
});

export const metadata: Metadata = {
  title: "Rental System",
  description: "Система управління прокатом автомобілів"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="uk" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <div className="app-layout">
          <Suspense fallback={null}>
            <Sidebar />
          </Suspense>
          <div className="app-content">{children}</div>
        </div>
      </body>
    </html>
  );
}
