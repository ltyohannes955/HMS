'use client';

import React from 'react';
import { useAppSelector } from '@/hooks/use-app-dispatch';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const router = React.useRef(useRouter());

  React.useEffect(() => {
    if (!isAuthenticated && typeof window !== 'undefined') {
      const token = localStorage.getItem('hms_token');
      if (!token) {
        router.current.push('/auth/login');
      }
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return null;
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
