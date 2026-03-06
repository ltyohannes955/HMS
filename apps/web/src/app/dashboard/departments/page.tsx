'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export default function DepartmentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Departments</h1>
        <p className="text-muted-foreground">Manage hospital departments</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Departments</CardTitle>
          <CardDescription>View and manage departments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center border-2 border-dashed rounded-lg bg-muted/20">
            <p className="text-muted-foreground">Departments will be displayed here</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
