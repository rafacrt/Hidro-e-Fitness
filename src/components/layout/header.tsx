'use client';

import { Bell, Menu, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { NavContent } from './nav-content';
import Image from 'next/image';
import { GlobalSearchDialog } from './global-search-dialog';
import { logout } from '@/app/auth/actions';
import Link from 'next/link';

export default function Header() {
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
          <NavContent />
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

      <Button variant="ghost" size="icon" className="rounded-full relative">
        <Bell className="h-5 w-5" />
        <span className="sr-only">Notificações</span>
        <span className="absolute top-1 right-1.5 h-2 w-2 rounded-full bg-red-500" />
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-auto p-0 rounded-full">
            <div className="flex items-center space-x-2">
              <Avatar className="h-9 w-9">
                <Image src="https://placehold.co/40x40.png" alt="Admin's avatar" width={40} height={40} data-ai-hint="person portrait" />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
              <div className="text-left hidden sm:block">
                <p className="text-sm font-medium">Admin Sistema</p>
                <p className="text-xs text-muted-foreground">Admin</p>
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
          <DropdownMenuItem onClick={() => logout()}>Sair</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
