import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "musicjam - Synchronized YouTube listening with friends",
  description: "Create music jam rooms and listen to YouTube videos together in real-time with your friends",
  keywords: ["music", "youtube", "synchronized", "listening", "social", "playlist"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
