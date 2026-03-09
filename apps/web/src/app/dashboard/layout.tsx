'use client';

import React from 'react';
import { useAppSelector } from '@/hooks/use-app-dispatch';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const router = useRouter();

  React.useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('hms_token') : null;

    if (!isAuthenticated && !token) {
      router.push('/auth/login');
    } else if (!isAuthenticated && token) {
      // Token exists but auth state not hydrated - could be a refresh
      // Let the app handle this, but redirect if definitely not authenticated
      const userStr = typeof window !== 'undefined' ? localStorage.getItem('hms_user') : null;
      if (!userStr) {
        router.push('/auth/login');
      }
    }
  }, [isAuthenticated, router]);

  // Don't render anything if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Sidebar />
      <main className="lg:pl-64">
        <div className="container p-6 pt-20 lg:pt-6">{children}</div>
      </main>
    </div>
  );
}
