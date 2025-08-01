
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  changeType: 'increase' | 'decrease';
  period: string;
  icon: LucideIcon;
  iconBgColor: string;
  iconColor: string;
}

export default function StatCard({ title, value, change, changeType, period, icon: Icon, iconBgColor, iconColor }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className={cn("flex items-center justify-center h-8 w-8 rounded-full", iconBgColor)}>
          <Icon className={cn("h-4 w-4", iconColor)} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {(change || period) && (
            <div className="flex items-center text-xs text-muted-foreground">
                {change && <span className={cn('font-semibold', changeType === 'increase' ? 'text-green-600' : 'text-red-600')}>{change}</span>}
                {period && <span className="ml-1">{period}</span>}
            </div>
        )}
      </CardContent>
    </Card>
  );
}
