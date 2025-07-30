
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
import { CheckCircle2, Clock, Download, Eye, QrCode, CreditCard, Wallet, AlertCircle, RefreshCw, XCircle, FileText, Building, User } from 'lucide-react';
import type { Database } from '@/lib/database.types';
import { format } from 'date-fns';

type Payment = Database['public']['Tables']['payments']['Row'];

interface HistoricoTableProps {
  payments: Payment[];
}

const statusConfig = {
    pago: { icon: CheckCircle2, class: 'bg-green-100 text-green-800 border-green-200' },
    pendente: { icon: Clock, class: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
    vencido: { icon: AlertCircle, class: 'bg-red-100 text-red-800 border-red-200' },
    estornado: { icon: RefreshCw, class: 'bg-zinc-100 text-zinc-800 border-zinc-200' },
    falhou: { icon: XCircle, class: 'bg-red-100 text-red-800 border-red-200' },
};

const methodConfig = {
    'PIX': { icon: QrCode },
    'Cartão de Crédito': { icon: CreditCard },
    'Cartão de Débito': { icon: CreditCard },
    'Dinheiro': { icon: Wallet },
    'Boleto': { icon: FileText },
    'Transferência': { icon: Building },
};

const formatCurrency = (value: number | null) => {
  if (value === null) return 'N/A';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export default function HistoricoTable({ payments }: HistoricoTableProps) {
  if (payments.length === 0) {
    return (
      <Card>
        <div className="p-6 text-center text-muted-foreground">
          <FileText className="mx-auto h-12 w-12 mb-4" />
          <h3 className="text-lg font-semibold">Nenhuma transação encontrada</h3>
          <p className="text-sm">Tente ajustar os filtros ou registre uma nova transação.</p>
        </div>
      </Card>
    );
  }
  return (
    <Card>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Descrição</TableHead>
              <TableHead>Método</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Data</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((item) => {
              const statusInfo = statusConfig[item.status as keyof typeof statusConfig] || statusConfig.pendente;
              const MethodIcon = methodConfig[item.payment_method as keyof typeof methodConfig]?.icon || User;
              
              return (
              <TableRow key={item.id}>
                <TableCell>
                  <p className="font-medium">{item.description}</p>
                  <p className="text-sm text-muted-foreground">{item.category}</p>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <MethodIcon className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{item.payment_method}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <p className="font-medium">{formatCurrency(item.amount)}</p>
                </TableCell>
                <TableCell>
                   <Badge variant="outline" className={cn("font-medium", statusInfo.class)}>
                     <div className="flex items-center gap-1.5">
                        <statusInfo.icon className="h-3 w-3" />
                        <span className="capitalize">{item.status}</span>
                     </div>
                  </Badge>
                </TableCell>
                <TableCell>
                  <p className="font-medium">{format(new Date(item.due_date), 'dd/MM/yyyy')}</p>
                  {item.paid_at && <p className="text-xs text-muted-foreground">Pago em: {format(new Date(item.paid_at), 'dd/MM/yyyy')}</p>}
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
            )})}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
