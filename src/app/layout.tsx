import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from "@/components/Header";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  weight: ["400", "500", "600", "800"]
});

export const metadata: Metadata = {
  title: "Jack Parrish",
  description: "Product Designer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <Header interClassName={inter.className} />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
