import { ClerkProvider } from "@clerk/nextjs";
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
  title: "Alfred — An AI engineer for your bug backlog",
  description:
    "Alfred picks up bug tickets from Jira, reproduces them, writes and tests the fix, and opens a pull request your team reviews and merges. Your engineers stay on the roadmap.",
  openGraph: {
    title: "Alfred — An AI engineer for your bug backlog",
    description:
      "Alfred fixes your bug tickets end to end and opens a tested pull request. You review, you merge. Your engineers keep shipping.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${serif.variable} ${mono.variable}`}>
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
