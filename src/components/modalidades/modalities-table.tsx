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
import { Eye, Edit, Trash2, Users, Clock, Activity, Heart, Waves, Music, Dumbbell, Anchor } from 'lucide-react';
import { Card } from '../ui/card';
import { ReactElement } from 'react';
import { cn } from '@/lib/utils';
import { Checkbox } from '../ui/checkbox';

const modalities: {
  name: string;
  description: string;
  type: string;
  maxStudents: number;
  duration: number;
  students: number;
  classes: number;
  price: string;
  status: 'Ativa' | 'Inativa';
  icon: ReactElement;
  iconBg: string;
  typeColor: string;
}[] = [
  {
    name: 'Natação Adulto',
    description: 'Aulas de natação para adultos de todos os níveis, focando em técnica e condicionamento físico',
    type: 'Aquática',
    maxStudents: 15,
    duration: 60,
    students: 96,
    classes: 8,
    price: 'R$ 180,00',
    status: 'Ativa',
    icon: <Waves className="h-5 w-5 text-white" />,
    iconBg: 'bg-blue-500',
    typeColor: 'text-blue-600 bg-blue-100 border-blue-200',
  },
  {
    name: 'Hidroginástica',
    description: 'Exercícios aquáticos de baixo impacto, ideal para todas as idades',
    type: 'Aquática',
    maxStudents: 20,
    duration: 60,
    students: 108,
    classes: 6,
    price: 'R$ 160,00',
    status: 'Ativa',
    icon: <Activity className="h-5 w-5 text-white" />,
    iconBg: 'bg-green-500',
    typeColor: 'text-blue-600 bg-blue-100 border-blue-200',
  },
  {
    name: 'Zumba Aquática',
    description: 'Dança e fitness na piscina com ritmos latinos',
    type: 'Coletiva',
    maxStudents: 25,
    duration: 45,
    students: 32,
    classes: 4,
    price: 'R$ 140,00',
    status: 'Ativa',
    icon: <Music className="h-5 w-5 text-white" />,
    iconBg: 'bg-pink-500',
    typeColor: 'text-green-600 bg-green-100 border-green-200',
  },
  {
    name: 'Funcional Aquático',
    description: 'Treinamento funcional adaptado para o ambiente aquático',
    type: 'Coletiva',
    maxStudents: 12,
    duration: 50,
    students: 18,
    classes: 2,
    price: 'R$ 220,00',
    status: 'Ativa',
    icon: <Dumbbell className="h-5 w-5 text-white" />,
    iconBg: 'bg-orange-500',
    typeColor: 'text-green-600 bg-green-100 border-green-200',
  },
  {
    name: 'Natação Terapêutica',
    description: 'Natação para reabilitação e fisioterapia aquática',
    type: 'Individual',
    maxStudents: 1,
    duration: 45,
    students: 12,
    classes: 6,
    price: 'R$ 300,00',
    status: 'Inativa',
    icon: <Heart className="h-5 w-5 text-white" />,
    iconBg: 'bg-cyan-500',
    typeColor: 'text-purple-600 bg-purple-100 border-purple-200',
  },
];

const statusStyles = {
  Ativa: 'bg-green-100 text-green-800 border-green-200',
  Inativa: 'bg-zinc-100 text-zinc-800 border-zinc-200',
};

export default function ModalitiesTable() {
  return (
    <Card>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40px]"><Checkbox /></TableHead>
              <TableHead>Modalidade</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Configurações</TableHead>
              <TableHead>Alunos</TableHead>
              <TableHead>Preço</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {modalities.map((mod, index) => (
              <TableRow key={index}>
                <TableCell><Checkbox /></TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className={cn("flex items-center justify-center h-10 w-10 rounded-lg", mod.iconBg)}>
                      {mod.icon}
                    </div>
                    <div>
                      <p className="font-medium">{mod.name}</p>
                      <p className="text-sm text-muted-foreground truncate max-w-xs">{mod.description}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={cn('font-medium', mod.typeColor)}>
                    {mod.type}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>Máx: {mod.maxStudents} alunos</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>{mod.duration} min</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <p className="font-medium">{mod.students}</p>
                  <p className="text-sm text-muted-foreground">{mod.classes} turmas</p>
                </TableCell>
                <TableCell>
                  <p className="font-medium">{mod.price}</p>
                  <p className="text-sm text-muted-foreground">por mês</p>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={cn('font-medium', statusStyles[mod.status])}>
                    {mod.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon">
                      <Eye className="h-4 w-4" />
                    </Button>
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
