import './globals.css';
import type { Metadata } from 'next';
import { Inter, Playfair_Display, Noto_Nastaliq_Urdu } from 'next/font/google'; // <--- Change Import

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });

// Initialize Noto Nastaliq
const noto = Noto_Nastaliq_Urdu({ 
  subsets: ['arabic'], 
  weight: ['400', '700'], // Noto supports bold weights too!
  variable: '--font-noto',
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
      {/* Add the new variable to the body class list */}
      <body className={`${inter.variable} ${playfair.variable} ${noto.variable} font-sans antialiased bg-slate-50`}>
        {children}
      </body>
    </html>
  );
}