import {
  BarChart,
  Calendar,
  Cog,
  DollarSign,
  Dumbbell,
  Home,
  Receipt,
  User,
  Users,
  Wrench,
  UserPlus,
  MessageSquare,
  Upload,
  Download,
  ClipboardCheck,
  FileText,
  LayoutGrid
} from 'lucide-react';

export const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/caixa', label: 'Caixa', icon: LayoutGrid },
  { href: '/alunos', label: 'Alunos', icon: Users },
  { href: '/turmas', label: 'Turmas', icon: Calendar },
  { href: '/modalidades', label: 'Modalidades', icon: Dumbbell },
  { href: '/professores', label: 'Professores', icon: User },
  { href: '/financeiro', 'label': 'Financeiro', icon: DollarSign },
  { href: '/frequencia', label: 'Frequência', icon: ClipboardCheck },
  { href: '/relatorios', label: 'Relatórios', icon: FileText },
  { href: '/manutencao', label: 'Manutenção', icon: Wrench },
  { href: '/configuracoes', label: 'Configurações', icon: Cog },
];

export const quickActionsAlunos = [
  { label: 'Novo Aluno', icon: UserPlus },
  { label: 'WhatsApp em Lote', icon: MessageSquare },
  { label: 'Exportar Dados', icon: Download },
  { label: 'Importar Alunos', icon: Upload },
];
