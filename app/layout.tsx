import type { Metadata } from "next";
import { Pixelify_Sans } from "next/font/google";
import "./globals.css";

const pixelifySans = Pixelify_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-pixelify',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "ByteMason",
  description: "Prompt to code in CLI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${pixelifySans.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}
