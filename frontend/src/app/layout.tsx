import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'OffGrid — AI Marketing Co-Pilot',
  description: 'AI-powered marketing intelligence platform. Analyze performance, track competitors, generate content, and grow your brand with data-driven strategies.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
