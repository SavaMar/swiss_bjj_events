import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { LanguageProvider } from "./context/LanguageContext";
import { Analytics } from "@vercel/analytics/react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Swiss BJJ",
  description: "Swiss Brazilian Jiu-Jitsu Community Hub",
  openGraph: {
    title: "Swiss BJJ Events & Gyms",
    description: "Find the best BJJ events and gyms in Switzerland.",
    images: [
      {
        url: "/preview.png",
        width: 1200,
        height: 630,
        alt: "Swiss BJJ Preview",
      },
    ],
    type: "website",
    siteName: "Swiss BJJ",
  },
  twitter: {
    card: "summary_large_image",
    title: "Swiss BJJ Events & Gyms",
    description: "Find the best BJJ events and gyms in Switzerland.",
    images: ["/preview.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <LanguageProvider>
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
        </LanguageProvider>
        <Analytics />
      </body>
    </html>
  );
}
