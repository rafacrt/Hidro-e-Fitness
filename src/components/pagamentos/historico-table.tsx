import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '../ui/card';
import { cn } from '@/lib/utils';
import { CheckCircle2, Clock, Download, Eye, QrCode, CreditCard, Wallet, AlertCircle, RefreshCw, XCircle } from 'lucide-react';

const transactions = [
  {
    id: 'PAY-2024-001',
    studentName: 'Maria Santos Silva',
    studentEmail: 'maria.santos@email.com',
    plan: 'Natação Adulto - Mensal',
    planPeriod: 'Mensalidade Janeiro 2024',
    method: 'PIX',
    methodIcon: QrCode,
    value: 'R$ 180,00',
    liquid: 'Líquido: R$ 180,00',
    status: 'Concluído',
    statusIcon: CheckCircle2,
    statusColor: 'bg-green-100 text-green-800 border-green-200',
    date: '15/01/2024',
    time: '10:30',
    conclusionDate: 'Concluído: 10:30',
  },
  {
    id: 'PAY-2024-002',
    studentName: 'João Pedro Costa',
    studentEmail: 'joao.costa@email.com',
    plan: 'Hidroginástica - Mensal',
    planPeriod: 'Mensalidade Janeiro 2024',
    method: 'Cartão de Crédito',
    methodIcon: CreditCard,
    methodDetails: 'Visa **** 1234',
    value: 'R$ 160,00',
    liquid: 'Líquido: R$ 154,40',
    tax: 'Taxa: R$ 5,60',
    status: 'Concluído',
    statusIcon: CheckCircle2,
    statusColor: 'bg-green-100 text-green-800 border-green-200',
    date: '15/01/2024',
    time: '09:15',
    conclusionDate: 'Concluído: 09:15',
  },
  {
    id: 'PAY-2024-003',
    studentName: 'Ana Clara Oliveira',
    studentEmail: 'ana.oliveira@email.com',
    plan: 'Natação Infantil - Mensal',
    planPeriod: 'Mensalidade Janeiro 2024',
    method: 'PIX',
    methodIcon: QrCode,
    value: 'R$ 150,00',
    liquid: 'Líquido: R$ 150,00',
    status: 'Pendente',
    statusIcon: Clock,
    statusColor: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    date: '15/01/2024',
    time: '08:45',
  },
   {
    id: 'PAY-2024-004',
    studentName: 'Carlos Eduardo Lima',
    studentEmail: 'carlos.lima@email.com',
    plan: 'Funcional Aquático - Mensal',
    planPeriod: 'Mensalidade Janeiro 2024',
    method: 'Cartão de Débito',
    methodIcon: CreditCard,
    methodDetails: 'Mastercard **** 5678',
    value: 'R$ 220,00',
    liquid: 'Líquido: R$ 215,60',
    tax: 'Taxa: R$ 4,40',
    status: 'Concluído',
    statusIcon: CheckCircle2,
    statusColor: 'bg-green-100 text-green-800 border-green-200',
    date: '14/01/2024',
    time: '16:20',
    conclusionDate: 'Concluído: 16:20',
  },
  {
    id: 'PAY-2024-005',
    studentName: 'Fernanda Souza',
    studentEmail: 'fernanda.souza@email.com',
    plan: 'Zumba Aquática - Mensal',
    planPeriod: 'Mensalidade Janeiro 2024',
    method: 'Dinheiro',
    methodIcon: Wallet,
    value: 'R$ 140,00',
    liquid: 'Líquido: R$ 140,00',
    status: 'Concluído',
    statusIcon: CheckCircle2,
    statusColor: 'bg-green-100 text-green-800 border-green-200',
    date: '14/01/2024',
    time: '14:10',
    conclusionDate: 'Concluído: 14:10',
  },
  {
    id: 'PAY-2024-006',
    studentName: 'Roberto Silva',
    studentEmail: 'roberto.silva@email.com',
    plan: 'Natação Adulto - Trimestral',
    planPeriod: 'Plano Trimestral Janeiro-Março 2024',
    method: 'Cartão de Crédito',
    methodIcon: CreditCard,
    methodDetails: 'Elo **** 9012 - 3x',
    value: 'R$ 486,00',
    liquid: 'Líquido: R$ 468,99',
    tax: 'Taxa: R$ 17,01',
    status: 'Falhou',
    statusIcon: AlertCircle,
    statusColor: 'bg-red-100 text-red-800 border-red-200',
    statusReason: 'Cartão sem limite',
    date: '13/01/2024',
    time: '11:30',
  },
  {
    id: 'PAY-2024-007',
    studentName: 'Lucia Santos',
    studentEmail: 'lucia.santos@email.com',
    plan: 'Natação Adulto - Mensal',
    planPeriod: 'Mensalidade Janeiro 2024 - Estornada',
    method: 'PIX',
    methodIcon: QrCode,
    value: 'R$ 180,00',
    liquid: 'Líquido: R$ 180,00',
    status: 'Estornado',
    statusIcon: RefreshCw,
    statusColor: 'bg-zinc-100 text-zinc-800 border-zinc-200',
    statusReason: 'Cancelamento de matrícula',
    date: '12/01/2024',
    time: '15:45',
  },
];

export default function HistoricoTable() {
  return (
    <Card>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID / Aluno</TableHead>
              <TableHead>Plano</TableHead>
              <TableHead>Método</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Data</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((item, index) => (
              <TableRow key={index}>
                <TableCell>
                  <p className="font-medium">{item.id}</p>
                  <p className="text-sm text-muted-foreground">{item.studentName}</p>
                   <p className="text-xs text-muted-foreground">{item.studentEmail}</p>
                </TableCell>
                <TableCell>
                  <p className="font-medium">{item.plan}</p>
                  <p className="text-sm text-muted-foreground">{item.planPeriod}</p>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <item.methodIcon className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{item.method}</p>
                      {item.methodDetails && <p className="text-sm text-muted-foreground">{item.methodDetails}</p>}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <p className="font-medium">{item.value}</p>
                  <p className="text-sm text-muted-foreground">{item.liquid}</p>
                  {item.tax && <p className="text-xs text-muted-foreground">{item.tax}</p>}
                </TableCell>
                <TableCell>
                   <Badge variant="outline" className={cn("font-medium", item.statusColor)}>
                     <div className="flex items-center gap-1.5">
                        <item.statusIcon className="h-3 w-3" />
                        {item.status}
                     </div>
                  </Badge>
                  {item.statusReason && <p className="text-xs text-muted-foreground mt-1">{item.statusReason}</p>}
                </TableCell>
                <TableCell>
                  <p className="font-medium">{item.date}</p>
                  <p className="text-sm text-muted-foreground">{item.time}</p>
                  {item.conclusionDate && <p className="text-xs text-muted-foreground">{item.conclusionDate}</p>}
                </TableCell>
                <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                            <Download className="h-4 w-4" />
                        </Button>
                    </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
