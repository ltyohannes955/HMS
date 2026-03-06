'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/hooks/use-app-dispatch';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { logout } from '@/features/auth/authSlice';
import { useRouter } from 'next/navigation';
import {
  Home02Icon,
  UserGroupIcon,
  Calendar01Icon,
  Stethoscope02Icon,
  PillIcon,
  TestTube02Icon,
  Settings01Icon,
  Logout01Icon,
  Building01Icon,
  UserCircleIcon,
  MenuTwoLineIcon,
} from 'hugeicons-react';

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
  roles?: string[];
}

const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: <Home02Icon size={20} />,
  },
  {
    title: 'Appointments',
    href: '/dashboard/appointments',
    icon: <Calendar01Icon size={20} />,
    roles: ['SUPER_ADMIN', 'ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST', 'PATIENT'],
  },
  {
    title: 'Patients',
    href: '/dashboard/patients',
    icon: <UserGroupIcon size={20} />,
    roles: ['SUPER_ADMIN', 'ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST'],
  },
  {
    title: 'Doctors',
    href: '/dashboard/doctors',
    icon: <Stethoscope02Icon size={20} />,
    roles: ['SUPER_ADMIN', 'ADMIN', 'RECEPTIONIST'],
  },
  {
    title: 'Departments',
    href: '/dashboard/departments',
    icon: <Building01Icon size={20} />,
    roles: ['SUPER_ADMIN', 'ADMIN'],
  },
  {
    title: 'Staff',
    href: '/dashboard/staff',
    icon: <UserCircleIcon size={20} />,
    roles: ['SUPER_ADMIN', 'ADMIN'],
  },
  {
    title: 'Pharmacy',
    href: '/dashboard/pharmacy',
    icon: <PillIcon size={20} />,
    roles: ['SUPER_ADMIN', 'ADMIN', 'PHARMACIST', 'DOCTOR'],
  },
  {
    title: 'Laboratory',
    href: '/dashboard/laboratory',
    icon: <TestTube02Icon size={20} />,
    roles: ['SUPER_ADMIN', 'ADMIN', 'LAB_TECHNICIAN', 'DOCTOR'],
  },
  {
    title: 'Settings',
    href: '/dashboard/settings',
    icon: <Settings01Icon size={20} />,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [isOpen, setIsOpen] = React.useState(false);

  const filteredNavItems = navItems.filter((item) => {
    if (!item.roles) return true;
    return user && item.roles.includes(user.role);
  });

  const handleLogout = () => {
    dispatch(logout());
    router.push('/auth/login');
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        <MenuTwoLineIcon size={24} />
      </Button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={cn(
          'fixed top-0 left-0 z-40 h-screen w-64 bg-background border-r transition-transform duration-200 ease-in-out',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex h-16 items-center border-b px-6">
            <Link href="/dashboard" className="flex items-center gap-2 font-bold text-xl">
              <span className="text-primary">🏥</span>
              <span>HMS</span>
            </Link>
          </div>

          <nav className="flex-1 overflow-y-auto py-4 px-3">
            <div className="space-y-1">
              {filteredNavItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href as any}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                    )}
                  >
                    {item.icon}
                    {item.title}
                  </Link>
                );
              })}
            </div>
          </nav>

          <div className="border-t p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-sm font-medium">
                  {user?.firstName?.[0]}
                  {user?.lastName?.[0]}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-muted-foreground truncate">{user?.role}</p>
              </div>
            </div>
            <Button variant="outline" className="w-full justify-start gap-2" onClick={handleLogout}>
              <Logout01Icon size={18} />
              Sign Out
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}
