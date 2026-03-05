import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
    display: 'swap',
});

export const metadata: Metadata = {
    title: {
        default: 'HMS – Hospital Management System',
        template: '%s | HMS',
    },
    description:
        'A modern, full-stack Hospital Management System for efficient healthcare administration.',
    keywords: ['hospital', 'management', 'healthcare', 'HMS', 'medical'],
    authors: [{ name: 'HMS Team' }],
    creator: 'HMS Team',
    themeColor: [
        { media: '(prefers-color-scheme: light)', color: 'white' },
        { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
    ],
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${inter.variable} font-sans antialiased`}>
                <Providers>{children}</Providers>
                <Toaster />
            </body>
        </html>
    );
}
