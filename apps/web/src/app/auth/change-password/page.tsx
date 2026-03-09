'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { LockIcon, ViewIcon, ViewOffSlashIcon } from 'hugeicons-react';
import { useAppSelector, useAppDispatch } from '@/hooks/use-app-dispatch';
import { useChangePasswordMutation } from '@/features/auth/authApi';
import { passwordChanged } from '@/features/auth/authSlice';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

export default function ChangePasswordPage() {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { toast } = useToast();
  const [changePassword, { isLoading }] = useChangePasswordMutation();
  const [showPassword, setShowPassword] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ChangePasswordFormValues>();

  const onSubmit = async (data: ChangePasswordFormValues) => {
    try {
      await changePassword({
        userId: user?.id || '',
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      }).unwrap();

      dispatch(passwordChanged());
      toast({
        title: 'Password changed',
        description: 'Your password has been updated successfully.',
      });
      router.push('/dashboard');
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error?.data?.message || 'Failed to change password',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2 text-center lg:text-left">
        <h1 className="text-3xl font-bold tracking-tight">Change Password</h1>
        <p className="text-muted-foreground">
          You must change your password before accessing the system.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="currentPassword">Current Password</Label>
          <div className="relative group">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
              <LockIcon size={20} />
            </div>
            <Input
              id="currentPassword"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter current password"
              disabled={isLoading}
              className="pl-10 h-11"
              {...register('currentPassword')}
            />
          </div>
          {errors.currentPassword && (
            <p className="text-xs font-medium text-destructive mt-1">
              {errors.currentPassword.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="newPassword">New Password</Label>
          <div className="relative group">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
              <LockIcon size={20} />
            </div>
            <Input
              id="newPassword"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter new password"
              disabled={isLoading}
              className="pl-10 h-11"
              {...register('newPassword')}
            />
          </div>
          {errors.newPassword && (
            <p className="text-xs font-medium text-destructive mt-1">
              {errors.newPassword.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm New Password</Label>
          <div className="relative group">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
              <LockIcon size={20} />
            </div>
            <Input
              id="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              placeholder="Confirm new password"
              disabled={isLoading}
              className="pl-10 h-11"
              {...register('confirmPassword')}
            />
          </div>
          {errors.confirmPassword && (
            <p className="text-xs font-medium text-destructive mt-1">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="showPassword"
            checked={showPassword}
            onChange={(e) => setShowPassword(e.target.checked)}
            className="w-4 h-4"
          />
          <Label htmlFor="showPassword" className="text-sm font-normal">
            Show passwords
          </Label>
        </div>

        <Button type="submit" className="w-full h-11" disabled={isLoading}>
          {isLoading ? 'Changing password...' : 'Change Password'}
        </Button>
      </form>
    </div>
  );
}
