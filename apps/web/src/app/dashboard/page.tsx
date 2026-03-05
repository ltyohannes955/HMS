'use client';

import React from 'react';
import { useAppSelector, useAppDispatch } from '@/hooks/use-app-dispatch';
import { logout } from '@/features/auth/authSlice';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import {
    DashboardSquare01Icon,
    UserGroupIcon,
    Calendar01Icon,
    Settings01Icon,
    Logout01Icon
} from 'hugeicons-react';

export default function DashboardPage() {
    const { user, isAuthenticated } = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch();
    const router = useRouter();

    React.useEffect(() => {
        if (!isAuthenticated && typeof window !== 'undefined') {
            // In a real app, middleware would handle this
            const token = localStorage.getItem('hms_token');
            if (!token) router.push('/auth/login');
        }
    }, [isAuthenticated, router]);

    const handleLogout = () => {
        dispatch(logout());
        router.push('/auth/login');
    };

    return (
        <div className="min-h-screen bg-muted/30">
            {/* Simple Navbar */}
            <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-16 items-center justify-between px-8">
                    <div className="flex items-center gap-2 font-bold text-xl">
                        <span className="text-primary">🏥</span> HMS Portal
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex flex-col items-end text-sm">
                            <span className="font-medium">{user?.firstName} {user?.lastName}</span>
                            <span className="text-xs text-muted-foreground uppercase">{user?.role}</span>
                        </div>
                        <Button variant="ghost" size="icon" onClick={handleLogout} title="Logout">
                            <Logout01Icon size={20} className="text-destructive" />
                        </Button>
                    </div>
                </div>
            </header>

            <main className="container p-8">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="animate-fade-in [animation-delay:100ms]">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-sm font-medium">Appointments Today</CardTitle>
                            <Calendar01Icon size={20} className="text-primary" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">12</div>
                            <p className="text-xs text-muted-foreground">+2 from yesterday</p>
                        </CardContent>
                    </Card>
                    <Card className="animate-fade-in [animation-delay:200ms]">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
                            <UserGroupIcon size={20} className="text-primary" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">2,350</div>
                            <p className="text-xs text-muted-foreground">+180 this month</p>
                        </CardContent>
                    </Card>
                    <Card className="animate-fade-in [animation-delay:300ms]">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-sm font-medium">Pending Lab Reports</CardTitle>
                            <DashboardSquare01Icon size={20} className="text-primary" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">45</div>
                            <p className="text-xs text-muted-foreground">Require immediate review</p>
                        </CardContent>
                    </Card>
                    <Card className="animate-fade-in [animation-delay:400ms]">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-sm font-medium">System Health</CardTitle>
                            <Settings01Icon size={20} className="text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">Optimal</div>
                            <p className="text-xs text-muted-foreground">All systems operational</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="mt-8">
                    <Card className="animate-fade-in [animation-delay:500ms]">
                        <CardHeader>
                            <CardTitle>Welcome to your HMS Dashboard</CardTitle>
                            <CardDescription>
                                This is a placeholder for your medical administration panel.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="h-[300px] flex items-center justify-center border-2 border-dashed rounded-lg bg-muted/20">
                            <p className="text-muted-foreground">Feature modules (Patients, Staff, Appointments) will be added here.</p>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}
