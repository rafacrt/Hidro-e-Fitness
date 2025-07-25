'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

const membership = {
  name: 'Jane Doe',
  type: 'Premium Aqua',
  status: 'Active',
  expires: '2024-12-31',
  progress: 75, // Percentage of membership used
};

export default function MembershipDetails() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Membership Details</CardTitle>
        <div className="flex items-center justify-between">
            <CardDescription>Your plan and status.</CardDescription>
            <Badge className={membership.status === 'Active' ? 'bg-accent text-accent-foreground' : 'bg-destructive'}>
                {membership.status}
            </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-medium">{membership.name}</h3>
          <p className="text-sm text-muted-foreground">{membership.type} Plan</p>
        </div>
        <div>
          <div className="flex justify-between items-center mb-1">
            <p className="text-sm font-medium">Expires on:</p>
            <p className="text-sm text-muted-foreground">{membership.expires}</p>
          </div>
          <Progress value={membership.progress} aria-label={`${membership.progress}% of membership period remaining`} />
        </div>
        <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
          Renew Membership
        </Button>
      </CardContent>
    </Card>
  );
}
