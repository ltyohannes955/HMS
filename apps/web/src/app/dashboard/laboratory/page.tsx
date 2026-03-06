'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export default function LaboratoryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Laboratory</h1>
        <p className="text-muted-foreground">Manage laboratory tests and results</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Laboratory</CardTitle>
          <CardDescription>View and manage lab tests</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center border-2 border-dashed rounded-lg bg-muted/20">
            <p className="text-muted-foreground">Laboratory will be displayed here</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
