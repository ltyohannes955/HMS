'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export default function StaffPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Staff</h1>
        <p className="text-muted-foreground">Manage hospital staff</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Staff</CardTitle>
          <CardDescription>View and manage staff members</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center border-2 border-dashed rounded-lg bg-muted/20">
            <p className="text-muted-foreground">Staff will be displayed here</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
