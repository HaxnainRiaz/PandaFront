import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import Script from 'next/script';
import { Suspense } from 'react';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import MobileBottomNav from '@/components/layout/MobileBottomNav';
import { CartProvider } from '@/context/CartContext';
import { ReviewsProvider } from '@/context/ReviewsContext';
import { StoreAuthProvider } from '@/context/StoreAuthContext';
import { CoreProvider } from '@/context/CoreContext';
import { ToastProvider } from '@/context/ToastContext';
import MetaPixel from '@/components/MetaPixel';

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
    display: 'swap',
});

const plusJakarta = Plus_Jakarta_Sans({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700', '800'],
    variable: '--font-plus-jakarta',
    display: 'swap',
});

export const metadata = {
    metadataBase: new URL('https://http://localhost:3000'),
    title: 'Panda E-Mart — Shop Smart, Live Better',
    description: 'Discover trending fashion, beauty, gadgets, and lifestyle products at unbeatable prices. Free shipping on orders over Rs. 4,999.',
    keywords: 'online shopping pakistan, fashion accessories, beauty products, home gadgets, handbags, serums, kitchen tools, panda emart, deals',
    openGraph: {
        title: 'Panda E-Mart — Shop Smart, Live Better',
        description: 'Trending lifestyle products delivered across Pakistan. Fashion, Beauty, Gadgets & More.',
        url: 'https://http://localhost:3000',
        type: 'website',
        locale: 'en_PK',
        siteName: 'Panda E-Mart',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Panda E-Mart — Shop Smart, Live Better',
        description: 'Shop the latest fashion, beauty & lifestyle trends. Fast delivery across Pakistan.',
    },
    icons: {
        icon: '/favicon.ico',
        apple: '/favicon.ico',
    },
};

export default function RootLayout({ children }) {
    return (
        <html lang="en" className={`${inter.variable} ${plusJakarta.variable}`} suppressHydrationWarning>
            {/* Google Analytics */}
            <Script
                src="https://www.googletagmanager.com/gtag/js?id=G-V506ZDB7E5"
                strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
                {`
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', 'G-V506ZDB7E5');
                `}
            </Script>
            <body
                className="antialiased bg-[#f8f9fa] text-[#2b2b3b]"
                style={{ fontFamily: 'var(--font-inter, Inter, sans-serif)' }}
                suppressHydrationWarning={true}
            >
                <ToastProvider>
                    <StoreAuthProvider>
                        <Suspense fallback={null}>
                            <MetaPixel />
                        </Suspense>
                        <CoreProvider>
                            <CartProvider>
                                <ReviewsProvider>
                                    <AnnouncementBar />
                                    <Header />
                                    <main className="min-h-screen">
                                        {children}
                                    </main>
                                    <Footer />
                                    <MobileBottomNav />
                                </ReviewsProvider>
                            </CartProvider>
                        </CoreProvider>
                    </StoreAuthProvider>
                </ToastProvider>
            </body>
        </html>
    );
}
