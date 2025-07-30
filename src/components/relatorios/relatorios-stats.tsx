import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { FileText, DollarSign, Users, TrendingUp } from 'lucide-react';
import type { ReportStats } from '@/app/relatorios/actions';

interface RelatoriosStatsProps {
  stats: ReportStats;
}

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(value);
}

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  changeType: 'increase' | 'decrease';
  icon: React.ElementType;
  iconBgColor: string;
  iconColor: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, changeType, icon: Icon, iconBgColor, iconColor }) => {
  return (
    <Card>
        <CardContent className="p-4 flex items-center gap-4">
            <div className={cn("flex items-center justify-center h-10 w-10 rounded-lg", iconBgColor)}>
              <Icon className={cn("h-5 w-5", iconColor)} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{title}</p>
              <p className="text-xl font-bold">{value}</p>
              <p className={cn('text-xs', changeType === 'increase' ? 'text-green-600' : 'text-red-600')}>{change}</p>
            </div>
        </CardContent>
    </Card>
  );
};


export default function RelatoriosStats({ stats }: RelatoriosStatsProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <StatCard 
        title="Relatórios Gerados"
        value={stats.generatedReports.toString()}
        change="Este mês"
        changeType="increase"
        icon={FileText}
        iconBgColor="bg-blue-100"
        iconColor="text-blue-600"
      />
      <StatCard 
        title="Receita Total"
        value={formatCurrency(stats.totalRevenue)}
        change="Mês atual"
        changeType="increase"
        icon={DollarSign}
        iconBgColor="bg-green-100"
        iconColor="text-green-600"
      />
      <StatCard 
        title="Alunos Ativos"
        value={stats.activeStudents.toString()}
        change="Total"
        changeType="increase"
        icon={Users}
        iconBgColor="bg-yellow-100"
        iconColor="text-yellow-600"
      />
      <StatCard 
        title="Taxa de Frequência"
        value={`${stats.attendanceRate.toFixed(1)}%`}
        change="Média mensal"
        changeType="increase"
        icon={TrendingUp}
        iconBgColor="bg-cyan-100"
        iconColor="text-cyan-600"
      />
    </div>
  );
}
