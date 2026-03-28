import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SmartRecruit Career",
  description: "Company career pages powered by SmartRecruit",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
