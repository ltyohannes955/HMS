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
  useGetDepartmentsQuery,
  useCreateDepartmentMutation,
  useUpdateDepartmentMutation,
  useDeleteDepartmentMutation,
} from '@/features/departments/departmentsApi';

export default function DepartmentsPage() {
  const { toast } = useToast();
  const { data: departments = [], isLoading } = useGetDepartmentsQuery();
  const [createDepartment] = useCreateDepartmentMutation();
  const [updateDepartment] = useUpdateDepartmentMutation();
  const [deleteDepartment] = useDeleteDepartmentMutation();

  const [isCreateOpen, setIsCreateOpen] = React.useState(false);
  const [isEditOpen, setIsEditOpen] = React.useState(false);
  const [selectedDepartment, setSelectedDepartment] = React.useState<any>(null);

  const [formData, setFormData] = React.useState({
    name: '',
    description: '',
  });

  const resetForm = () => {
    setFormData({ name: '', description: '' });
  };

  const handleCreate = async () => {
    const errors: string[] = [];

    if (!formData.name.trim()) {
      errors.push('Name is required');
    }

    if (errors.length > 0) {
      toast({
        variant: 'destructive',
        title: 'Validation Error',
        description: errors.join(', '),
      });
      return;
    }

    try {
      await createDepartment(formData).unwrap();
      toast({ title: 'Department created successfully' });
      setIsCreateOpen(false);
      resetForm();
    } catch (err: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: err.data?.message || 'Failed to create department',
      });
    }
  };

  const handleEdit = async () => {
    const errors: string[] = [];

    if (!formData.name.trim()) {
      errors.push('Name is required');
    }

    if (errors.length > 0) {
      toast({
        variant: 'destructive',
        title: 'Validation Error',
        description: errors.join(', '),
      });
      return;
    }

    try {
      await updateDepartment({
        id: selectedDepartment.id,
        name: formData.name,
        description: formData.description,
      }).unwrap();
      toast({ title: 'Department updated successfully' });
      setIsEditOpen(false);
      resetForm();
    } catch (err: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: err.data?.message || 'Failed to update department',
      });
    }
  };

  const handleDelete = async (department: any) => {
    if (!confirm(`Are you sure you want to delete "${department.name}"?`)) {
      return;
    }

    try {
      await deleteDepartment(department.id).unwrap();
      toast({ title: 'Department deleted successfully' });
    } catch (err: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: err.data?.message || 'Failed to delete department',
      });
    }
  };

  const openEdit = (department: any) => {
    setSelectedDepartment(department);
    setFormData({
      name: department.name,
      description: department.description || '',
    });
    setIsEditOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Departments</h1>
          <p className="text-muted-foreground">Manage hospital departments</p>
        </div>
        <Dialog
          open={isCreateOpen}
          onOpenChange={(open) => {
            setIsCreateOpen(open);
            if (!open) resetForm();
          }}
        >
          <DialogTrigger asChild>
            <Button>Add Department</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Department</DialogTitle>
              <DialogDescription>Add a new department to the hospital</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Cardiology"
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Input
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="e.g., Heart and cardiovascular department"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreate}>Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Departments</CardTitle>
          <CardDescription>View and manage hospital departments</CardDescription>
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
                    <th className="text-left py-3 px-4 font-medium">Description</th>
                    <th className="text-left py-3 px-4 font-medium">Status</th>
                    <th className="text-left py-3 px-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {departments.map((dept) => (
                    <tr key={dept.id} className="border-b">
                      <td className="py-3 px-4 font-medium">{dept.name}</td>
                      <td className="py-3 px-4 text-muted-foreground">{dept.description || '-'}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${dept.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                        >
                          {dept.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => openEdit(dept)}>
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-500 hover:text-red-600"
                            onClick={() => handleDelete(dept)}
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {departments.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-muted-foreground">
                        No departments found. Create one to get started.
                      </td>
                    </tr>
                  )}
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
            <DialogTitle>Edit Department</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Input
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
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
    </div>
  );
}
