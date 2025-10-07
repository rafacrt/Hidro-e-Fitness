'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { navItems } from '@/lib/config';
import { usePathname } from 'next/navigation';
import type { Database } from '@/lib/database.types';
import Image from 'next/image';
import { ScrollArea } from '../ui/scroll-area';

type AcademySettings = Database['public']['Tables']['academy_settings']['Row'];

interface NavContentProps {
  settings: AcademySettings | null;
}

export function NavContent({ settings }: NavContentProps) {
  const activePath = usePathname();

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-sidebar-border">
        <Link href="/" className="flex items-center gap-3 font-bold text-xl text-sidebar-foreground">
            <Image src={'/logo/logo.png'} alt="Logo da Academia" width={32} height={32} className="object-contain" data-ai-hint="water fitness" />
          <div className="flex flex-col">
            <span className="leading-tight">{settings?.name || 'Hidro Fitness'}</span>
            <span className="text-xs font-normal text-sidebar-muted-foreground leading-tight">Sistema de Gestão</span>
          </div>
        </Link>
      </div>
      <ScrollArea className="flex-1">
        <nav className="px-2 py-4 space-y-1">
          {navItems.map((item) => {
             const isActive = (activePath === '/' && item.href === '/') || (item.href !== '/' && activePath.startsWith(item.href));
            return (
                <Link
                key={item.label}
                href={item.href}
                className={cn(
                    'flex items-center gap-3 rounded-md px-3 py-2 text-sidebar-muted-foreground transition-all hover:text-sidebar-foreground hover:bg-sidebar-accent relative',
                    isActive ? 'bg-sidebar-accent text-sidebar-foreground font-medium' : ''
                )}
                >
                {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 bg-primary rounded-r-full" />}
                <item.icon className="h-5 w-5" />
                {item.label}
                </Link>
          )})}
        </nav>
      </ScrollArea>
    </div>
  );
}
