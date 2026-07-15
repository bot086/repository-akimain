// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Akshay Vastrad — Filmmaker & Photographer",
  description:
    "Cinematic storytelling through film and photography. Explore the portfolio of Akshay Vastrad — a visual artist based in India.",
  openGraph: {
    title: "Akshay Vastrad — Filmmaker & Photographer",
    description: "Cinematic storytelling through film and photography.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      </head>
      <body className="bg-cream text-ink font-sans">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
