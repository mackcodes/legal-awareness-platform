import type { Metadata } from "next";
import { ClerkProvider } from '@clerk/nextjs';
import { TranslationProvider } from './contexts/TranslationContext';
import { Analytics } from '@vercel/analytics/react';
import { Poppins, Crimson_Pro } from 'next/font/google';
import "./globals.css";

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-poppins',
  display: 'swap',
});

const crimsonPro = Crimson_Pro({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-crimson',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Legal Help - Know Your Rights",
  description: "Your digital companion for understanding India's Constitution, laws, and legal rights",
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${poppins.variable} ${crimsonPro.variable}`} suppressHydrationWarning data-scroll-behavior="smooth">
        <body className="antialiased font-poppins bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50" suppressHydrationWarning>
          <TranslationProvider>
            {children}
          </TranslationProvider>
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );
}