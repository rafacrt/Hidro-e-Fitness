'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Icons } from '@/components/icons';
import { navItems } from '@/lib/config';
import { usePathname } from 'next/navigation';
import type { Database } from '@/lib/database.types';
import Image from 'next/image';

type AcademySettings = Database['public']['Tables']['academy_settings']['Row'];

interface NavContentProps {
  settings: AcademySettings | null;
}

export function NavContent({ settings }: NavContentProps) {
  const activePath = usePathname();

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <Link href="/" className="flex items-center gap-3 font-bold text-xl text-foreground">
          {settings?.logo_url ? (
            <Image src={settings.logo_url} alt="Logo da Academia" width={32} height={32} className="object-contain" />
          ) : (
            <Icons.Logo className="h-8 w-8 text-primary" />
          )}
          <div className="flex flex-col">
            <span className="leading-tight">{settings?.name || 'Hidro Fitness'}</span>
            <span className="text-xs font-normal text-muted-foreground leading-tight">Sistema de Gestão</span>
          </div>
        </Link>
      </div>
      <nav className="flex-1 px-4 py-4 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-primary/10',
              (activePath === '/' && item.href === '/') || (item.href !== '/' && activePath.startsWith(item.href))
                ? 'bg-primary/10 text-primary font-medium'
                : ''
            )}
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
