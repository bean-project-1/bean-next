// =======================================================
// BEAN — Root Layout
// apps/web/app/layout.tsx
// =======================================================
import type { Metadata, Viewport } from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });

export const metadata: Metadata = {
  title: {
    default: 'BEAN — Life Intelligence Platform',
    template: '%s | BEAN',
  },
  description:
    'Understand, measure, and improve your life trajectory with AI-powered insights across identity, capital, and wellbeing.',
  keywords: ['life intelligence', 'AI coaching', 'personal development', 'life score', 'BEAN'],
  authors: [{ name: 'BEAN Team' }],
  openGraph: {
    type: 'website',
    siteName: 'BEAN',
    title: 'BEAN — Life Intelligence Platform',
    description: 'AI-powered insights to understand and improve your life trajectory.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: '#fafaf9',
  colorScheme: 'light',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${outfit.variable} font-sans min-h-screen bg-background text-foreground antialiased selection:bg-emerald-200 selection:text-emerald-900`}>
        {/* Ambient warm background glow */}
        <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
          <div className="absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full bg-amber-100/50 blur-[120px]" />
          <div className="absolute top-1/2 -left-40 h-[500px] w-[500px] rounded-full bg-emerald-50/50 blur-[100px]" />
          <div className="absolute bottom-0 right-1/3 h-[400px] w-[400px] rounded-full bg-orange-50/50 blur-[120px]" />
        </div>

        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
