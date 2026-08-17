import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Frontend Woman - Home",
  description:
    "I Collab with Design & Branding teams to turn great design into high-quality code with balanced costs. Wordpress & Webflow",
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
