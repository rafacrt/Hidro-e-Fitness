import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, AlertTriangle } from 'lucide-react';

const urgentMaintenances = [
  {
    title: 'Bomba da Piscina 1',
    location: 'Casa de Máquinas',
    description: 'Troca de filtros e verificação do motor',
    date: '17/01/2024',
    type: 'Preventiva',
    cost: 'R$ 450,00',
    priority: 'Alta',
    priorityClass: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  },
  {
    title: 'Sistema de Aquecimento',
    location: 'Piscina 2',
    description: 'Reparo no trocador de calor',
    date: '15/01/2024',
    type: 'Corretiva',
    cost: 'R$ 1.200,00',
    priority: 'Urgente',
    priorityClass: 'bg-red-100 text-red-800 border-red-200',
  },
  {
    title: 'Iluminação LED Piscina',
    location: 'Piscina 1',
    description: 'Substituição de lâmpadas queimadas',
    date: '19/01/2024',
    type: 'Preventiva',
    cost: 'R$ 320,00',
    priority: 'Média',
    priorityClass: 'bg-orange-100 text-orange-800 border-orange-200',
  },
];

export default function ManutencaoUrgente() {
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Manutenções Urgentes</CardTitle>
        <AlertTriangle className="h-5 w-5 text-yellow-500" />
      </CardHeader>
      <CardContent className="space-y-4">
        {urgentMaintenances.map((item, index) => (
          <div key={index} className="p-4 rounded-lg bg-secondary/50">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold">{item.title}</p>
                <p className="text-sm text-muted-foreground">{item.location} - {item.description}</p>
              </div>
              <Badge variant="outline" className={item.priorityClass}>{item.priority}</Badge>
            </div>
            <div className="flex justify-between items-center mt-2">
                <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-1.5" />
                    <span>{item.date}</span>
                    <span className="mx-2">•</span>
                    <span>{item.type}</span>
                </div>
                <p className="font-semibold">{item.cost}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
