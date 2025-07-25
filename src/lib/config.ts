import {
  AreaChart,
  Calendar,
  Cog,
  DollarSign,
  Dumbbell,
  Home,
  Receipt,
  Settings,
  User,
  Users,
  Wrench,
  BarChart,
} from 'lucide-react';

export const navItems = [
  { href: '#dashboard', label: 'Dashboard', icon: Home },
  { href: '#alunos', label: 'Alunos', icon: Users },
  { href: '#turmas', label: 'Turmas', icon: Calendar },
  { href: '#modalidades', label: 'Modalidades', icon: Dumbbell },
  { href: '#professores', label: 'Professores', icon: User },
  { href: '#financeiro', label: 'Financeiro', icon: DollarSign },
  { href: '#pagamentos', label: 'Pagamentos', icon: Receipt },
  { href: '#frequencia', label: 'Frequência', icon: BarChart },
  { href: '#relatorios', label: 'Relatórios', icon: AreaChart },
  { href: '#manutencao', label: 'Manutenção', icon: Wrench },
  { href: '#configuracoes', label: 'Configurações', icon: Cog },
];
