import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-display",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Cartan — AI-Native Arthroplasty",
  description:
    "Experience the future of knee replacement surgery. Cartan combines AI, physics-based digital twins, and smart instruments to make expert-level BCR procedures accessible to every surgeon.",
  openGraph: {
    title: "Cartan — AI-Native Arthroplasty",
    description:
      "Experience the future of knee replacement surgery.",
    images: ["/banner-1920x1080-new.png"],
    type: "website",
    url: "https://demo.cartan.io",
  },
  icons: {
    icon: "/favicon_2k_square.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="font-display antialiased">{children}</body>
    </html>
  );
}
