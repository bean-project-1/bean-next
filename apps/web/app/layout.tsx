// =======================================================
// BEAN — Root Layout
// apps/web/app/layout.tsx
// =======================================================
import type { Metadata, Viewport } from 'next';
import './globals.css';

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
  themeColor: '#fafafa',
  colorScheme: 'light',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased selection:bg-violet-200 selection:text-violet-900">
        {/* Ambient background glow for light mode */}
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-violet-400/20 blur-[120px]" />
          <div className="absolute top-1/2 -left-40 h-[400px] w-[400px] rounded-full bg-indigo-400/15 blur-[100px]" />
          <div className="absolute bottom-0 right-1/3 h-[300px] w-[300px] rounded-full bg-fuchsia-400/15 blur-[100px]" />
        </div>

        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
