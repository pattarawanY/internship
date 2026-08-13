import type { Metadata } from "next";
import { Noto_Sans_Thai, Roboto } from "next/font/google";

import "./globals.css";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const notoThai = Noto_Sans_Thai({
  variable: "--font-thai",
  subsets: ["latin", "thai"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Writer profile · Internship",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${roboto.variable} ${notoThai.variable} antialiased`}
    >
      <body>{children}</body>
    </html>
  );
}
