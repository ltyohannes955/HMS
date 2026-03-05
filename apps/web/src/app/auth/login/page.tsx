'use client';

import React from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail01Icon, LockIcon, Login01Icon, ViewIcon, ViewOffSlashIcon } from 'hugeicons-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { loginSchema, type LoginFormValues } from '@/lib/validations';
import { useToast } from '@/hooks/use-toast';
import { useLoginMutation } from '@/features/auth/authApi';
import { useAppDispatch } from '@/hooks/use-app-dispatch';
import { setCredentials } from '@/features/auth/authSlice';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const { toast } = useToast();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const [login, { isLoading }] = useLoginMutation();
    const [showPassword, setShowPassword] = React.useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const onSubmit = async (data: LoginFormValues) => {
        try {
            const response = await login(data).unwrap();
            dispatch(setCredentials(response));
            toast({
                title: 'Welcome back!',
                description: 'You have successfully signed in.',
            });
            router.push('/dashboard');
        } catch (err: any) {
            toast({
                variant: 'destructive',
                title: 'Login failed',
                description: err?.data?.message || 'Invalid email or password',
            });
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col space-y-2 text-center lg:text-left">
                <h1 className="text-3xl font-bold tracking-tight">Sign In</h1>
                <p className="text-muted-foreground">
                    Enter your credentials to access your medical dashboard.
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative group">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                            <Mail01Icon size={20} />
                        </div>
                        <Input
                            id="email"
                            placeholder="name@hms.com"
                            type="email"
                            autoCapitalize="none"
                            autoComplete="email"
                            autoCorrect="off"
                            disabled={isLoading}
                            className="pl-10 h-11"
                            {...register('email')}
                        />
                    </div>
                    {errors.email && (
                        <p className="text-xs font-medium text-destructive mt-1">
                            {errors.email.message}
                        </p>
                    )}
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="password">Password</Label>
                        <Link
                            href="/auth/forgot-password"
                            className="text-xs text-primary hover:underline font-medium"
                        >
                            Forgot password?
                        </Link>
                    </div>
                    <div className="relative group">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                            <LockIcon size={20} />
                        </div>
                        <Input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            disabled={isLoading}
                            className="pl-10 pr-10 h-11"
                            {...register('password')}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                            {showPassword ? <ViewOffSlashIcon size={18} /> : <ViewIcon size={18} />}
                        </button>
                    </div>
                    {errors.password && (
                        <p className="text-xs font-medium text-destructive mt-1">
                            {errors.password.message}
                        </p>
                    )}
                </div>

                <Button type="submit" className="w-full h-11" disabled={isLoading}>
                    {isLoading ? (
                        <div className="flex items-center gap-2">
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                            Signing in...
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Login01Icon size={20} />
                            Sign In to Portal
                        </div>
                    )}
                </Button>
            </form>

            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                        Or continue as
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="h-11 font-normal" disabled={isLoading}>
                    <span className="mr-2">👤</span> Patient
                </Button>
                <Button variant="outline" className="h-11 font-normal" disabled={isLoading}>
                    <span className="mr-2">🩺</span> Doctor
                </Button>
            </div>

            <p className="text-center text-sm text-muted-foreground">
                Don't have an account?{' '}
                <Link
                    href="/auth/register"
                    className="font-medium text-primary underline-offset-4 hover:underline"
                >
                    Create a patient account
                </Link>
            </p>
        </div>
    );
}
