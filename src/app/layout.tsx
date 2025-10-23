import type { Metadata } from "next";
import { IBM_Plex_Mono, Inter } from "next/font/google";
import Header from "@/components/Header";
import "./globals.css";

const ibmPlexMono = IBM_Plex_Mono({ 
  subsets: ["latin"],
  weight: ["400", "600"]
});

const inter = Inter({ 
  subsets: ["latin"],
  weight: ["400", "500", "600", "800"]
});

export const metadata: Metadata = {
  title: "Jack's Desktop",
  description: "Personal desktop interface",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${ibmPlexMono.className} antialiased`}>
        <Header interClassName={inter.className} />
        {children}
      </body>
    </html>
  );
}
