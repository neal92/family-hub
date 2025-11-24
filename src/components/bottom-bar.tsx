'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

export function BottomBar({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-background border-t border-border md:hidden">
      <div className="grid h-full max-w-lg grid-cols-5 mx-auto font-medium">
        {children}
      </div>
    </div>
  );
}

type BottomBarItemProps = {
  href: string;
  label: string;
  icon: LucideIcon;
  isActive?: boolean;
};

export function BottomBarItem({ href, label, icon: Icon, isActive }: BottomBarItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex flex-col items-center justify-center px-5 hover:bg-muted group",
        isActive ? "text-primary" : "text-muted-foreground"
      )}
    >
      <Icon className="w-5 h-5 mb-1" />
      <span className="text-xs">{label}</span>
    </Link>
  );
}
