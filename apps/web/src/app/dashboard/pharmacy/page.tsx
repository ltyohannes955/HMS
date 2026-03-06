'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export default function PharmacyPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Pharmacy</h1>
        <p className="text-muted-foreground">Manage pharmacy and medications</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Pharmacy</CardTitle>
          <CardDescription>View and manage medications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center border-2 border-dashed rounded-lg bg-muted/20">
            <p className="text-muted-foreground">Pharmacy will be displayed here</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
