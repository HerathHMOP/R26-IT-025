import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Modern LMS',
  description: 'Aptitude test frontend',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
