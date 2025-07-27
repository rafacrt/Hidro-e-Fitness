import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card } from '../ui/card';
import { Edit, Mail, MessageSquare, Phone, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

const professors = [
  {
    name: 'Ana Silva',
    email: 'ana.silva@email.com',
    phone: '(11) 99999-8888',
    avatar: 'https://placehold.co/40x40.png',
    avatarHint: 'woman portrait',
    specialties: ['Natação Adulto', 'Natação Infantil'],
    status: 'Ativo',
    classes: 15,
  },
  {
    name: 'Carlos Santos',
    email: 'carlos.santos@email.com',
    phone: '(11) 88888-7777',
    avatar: 'https://placehold.co/40x40.png',
    avatarHint: 'man portrait',
    specialties: ['Hidroginástica'],
    status: 'Ativo',
    classes: 12,
  },
  {
    name: 'Marina Costa',
    email: 'marina.costa@email.com',
    phone: '(11) 77777-6666',
    avatar: 'https://placehold.co/40x40.png',
    avatarHint: 'woman portrait',
    specialties: ['Natação Infantil'],
    status: 'Ativo',
    classes: 10,
  },
  {
    name: 'Roberto Lima',
    email: 'roberto.lima@email.com',
    phone: '(11) 66666-5555',
    avatar: 'https://placehold.co/40x40.png',
    avatarHint: 'man portrait',
    specialties: ['Aqua Aeróbica', 'Natação Avançada'],
    status: 'Inativo',
    classes: 0,
  },
];

const getInitials = (name: string) => {
    const names = name.split(' ');
    return names.length > 1 ? `${names[0][0]}${names[names.length - 1][0]}` : name.substring(0, 2);
}

const statusStyles: { [key: string]: string } = {
  Ativo: 'bg-green-100 text-green-800 border-green-200',
  Inativo: 'bg-zinc-100 text-zinc-800 border-zinc-200',
};

export default function ProfessoresTable() {
  return (
    <Card>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Professor</TableHead>
              <TableHead>Contato</TableHead>
              <TableHead>Especialidades</TableHead>
              <TableHead>Aulas/Semana</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {professors.map((prof, index) => (
              <TableRow key={index}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <Image src={prof.avatar} alt={prof.name} width={40} height={40} data-ai-hint={prof.avatarHint} />
                      <AvatarFallback>{getInitials(prof.name)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{prof.name}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                    <div className="space-y-1 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            <span>{prof.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            <span>{prof.phone}</span>
                        </div>
                         <div className="flex items-center gap-2 text-green-600">
                            <MessageSquare className="h-4 w-4" />
                            <span>WhatsApp</span>
                        </div>
                    </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {prof.specialties.map(spec => (
                      <Badge key={spec} variant="secondary" className="font-normal">{spec}</Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                    <p className="font-medium">{prof.classes}</p>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={cn('font-medium', statusStyles[prof.status])}>
                    {prof.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
