import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DollarSign, BarChart2, Users, UserPlus, Download } from 'lucide-react';

const reports = [
  { 
    title: 'Relatório Financeiro Mensal',
    description: 'Receitas, despesas e lucro líquido do mês',
    category: 'Financeiro',
    lastUsed: '14/01/2024',
    downloads: 45,
    icon: DollarSign,
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
  },
  { 
    title: 'Frequência por Modalidade',
    description: 'Análise de presença dos alunos por atividade',
    category: 'Frequência',
    lastUsed: '13/01/2024',
    downloads: 32,
    icon: BarChart2,
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
  },
  { 
    title: 'Performance dos Professores',
    description: 'Avaliação e estatísticas dos instrutores',
    category: 'Performance',
    lastUsed: '12/01/2024',
    downloads: 28,
    icon: Users,
    iconBg: 'bg-yellow-100',
    iconColor: 'text-yellow-600',
  },
  { 
    title: 'Cadastro de Novos Alunos',
    description: 'Relatório de matrículas e crescimento',
    category: 'Alunos',
    lastUsed: '11/01/2024',
    downloads: 21,
    icon: UserPlus,
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
  },
];

export default function RelatoriosMaisUtilizados() {
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Relatórios Mais Utilizados</CardTitle>
        <Button variant="link" className="text-sm">Ver todos</Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {reports.map((report, index) => (
          <div key={index} className="flex items-center gap-4 p-2 rounded-lg hover:bg-secondary/50">
            <div className={`flex items-center justify-center h-10 w-10 rounded-lg ${report.iconBg}`}>
              <report.icon className={`h-5 w-5 ${report.iconColor}`} />
            </div>
            <div className="flex-grow">
              <p className="font-semibold text-sm">{report.title}</p>
              <p className="text-xs text-muted-foreground">
                Categoria: {report.category} · Último: {report.lastUsed}
              </p>
            </div>
            <div className="text-right flex items-center gap-2 text-muted-foreground text-sm">
                <span>{report.downloads}</span>
                <Download className="h-4 w-4" />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
