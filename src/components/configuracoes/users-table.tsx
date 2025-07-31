import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { EditUserDialog } from './edit-user-dialog';
import type { Database } from '@/lib/database.types';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface UsersTableProps {
  users: Profile[];
}

const getInitials = (name: string | null) => {
    if (!name) return '??';
    const names = name.split(' ');
    if (names.length > 1) {
        return `${names[0][0]}${names[names.length - 1][0]}`;
    }
    return name.substring(0, 2);
}

const roleStyles: { [key: string]: string } = {
    'Desenvolvedor': 'bg-purple-100 text-purple-800 border-purple-200',
    'Administrador': 'bg-blue-100 text-blue-800 border-blue-200',
    'Recepção': 'bg-green-100 text-green-800 border-green-200',
};

export default function UsersTable({ users }: UsersTableProps) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Usuário</TableHead>
            <TableHead>Perfil</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar>
                    {user.avatar_url ? (
                      <Image src={user.avatar_url} alt={user.full_name || 'Avatar'} width={40} height={40} data-ai-hint="person portrait" />
                    ) : null}
                    <AvatarFallback>{getInitials(user.full_name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{user.full_name}</p>
                    {/* <p className="text-sm text-muted-foreground">{user.email}</p> */}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className={cn(roleStyles[user.role || ''])}>{user.role}</Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <EditUserDialog user={user}>
                    <Button variant="ghost" size="icon" disabled={user.role === 'Desenvolvedor'}>
                      <Edit className="h-4 w-4" />
                    </Button>
                  </EditUserDialog>
                  <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600" disabled={user.role === 'Desenvolvedor'}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
