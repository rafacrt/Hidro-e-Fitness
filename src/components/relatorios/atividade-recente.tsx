import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Download, BarChart2, Eye, File, Clock } from 'lucide-react';

const activities = [
  { 
    title: 'Relatório Financeiro gerado', 
    author: 'Admin Sistema', 
    time: '2 horas atrás', 
    icon: File,
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600'
  },
  { 
    title: 'Relatório de Frequência exportado', 
    author: 'Prof. Ana Silva', 
    time: '4 horas atrás', 
    icon: Download,
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600'
  },
  { 
    title: 'Relatório Personalizado criado', 
    author: 'Admin Sistema', 
    time: '1 dia atrás', 
    icon: BarChart2,
    iconBg: 'bg-yellow-100',
    iconColor: 'text-yellow-600'
  },
  { 
    title: 'Relatório de Alunos compartilhado', 
    author: 'Recepção', 
    time: '2 dias atrás', 
    icon: Eye,
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600'
  },
];

export default function AtividadeRecente() {
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Atividade Recente</CardTitle>
        <FileText className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-center gap-4">
            <div className={`flex items-center justify-center h-10 w-10 rounded-lg ${activity.iconBg}`}>
                <activity.icon className={`h-5 w-5 ${activity.iconColor}`} />
            </div>
            <div className="flex-grow">
              <p className="font-semibold text-sm">{activity.title}</p>
              <p className="text-xs text-muted-foreground">{activity.author}</p>
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <Clock className="h-3 w-3 mr-1" />
              <span>{activity.time}</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
