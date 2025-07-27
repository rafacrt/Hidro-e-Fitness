
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

const users = [
  {
    name: 'Desenvolvedor',
    email: 'dev@hidrofitness.com',
    role: 'Desenvolvedor',
    avatar: 'https://placehold.co/40x40.png',
    avatarHint: 'person portrait',
  },
  {
    name: 'Admin Sistema',
    email: 'admin@hidrofitness.com',
    role: 'Administrador',
    avatar: 'https://placehold.co/40x40.png',
    avatarHint: 'person portrait',
  },
  {
    name: 'Ana Silva',
    email: 'ana.silva@email.com',
    role: 'Recepção',
    avatar: 'https://placehold.co/40x40.png',
    avatarHint: 'woman portrait',
  },
];

const getInitials = (name: string) => {
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

export default function UsersTable() {
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
          {users.map((user, index) => (
            <TableRow key={index}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <Image src={user.avatar} alt={user.name} width={40} height={40} data-ai-hint={user.avatarHint} />
                    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className={cn(roleStyles[user.role])}>{user.role}</Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="icon" disabled={user.role === 'Desenvolvedor'}>
                    <Edit className="h-4 w-4" />
                  </Button>
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
