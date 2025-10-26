import type { Metadata } from "next";
import "./globals.css";
import { Web3Provider } from "@/components/Web3Provider";
import { VideoBackground } from "@/components/VideoBackground";
import { LoadingProvider } from "@/components/LoadingProvider";
import React from 'react';

export const metadata: Metadata = {
  title: "GamepayX - Cross-Chain Game Store",
  description: "Own your items. Play anywhere. Trade everywhere. Purchase in-game items with Avail Nexus cross-chain bridge.",
  keywords: ["Web3", "Gaming", "NFT", "Cross-Chain", "Blockchain", "Ethereum", "Avail", "Game Items"],
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' }
    ],
    apple: '/apple-icon.svg',
  },
  openGraph: {
    title: "GamepayX - Cross-Chain Game Store",
    description: "Own your items. Play anywhere. Trade everywhere.",
    type: "website",
    images: ['/icon.svg'],
  },
  twitter: {
    card: "summary",
    title: "GamepayX",
    description: "Cross-Chain Game Store powered by Avail Nexus",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-black min-h-screen">
        <LoadingProvider>
          <VideoBackground />
          <Web3Provider>
            <main className="relative min-h-screen">
              {children}
            </main>
          </Web3Provider>
        </LoadingProvider>
      </body>
    </html>
  );
}
