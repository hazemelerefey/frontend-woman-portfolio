import type { Metadata, Viewport } from "next";
import "./globals.css";

/**
 * Absolute base for URL-based metadata. Without it Next falls back to
 * localhost:3000 and warns, which would ship social-preview URLs pointing at
 * a machine nobody else can reach. Set NEXT_PUBLIC_SITE_URL once the domain
 * is known; on Vercel the deployment URL is used automatically.
 */
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Shahd Khairy — Fullstack Woman",
  description:
    "Full Stack Developer (MERN) in Cairo, Egypt. React, Node.js, Express and MongoDB — secure REST APIs, clean architecture, and 3D interfaces with Three.js & GSAP.",
  openGraph: {
    images: ["/images/fav.png"],
  },
  icons: {
    icon: "/images/fav.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#0C0C0C",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
