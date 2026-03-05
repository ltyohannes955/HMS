'use client';

import React from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    Mail01Icon,
    LockIcon,
    UserIcon,
    PassportIcon,
    ArrowRight01Icon,
    ViewIcon,
    ViewOffSlashIcon
} from 'hugeicons-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { registerSchema, type RegisterFormValues } from '@/lib/validations';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
    const { toast } = useToast();
    const router = useRouter();
    const [showPassword, setShowPassword] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            confirmPassword: '',
            role: 'PATIENT',
        },
    });

    const onSubmit = async (data: RegisterFormValues) => {
        setIsLoading(true);
        try {
            // Since we haven't implemented the register mutation in authApi yet,
            // we'll just simulate it for now as part of the scaffolding.
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/users/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    firstName: data.firstName,
                    lastName: data.lastName,
                    email: data.email,
                    password: data.password,
                    role: data.role,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Registration failed');
            }

            toast({
                title: 'Account created!',
                description: 'You can now sign in with your credentials.',
            });
            router.push('/auth/login');
        } catch (err: any) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: err.message || 'An unexpected error occurred',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col space-y-2 text-center lg:text-left">
                <h1 className="text-3xl font-bold tracking-tight">Create Account</h1>
                <p className="text-muted-foreground">
                    Join HMS to manage your medical history and appointments.
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <div className="relative group">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                                <UserIcon size={20} />
                            </div>
                            <Input
                                id="firstName"
                                placeholder="John"
                                disabled={isLoading}
                                className="pl-10 h-11"
                                {...register('firstName')}
                            />
                        </div>
                        {errors.firstName && (
                            <p className="text-[10px] font-medium text-destructive mt-1">
                                {errors.firstName.message}
                            </p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                            id="lastName"
                            placeholder="Doe"
                            disabled={isLoading}
                            className="h-11"
                            {...register('lastName')}
                        />
                        {errors.lastName && (
                            <p className="text-[10px] font-medium text-destructive mt-1">
                                {errors.lastName.message}
                            </p>
                        )}
                    </div>
                </div>

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
                            disabled={isLoading}
                            className="pl-10 h-11"
                            {...register('email')}
                        />
                    </div>
                    {errors.email && (
                        <p className="text-[10px] font-medium text-destructive mt-1">
                            {errors.email.message}
                        </p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
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
                        <p className="text-[10px] font-medium text-destructive mt-1">
                            {errors.password.message}
                        </p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                        id="confirmPassword"
                        type="password"
                        disabled={isLoading}
                        className="h-11"
                        {...register('confirmPassword')}
                    />
                    {errors.confirmPassword && (
                        <p className="text-[10px] font-medium text-destructive mt-1">
                            {errors.confirmPassword.message}
                        </p>
                    )}
                </div>

                <Button type="submit" className="w-full h-11" disabled={isLoading}>
                    {isLoading ? (
                        <div className="flex items-center gap-2">
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                            Creating account...
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <PassportIcon size={20} />
                            Register Account
                        </div>
                    )}
                </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link
                    href="/auth/login"
                    className="font-medium text-primary underline-offset-4 hover:underline"
                >
                    Sign in here
                </Link>
            </p>
        </div>
    );
}
