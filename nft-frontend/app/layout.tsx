import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sacasm NFT Dashboard',
  description: 'Manage your Sacasm NFT collection - Mint, Transfer, and Explore',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
