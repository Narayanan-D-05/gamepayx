import type { Metadata } from "next";
import "./globals.css";
import { Web3Provider } from "@/components/Web3Provider";
import { VideoBackground } from "@/components/VideoBackground";

export const metadata: Metadata = {
  title: "GamepayX - Cross-Chain Game Store",
  description: "Own your items. Play anywhere. Trade everywhere. Purchase in-game items with Avail Nexus cross-chain bridge.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-black min-h-screen">
        <VideoBackground />
        <Web3Provider>
          <main className="relative min-h-screen">
            {children}
          </main>
        </Web3Provider>
      </body>
    </html>
  );
}
