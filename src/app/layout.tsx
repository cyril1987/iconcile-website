import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "iConcile | Aviation Cost Management & Financial Analytics Platform",
  description:
    "Revolutionize your airline cost management with iConSuite. Cutting-edge solutions for invoice verification, route profitability, and financial analytics tailored for aviation.",
  keywords: [
    "aviation cost management",
    "airline invoice verification",
    "route profitability",
    "airline financial analytics",
    "ground handling solutions",
    "aviation ERP integration",
  ],
  openGraph: {
    title: "iConcile | Elevating Industry Excellence",
    description:
      "Cutting-edge aviation cost management and financial analytics platform for airlines and ground handlers.",
    url: "https://iconcile.com",
    siteName: "iConcile",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
