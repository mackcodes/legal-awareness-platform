import type { Metadata } from "next";
import { ClerkProvider } from '@clerk/nextjs';
import { TranslationProvider } from './contexts/TranslationContext';
import { Playfair_Display, Inter } from 'next/font/google';
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-playfair',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Legal Awareness Platform - Know Your Rights",
  description: "Digital platform for accessing and understanding India's Constitution and key acts",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
        <body className="antialiased font-inter">
          <TranslationProvider>
            {children}
          </TranslationProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}