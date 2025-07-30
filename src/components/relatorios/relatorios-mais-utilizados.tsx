import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DollarSign, BarChart2, Users, FileText, Download } from 'lucide-react';
import type { Database } from '@/lib/database.types';
import { format } from 'date-fns';

type Report = Database['public']['Tables']['reports']['Row'];

interface RelatoriosMaisUtilizadosProps {
  reports: Report[];
}

const iconMap = {
    'Financeiro': { icon: DollarSign, bg: 'bg-green-100', text: 'text-green-600' },
    'Frequência': { icon: BarChart2, bg: 'bg-blue-100', text: 'text-blue-600' },
    'Performance': { icon: Users, bg: 'bg-yellow-100', text: 'text-yellow-600' },
    'Alunos': { icon: Users, bg: 'bg-purple-100', text: 'text-purple-600' },
    'Padrão': { icon: FileText, bg: 'bg-zinc-100', text: 'text-zinc-600' }
}

export default function RelatoriosMaisUtilizados({ reports }: RelatoriosMaisUtilizadosProps) {
  if (reports.length === 0) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Relatórios Mais Utilizados</CardTitle>
        </CardHeader>
        <CardContent className="text-center text-muted-foreground">
          <FileText className="mx-auto h-12 w-12 mb-4" />
          <p>Nenhum relatório gerado ainda.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Relatórios Mais Utilizados</CardTitle>
        <Button variant="link" className="text-sm">Ver todos</Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {reports.map((report) => {
          const IconInfo = iconMap[report.category as keyof typeof iconMap] || iconMap['Padrão'];
          const Icon = IconInfo.icon;
          return (
            <div key={report.id} className="flex items-center gap-4 p-2 rounded-lg hover:bg-secondary/50">
              <div className={`flex items-center justify-center h-10 w-10 rounded-lg ${IconInfo.bg}`}>
                <Icon className={`h-5 w-5 ${IconInfo.text}`} />
              </div>
              <div className="flex-grow">
                <p className="font-semibold text-sm">{report.name}</p>
                <p className="text-xs text-muted-foreground">
                  Categoria: {report.category} · Último: {format(new Date(report.last_generated_at), 'dd/MM/yyyy')}
                </p>
              </div>
              <div className="text-right flex items-center gap-2 text-muted-foreground text-sm">
                  <span>{report.times_generated}</span>
                  <Download className="h-4 w-4" />
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  );
}
