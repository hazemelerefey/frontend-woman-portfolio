import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
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
