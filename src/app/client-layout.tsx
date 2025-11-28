'use client';

import { Toaster } from '@/components/ui/toaster';
import { SessionProvider } from 'next-auth/react';

export function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionProvider>
      {children}
      <Toaster />
    </SessionProvider>
  );
}