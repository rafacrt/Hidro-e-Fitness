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
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Clock, MapPin, Edit, User, Trash2 } from 'lucide-react';
import { Card } from '../ui/card';
import { cn } from '@/lib/utils';
import { Progress } from '../ui/progress';

const classes = [
  {
    name: 'Natação Adulto - Iniciante',
    modality: 'Natação',
    level: 'Iniciante',
    professorName: 'Prof. Ana Silva',
    professorPhone: '(11) 99999-8888',
    professorAvatar: 'AS',
    schedule: '08:00 - 09:00',
    days: ['Segunda', 'Quarta', 'Sexta'],
    occupancy: '12/15',
    occupancyRate: 80,
    occupancyColor: 'bg-yellow-500',
    location: 'Piscina 1',
    price: 'R$ 180,00',
    status: 'Ativa',
    statusClass: 'bg-green-100 text-green-800 border-green-200',
  },
  {
    name: 'Hidroginástica Matinal',
    modality: 'Hidroginástica',
    level: 'Todos os níveis',
    professorName: 'Prof. Carlos Santos',
    professorPhone: '(11) 88888-7777',
    professorAvatar: 'CS',
    schedule: '09:00 - 10:00',
    days: ['Segunda', 'Terça', 'Quarta'],
    occupancy: '20/20',
    occupancyRate: 100,
    occupancyColor: 'bg-red-500',
    location: 'Piscina 2',
    price: 'R$ 160,00',
    status: 'Lotada',
    statusClass: 'bg-red-100 text-red-800 border-red-200',
  },
  {
    name: 'Natação Infantil',
    modality: 'Natação',
    level: 'Infantil',
    professorName: 'Prof. Marina Costa',
    professorPhone: '(11) 77777-6666',
    professorAvatar: 'MC',
    schedule: '16:00 - 17:00',
    days: ['Terça', 'Quinta'],
    occupancy: '8/10',
    occupancyRate: 80,
    occupancyColor: 'bg-yellow-500',
    location: 'Piscina 1',
    price: 'R$ 150,00',
    status: 'Ativa',
    statusClass: 'bg-green-100 text-green-800 border-green-200',
  },
  {
    name: 'Aqua Aeróbica',
    modality: 'Aqua Aeróbica',
    level: 'Intermediário',
    professorName: 'Prof. Roberto Lima',
    professorPhone: '(11) 66666-5555',
    professorAvatar: 'RL',
    schedule: '14:00 - 15:00',
    days: ['Segunda', 'Quarta'],
    occupancy: '15/18',
    occupancyRate: 83,
    occupancyColor: 'bg-orange-500',
    location: 'Piscina 2',
    price: 'R$ 140,00',
    status: 'Ativa',
    statusClass: 'bg-green-100 text-green-800 border-green-200',
  },
  {
    name: 'Natação Avançada',
    modality: 'Natação',
    level: 'Avançado',
    professorName: 'Prof. Roberto Lima',
    professorPhone: '(11) 66666-5555',
    professorAvatar: 'RL',
    schedule: '07:00 - 08:00',
    days: ['Quarta', 'Sexta'],
    occupancy: '0/12',
    occupancyRate: 0,
    occupancyColor: 'bg-zinc-300',
    location: 'Piscina 1',
    price: 'R$ 220,00',
    status: 'Inativa',
    statusClass: 'bg-zinc-100 text-zinc-800 border-zinc-200',
  },
];

export default function ManageClassesTable() {
  return (
    <Card>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Turma</TableHead>
              <TableHead>Professor</TableHead>
              <TableHead>Horários</TableHead>
              <TableHead>Ocupação</TableHead>
              <TableHead>Local</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {classes.map((cls, index) => (
              <TableRow key={index}>
                <TableCell>
                  <p className="font-medium">{cls.name}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Badge variant="secondary" className="font-normal">{cls.modality}</Badge>
                    <Badge variant="outline" className="font-normal">{cls.level}</Badge>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-secondary text-secondary-foreground text-xs">{cls.professorAvatar}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{cls.professorName}</p>
                      <p className="text-xs text-muted-foreground">{cls.professorPhone}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{cls.schedule}</span>
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    {cls.days.map(day => <Badge key={day} variant="outline" className="font-normal text-xs">{day}</Badge>)}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{cls.occupancy}</span>
                    <span className="text-sm text-muted-foreground">({cls.occupancyRate}%)</span>
                  </div>
                  <Progress value={cls.occupancyRate} className="h-1.5 mt-1" indicatorClassName={cls.occupancyColor} />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{cls.location}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <p className="font-medium">{cls.price}</p>
                  <p className="text-sm text-muted-foreground">por mês</p>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={cn('font-medium', cls.statusClass)}>
                    {cls.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <User className="h-4 w-4" />
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
