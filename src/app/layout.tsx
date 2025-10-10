import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pathfinder Viz",
  description: "Interactive maze and pathfinding algorithm visualizer",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
