import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartProvider } from "@/context/CartContext";
import { WhatsAppBtn } from "@/components/layout/WhatsAppBtn";

const playfair = Playfair_Display({
  variable: "--font-playfair-display",
  subsets: ["latin"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'Dr. Nidan Premium Ayurveda',
  description: 'Authentic Ayurvedic formulations crafted for modern wellness, bringing ancient balance into your daily life.',
  openGraph: {
    title: 'Dr. Nidan Premium Ayurveda',
    description: 'Authentic Ayurvedic formulations crafted for modern wellness.',
    url: 'https://drnidan.in',
    siteName: 'Dr. Nidan',
    images: [
      {
        url: 'https://drnidan.in/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Dr. Nidan Premium Ayurveda',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dr. Nidan Premium Ayurveda',
    description: 'Authentic Ayurvedic formulations crafted for modern wellness.',
    images: ['https://drnidan.in/og-image.jpg'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${dmSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <CartProvider>
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
          <WhatsAppBtn />
        </CartProvider>
      </body>
    </html>
  );
}
