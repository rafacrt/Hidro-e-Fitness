import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dumbbell, Users, Activity, Heart, Anchor, Waves, Brain, Edit } from 'lucide-react';
import { ReactElement } from 'react';
import { Separator } from '../ui/separator';

const modalities: { 
    name: string; 
    description: string; 
    type: string; 
    classes: string; 
    groups: string; 
    duration: string;
    status: string; 
    category: string;
    students: number;
    revenue: string;
    icon: ReactElement; 
    color: string 
}[] = [
  { name: 'Natação Adulto', description: 'Aulas de natação para adultos de todos os níveis.', type: 'Natação', classes: 'Seg-Sex', groups: 'Manhã, Tarde, Noite', duration: '45min', status: 'Ativa', category: 'Aquática', students: 99, revenue: 'R$ 15.000,00', icon: <Users className="h-6 w-6" />, color: 'bg-blue-500' },
  { name: 'Aqua Aeróbica', description: 'Exercícios aeróbicos de baixo impacto na água.', type: 'Fitness', classes: 'Seg, Qua, Sex', groups: 'Manhã, Noite', duration: '50min', status: 'Ativa', category: 'Aquática', students: 49, revenue: 'R$ 8.000,00', icon: <Heart className="h-6 w-6" />, color: 'bg-purple-500' },
  { name: 'Hidroginástica', description: 'Combinação de ginástica e dança na água.', type: 'Saúde', classes: 'Ter, Qui', groups: 'Manhã', duration: '60min', status: 'Ativa', category: 'Aquática', students: 100, revenue: 'R$ 12.000,00', icon: <Activity className="h-6 w-6" />, color: 'bg-green-500' },
  { name: 'Natação Infantil', description: 'Aulas de natação para crianças e adolescentes.', type: 'Natação', classes: 'Seg-Sex', groups: 'Tarde', duration: '40min', status: 'Ativa', category: 'Aquática', students: 40, revenue: 'R$ 10.000,00', icon: <Waves className="h-6 w-6" />, color: 'bg-yellow-500' },
  { name: 'Hidroterapia', description: 'Fisioterapia aquática para reabilitação.', type: 'Terapêutica', classes: 'Sob Demanda', groups: 'Variados', duration: '30min', status: 'Inativa', category: 'Aquática', students: 8, revenue: 'R$ 2.500,00', icon: <Anchor className="h-6 w-6" />, color: 'bg-gray-500' },
  { name: 'Funcional Aquático', description: 'Treinamento funcional de alta intensidade na água.', type: 'Fitness', classes: 'Seg, Qui', groups: 'Noite', duration: '50min', status: 'Ativa', category: 'Aquática', students: 30, revenue: 'R$ 6.000,00', icon: <Dumbbell className="h-6 w-6" />, color: 'bg-orange-500' },
];

const statusStyles: { [key: string]: string } = {
  Ativa: 'bg-green-100 text-green-800 border-green-200',
  Inativa: 'bg-zinc-100 text-zinc-800 border-zinc-200',
};

export default function AllModalities() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Todas as Modalidades</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {modalities.map((mod, index) => (
          <Card key={index} className="overflow-hidden">
            <div className="p-4 flex flex-col sm:flex-row">
              <div className="flex flex-col items-center justify-center p-4 w-full sm:w-1/4">
                <div className={`flex items-center justify-center h-12 w-12 rounded-lg text-white mb-4 ${mod.color}`}>
                  {mod.icon}
                </div>
                <div className="text-center">
                  <p className="font-bold">{mod.category}</p>
                  <p className="text-sm text-muted-foreground">{mod.students} Alunos</p>
                  <p className="text-sm text-muted-foreground">{mod.revenue}</p>
                </div>
              </div>

              <div className="w-full sm:w-3/4 sm:pl-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold">{mod.name}</h3>
                    <p className="text-sm text-muted-foreground">{mod.description}</p>
                  </div>
                  <Badge variant="outline" className={statusStyles[mod.status]}>{mod.status}</Badge>
                </div>
                
                <Separator className="my-3" />

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Tipo</p>
                    <p className="font-medium">{mod.type}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Aulas</p>
                    <p className="font-medium">{mod.classes}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Turmas</p>
                    <p className="font-medium">{mod.groups}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Duração</p>
                    <p className="font-medium">{mod.duration}</p>
                  </div>
                </div>

              </div>
            </div>
            <CardFooter className="bg-muted/50 px-4 py-3 flex justify-between">
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </Button>
              <Button size="sm">Ver Detalhes</Button>
            </CardFooter>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
}
