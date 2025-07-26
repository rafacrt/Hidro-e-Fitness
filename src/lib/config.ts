import {
  AreaChart,
  Calendar,
  Cog,
  DollarSign,
  Dumbbell,
  Home,
  Receipt,
  User,
  Users,
  Wrench,
  BarChart,
  UserPlus,
  MessageSquare,
  Upload,
  Download,
} from 'lucide-react';

export const navItems = [
  { href: '/', label: 'Dashboard', icon: Home },
  { href: '/alunos', label: 'Alunos', icon: Users },
  { href: '/turmas', label: 'Turmas', icon: Calendar },
  { href: '/modalidades', label: 'Modalidades', icon: Dumbbell },
  { href: '#professores', label: 'Professores', icon: User },
  { href: '/financeiro', 'label': 'Financeiro', icon: DollarSign },
  { href: '#pagamentos', label: 'Pagamentos', icon: Receipt },
  { href: '#frequencia', label: 'Frequência', icon: BarChart },
  { href: '#relatorios', label: 'Relatórios', icon: AreaChart },
  { href: '#manutencao', label: 'Manutenção', icon: Wrench },
  { href: '#configuracoes', label: 'Configurações', icon: Cog },
];

export const quickActionsAlunos = [
  { label: 'Novo Aluno', icon: UserPlus },
  { label: 'WhatsApp em Lote', icon: MessageSquare },
  { label: 'Exportar Dados', icon: Download },
  { label: 'Importar Alunos', icon: Upload },
];
