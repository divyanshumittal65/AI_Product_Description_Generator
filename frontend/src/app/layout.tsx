import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Product Description Generator | High-Converting Ecommerce Copy',
  description: 'Generate compelling, professional product descriptions instantly with AI. Persistent database storage & Docker containerized intelligence.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased selection:bg-indigo-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
