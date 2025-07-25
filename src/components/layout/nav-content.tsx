import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Icons } from '@/components/icons';
import { navItems } from '@/lib/config';
import { Card, CardDescription, CardHeader, CardTitle } from '../ui/card';

export function NavContent() {
  // In a real app, you'd fetch this data.
  // For this demo, we'll use a static object.
  const nextClass = {
    name: 'Hydrogymnastics',
    time: 'Today at 6:00 PM',
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg text-primary">
          <Icons.Logo className="h-8 w-8" />
          <span className="truncate">AquaFit Manager</span>
        </Link>
      </div>
      <nav className="flex-1 px-4 py-4 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2.5 text-muted-foreground transition-all hover:text-primary hover:bg-primary/10',
              // Add active state logic here if needed
            )}
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="mt-auto p-4">
        <Card className="bg-primary/10 border-primary/20">
          <CardHeader className="p-4">
            <CardTitle className="text-base text-primary">Your next class</CardTitle>
            <CardDescription className="text-primary/80">
              {nextClass.name} - {nextClass.time}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
