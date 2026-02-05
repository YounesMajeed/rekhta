import './globals.css';
import type { Metadata } from 'next';
import { Geist, Playfair_Display, Noto_Nastaliq_Urdu, Noto_Sans_Devanagari } from 'next/font/google';
import { Providers } from '@/components/Providers';

// Modern font for English
const geist = Geist({ subsets: ['latin'], variable: '--font-geist' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });

// Initialize Noto Nastaliq for Urdu
const notoUrdu = Noto_Nastaliq_Urdu({ 
  subsets: ['arabic'], 
  weight: ['400', '700'],
  variable: '--font-noto-urdu',
  display: 'swap',
});

// Initialize Noto Sans Devanagari for Hindi
const notoHindi = Noto_Sans_Devanagari({
  subsets: ['devanagari'],
  weight: ['400', '700'],
  variable: '--font-noto-hindi',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Lughat - Modern Urdu Dictionary',
  description: 'Powered by Rekhta',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geist.variable} ${playfair.variable} ${notoUrdu.variable} ${notoHindi.variable} font-sans antialiased bg-slate-50`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
