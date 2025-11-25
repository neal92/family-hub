'use client';
import { useUser } from '@/firebase/provider';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useSidebar } from '@/components/ui/sidebar';
import { Skeleton } from '@/components/ui/skeleton';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading, userError } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const { isMobile } = useSidebar();

  useEffect(() => {
    // Only redirect if authentication has finished loading and there is no user.
    if (!isUserLoading && !user) {
      router.push(`/login?redirect=${pathname}`);
    }
  }, [isUserLoading, user, router, pathname]);

  // While loading, or if there's no user yet (and we're not yet redirecting), show a loading state.
  if (isUserLoading || !user) {
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
        <div className="w-[--sidebar-width] p-4 border-r hidden md:block">
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

  if (userError) {
    // You might want to render a specific error component here
    return <p>Une erreur d'authentification est survenue.</p>;
  }

  // If loading is finished and user exists, render the children.
  return <>{children}</>;
}
