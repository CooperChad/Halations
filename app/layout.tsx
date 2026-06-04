import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "500"],
  style: ["normal", "italic"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400"],
});

export const metadata: Metadata = {
  title: "Halation Studio",
  description: "Documentary photo and film studio based in Utah Valley. Real moments captured for families and small businesses who'd rather have genuine stories than posed ones.",
  keywords: ["documentary photography", "documentary film", "Utah Valley photographer", "Orem Utah photographer", "family photography Utah", "small business photography Utah", "Halation Studio"],
  openGraph: {
    title: "Halation Studio",
    description: "Documentary photo and film studio based in Utah Valley. Real moments captured.",
    url: "https://halationstudio.com",
    siteName: "Halation Studio",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Halation Studio",
    description: "Documentary photo and film studio based in Utah Valley. Real moments captured.",
  },
  metadataBase: new URL("https://halationstudio.com"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body style={{ fontFamily: "var(--font-inter), sans-serif" }}>{children}</body>
    </html>
  );
}
