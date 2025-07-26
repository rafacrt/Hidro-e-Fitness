import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { FileText, DollarSign, Users, TrendingUp } from 'lucide-react';

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


export default function RelatoriosStats() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <StatCard 
        title="Relatórios Gerados"
        value="156"
        change="+23 Este mês"
        changeType="increase"
        icon={FileText}
        iconBgColor="bg-blue-100"
        iconColor="text-blue-600"
      />
      <StatCard 
        title="Receita Total"
        value="R$ 58.500"
        change="+12% Janeiro 2024"
        changeType="increase"
        icon={DollarSign}
        iconBgColor="bg-green-100"
        iconColor="text-green-600"
      />
      <StatCard 
        title="Alunos Ativos"
        value="342"
        change="+18 Atual"
        changeType="increase"
        icon={Users}
        iconBgColor="bg-yellow-100"
        iconColor="text-yellow-600"
      />
      <StatCard 
        title="Taxa de Frequência"
        value="87.5%"
        change="+2.3% Média mensal"
        changeType="increase"
        icon={TrendingUp}
        iconBgColor="bg-cyan-100"
        iconColor="text-cyan-600"
      />
    </div>
  );
}
