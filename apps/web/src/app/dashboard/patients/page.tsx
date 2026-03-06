'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export default function PatientsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Patients</h1>
        <p className="text-muted-foreground">Manage patient records</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Patients</CardTitle>
          <CardDescription>View and manage patient information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center border-2 border-dashed rounded-lg bg-muted/20">
            <p className="text-muted-foreground">Patients will be displayed here</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
