'use client';

import React from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useToggleUserStatusMutation,
  useResetUserPasswordMutation,
  useGetRolesQuery,
  useGetDepartmentsQuery,
} from '@/features/users/usersApi';

function generateStrongPassword(length: number = 12): string {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let password = '';
  password += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)]; // at least one uppercase
  password += 'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)]; // at least one lowercase
  password += '0123456789'[Math.floor(Math.random() * 10)]; // at least one digit
  password += '!@#$%^&*'[Math.floor(Math.random() * 8)]; // at least one special
  for (let i = 4; i < length; i++) {
    password += charset[Math.floor(Math.random() * charset.length)];
  }
  return password
    .split('')
    .sort(() => Math.random() - 0.5)
    .join('');
}

async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export default function StaffPage() {
  const { toast } = useToast();
  const { data: users = [], isLoading } = useGetUsersQuery();
  const { data: roles = [] } = useGetRolesQuery();
  const { data: departments = [] } = useGetDepartmentsQuery();
  const [createUser] = useCreateUserMutation();
  const [updateUser] = useUpdateUserMutation();
  const [toggleStatus] = useToggleUserStatusMutation();
  const [resetPassword] = useResetUserPasswordMutation();

  const [isCreateOpen, setIsCreateOpen] = React.useState(false);
  const [isEditOpen, setIsEditOpen] = React.useState(false);
  const [isResetOpen, setIsResetOpen] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState<any>(null);
  const [tempPassword, setTempPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);

  const [formData, setFormData] = React.useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    roleId: '',
    departmentId: '',
  });

  const handleGeneratePassword = () => {
    const newPassword = generateStrongPassword(12);
    setFormData({ ...formData, password: newPassword });
    setTempPassword(newPassword);
  };

  const handleCopyPassword = async (password: string) => {
    const success = await copyToClipboard(password);
    if (success) {
      toast({ title: 'Password copied to clipboard' });
    } else {
      toast({ variant: 'destructive', title: 'Failed to copy password' });
    }
  };

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      roleId: '',
      departmentId: '',
    });
    setTempPassword('');
  };

  const handleCreate = async () => {
    try {
      const userData: any = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      };

      if (formData.roleId) {
        userData.roleId = formData.roleId;
      }
      if (formData.departmentId) {
        userData.departmentId = formData.departmentId;
      }

      await createUser(userData).unwrap();
      toast({ title: 'User created successfully' });
      setIsCreateOpen(false);
      resetForm();
    } catch (err: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: err.data?.message || 'Failed to create user',
      });
    }
  };

  const handleEdit = async () => {
    try {
      await updateUser({
        id: selectedUser.id,
        firstName: formData.firstName,
        lastName: formData.lastName,
        roleId: formData.roleId || undefined,
        departmentId: formData.departmentId || undefined,
      }).unwrap();
      toast({ title: 'User updated successfully' });
      setIsEditOpen(false);
    } catch (err: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: err.data?.message || 'Failed to update user',
      });
    }
  };

  const handleToggleStatus = async (user: any) => {
    try {
      await toggleStatus(user.id).unwrap();
      toast({ title: `User ${user.isActive ? 'disabled' : 'enabled'} successfully` });
    } catch (err: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: err.data?.message || 'Failed to update status',
      });
    }
  };

  const handleResetPassword = async () => {
    try {
      await resetPassword({ id: selectedUser.id, newPassword: tempPassword }).unwrap();
      toast({ title: 'Password reset successfully' });
      setIsResetOpen(false);
      setTempPassword('');
    } catch (err: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: err.data?.message || 'Failed to reset password',
      });
    }
  };

  const openEdit = (user: any) => {
    setSelectedUser(user);
    setFormData({
      email: user.email,
      password: '',
      firstName: user.firstName,
      lastName: user.lastName,
      roleId: user.role?.id || '',
      departmentId: user.department?.id || '',
    });
    setIsEditOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Staff</h1>
          <p className="text-muted-foreground">Manage hospital staff and users</p>
        </div>
        <Dialog
          open={isCreateOpen}
          onOpenChange={(open) => {
            setIsCreateOpen(open);
            if (!open) resetForm();
          }}
        >
          <DialogTrigger asChild>
            <Button>Add User</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New User</DialogTitle>
              <DialogDescription>Add a new staff member to the system</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>First Name</Label>
                  <Input
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Last Name</Label>
                  <Input
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Temporary Password</Label>
                <div className="flex gap-2">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleGeneratePassword}
                  >
                    Generate
                  </Button>
                  {formData.password && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopyPassword(formData.password)}
                    >
                      Copy
                    </Button>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="showCreatePassword"
                    checked={showPassword}
                    onChange={(e) => setShowPassword(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <Label htmlFor="showCreatePassword" className="text-sm font-normal">
                    Show password
                  </Label>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Select
                  value={formData.roleId}
                  onValueChange={(v: string) => setFormData({ ...formData, roleId: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((r) => (
                      <SelectItem key={r.id} value={r.id}>
                        {r.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Department</Label>
                <Select
                  value={formData.departmentId}
                  onValueChange={(v: string) => setFormData({ ...formData, departmentId: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((d) => (
                      <SelectItem key={d.id} value={d.id}>
                        {d.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreate}>Create User</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>View and manage all system users</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-40">
              <p className="text-muted-foreground">Loading...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">Name</th>
                    <th className="text-left py-3 px-4 font-medium">Email</th>
                    <th className="text-left py-3 px-4 font-medium">Role</th>
                    <th className="text-left py-3 px-4 font-medium">Department</th>
                    <th className="text-left py-3 px-4 font-medium">Status</th>
                    <th className="text-left py-3 px-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b">
                      <td className="py-3 px-4">
                        {user.firstName} {user.lastName}
                      </td>
                      <td className="py-3 px-4">{user.email}</td>
                      <td className="py-3 px-4">{user.role?.name || 'N/A'}</td>
                      <td className="py-3 px-4">{user.department?.name || 'N/A'}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                        >
                          {user.isActive ? 'Active' : 'Disabled'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => openEdit(user)}>
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleToggleStatus(user)}
                          >
                            {user.isActive ? 'Disable' : 'Enable'}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedUser(user);
                              setIsResetOpen(true);
                            }}
                          >
                            Reset Password
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog
        open={isEditOpen}
        onOpenChange={(open) => {
          setIsEditOpen(open);
          if (!open) resetForm();
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>First Name</Label>
                <Input
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Last Name</Label>
                <Input
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Select
                value={formData.roleId}
                onValueChange={(v: string) => setFormData({ ...formData, roleId: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((r) => (
                    <SelectItem key={r.id} value={r.id}>
                      {r.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Department</Label>
              <Select
                value={formData.departmentId}
                onValueChange={(v: string) => setFormData({ ...formData, departmentId: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((d) => (
                    <SelectItem key={d.id} value={d.id}>
                      {d.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isResetOpen}
        onOpenChange={(open) => {
          setIsResetOpen(open);
          if (!open) setTempPassword('');
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>
              This will reset the user&apos;s password. The user will be required to change their
              password on next login.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>New Password</Label>
              <div className="flex gap-2">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={tempPassword}
                  readOnly
                  placeholder="Click Generate to create password"
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const p = generateStrongPassword(12);
                    setTempPassword(p);
                  }}
                >
                  Generate
                </Button>
                {tempPassword && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopyPassword(tempPassword)}
                  >
                    Copy
                  </Button>
                )}
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="showResetPassword"
                  checked={showPassword}
                  onChange={(e) => setShowPassword(e.target.checked)}
                  className="w-4 h-4"
                />
                <Label htmlFor="showResetPassword" className="text-sm font-normal">
                  Show password
                </Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsResetOpen(false);
                setTempPassword('');
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleResetPassword} disabled={!tempPassword}>
              Reset Password
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
