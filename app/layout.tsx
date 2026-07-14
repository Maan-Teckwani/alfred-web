import type { Metadata } from "next";
import { Newsreader, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const serif = Newsreader({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Alfred — The codebase has a butler.",
  description:
    "Bug tickets go in. Review-ready pull requests come out. Alfred triages, reproduces, fixes, and tests routine engineering work autonomously — your engineers never leave flow.",
  openGraph: {
    title: "Alfred — The codebase has a butler.",
    description:
      "Bug tickets go in. Review-ready pull requests come out. Autonomous software maintenance for teams that guard their focus.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${serif.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
