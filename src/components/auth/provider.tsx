'use client';
import { useUser } from '@/firebase';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useSidebar } from '@/components/ui/sidebar';
import { Skeleton } from '@/components/ui/skeleton';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, initialising, error } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const { isMobile } = useSidebar();

  useEffect(() => {
    if (!initialising && !user) {
      router.push(`/login?redirect=${pathname}`);
    }
  }, [initialising, user, router, pathname]);

  if (initialising || !user) {
    if (isMobile) {
      return (
        <div className="p-4 space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      );
    }
    return (
      <div className="flex">
        <div className="w-[--sidebar-width] p-4 border-r">
          <Skeleton className="h-10 w-full mb-4" />
          <Skeleton className="h-8 w-full mb-2" />
          <Skeleton className="h-8 w-full mb-2" />
          <Skeleton className="h-8 w-full mb-2" />
        </div>
        <div className="flex-1 p-4 space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (error) {
    return <p>Something went wrong.</p>;
  }

  return <>{children}</>;
}
