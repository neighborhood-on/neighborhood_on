import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "동네 ON",
  description: "우리 동네 소통 공간",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}