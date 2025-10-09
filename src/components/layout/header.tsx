
'use client';

import { Bell, Menu, Search, UserPlus, CalendarCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { NavContent } from './nav-content';
import { GlobalSearchDialog } from './global-search-dialog';
import { logout } from '@/app/auth/actions';
import Link from 'next/link';
import type { Database } from '@/lib/database.types';
import Image from 'next/image';

type AcademySettings = Database['public']['Tables']['academy_settings']['Row'];
type Profile = Database['public']['Tables']['profiles']['Row'];

interface HeaderProps {
  settings: AcademySettings | null;
  userProfile: Profile | null;
}

const notifications: any[] = []; // TODO: Implementar sistema de notificações real

const getInitials = (name: string | null) => {
  if (!name) return 'U';
  const names = name.split(' ');
  if (names.length > 1) {
    return `${names[0][0]}${names[names.length - 1][0]}`;
  }
  return name.substring(0, 2).toUpperCase();
};


export default function Header({ settings, userProfile }: HeaderProps) {
  return (
    <header className="flex h-16 items-center gap-4 border-b bg-card px-6 sticky top-0 z-30">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 lg:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-72 bg-card">
          <SheetHeader className="sr-only">
            <SheetTitle>Menu de Navegação</SheetTitle>
          </SheetHeader>
          <NavContent settings={settings} />
        </SheetContent>
      </Sheet>

      <div className="w-full flex-1">
        <GlobalSearchDialog>
            <Button variant="outline" className="w-full max-w-sm justify-start text-muted-foreground font-normal pl-9 relative">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                 Buscar alunos, turmas...
            </Button>
        </GlobalSearchDialog>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full relative">
                <Bell className="h-5 w-5" />
                <span className="sr-only">Notificações</span>
                {notifications.length > 0 && (
                  <span className="absolute top-1 right-1.5 h-2 w-2 rounded-full bg-red-500" />
                )}
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notificações</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.length > 0 ? (
              <>
                <DropdownMenuGroup>
                    {notifications.map((notification, index) => (
                        <DropdownMenuItem key={index} className="flex items-start gap-3 p-3">
                            <notification.icon className="h-5 w-5 text-muted-foreground mt-1" />
                            <div className="flex-1">
                                <p className="font-semibold text-sm">{notification.title}</p>
                                <p className="text-xs text-muted-foreground">{notification.description}</p>
                                <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                            </div>
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="justify-center">
                    Ver todas as notificações
                </DropdownMenuItem>
              </>
            ) : (
              <div className="p-4 text-center text-sm text-muted-foreground">
                Nenhuma notificação no momento
              </div>
            )}
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-auto p-0 rounded-full">
            <div className="flex items-center space-x-2">
              <Avatar className="h-9 w-9">
                {userProfile?.avatar_url && (
                    <Image src={userProfile.avatar_url} alt={userProfile.full_name || 'Avatar'} width={40} height={40} data-ai-hint="person portrait" className="object-cover" />
                )}
                <AvatarFallback>{getInitials(userProfile?.full_name || null)}</AvatarFallback>
              </Avatar>
              <div className="text-left hidden sm:block">
                <p className="text-sm font-medium">{userProfile?.full_name || 'Usuário'}</p>
                <p className="text-xs text-muted-foreground">{userProfile?.role || 'Usuário'}</p>
              </div>
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/configuracoes">Perfil</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/configuracoes">Configurações</Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <form action={logout}>
            <button type="submit" className="w-full">
              <DropdownMenuItem>Sair</DropdownMenuItem>
            </button>
          </form>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
