import type { Metadata } from "next";
import { Geist, Geist_Mono, Cormorant_Garamond, Space_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Sakura Matcha Bar — Bengaluru's First Matcha Bar",
  description: "Ceremonial grade matcha sourced directly from Japan. Two locations in Bengaluru — Victoria Layout & JP Nagar. Handcrafted pottery mugs, Slow Sundays community, and every cup made with care.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${cormorant.variable} ${spaceMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col" style={{ scrollBehavior: "smooth" }}>
        {children}
      </body>
    </html>
  );
}
