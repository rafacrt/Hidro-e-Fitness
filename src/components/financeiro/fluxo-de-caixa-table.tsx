
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { Database } from '@/lib/database.types';
import { format } from 'date-fns';

type Payment = Database['public']['Tables']['payments']['Row'];

interface FluxoDeCaixaTableProps {
  transactions: Payment[];
}

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

export default function FluxoDeCaixaTable({ transactions }: FluxoDeCaixaTableProps) {
    let currentBalance = 0;

    const sortedTransactions = [...transactions].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Data</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead>Entrada</TableHead>
            <TableHead>Saída</TableHead>
            <TableHead className="text-right">Saldo</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedTransactions.map((item, index) => {
            const amount = item.amount || 0;
            const isEntry = amount > 0;
            currentBalance += amount;

            return (
                <TableRow key={index}>
                <TableCell>
                    <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{format(new Date(item.created_at), 'dd/MM/yyyy')}</span>
                    </div>
                </TableCell>
                <TableCell>
                    <p className="font-medium text-sm">{item.description}</p>
                </TableCell>
                <TableCell>
                    <p className="font-medium text-sm text-green-600">{isEntry ? formatCurrency(amount) : ''}</p>
                </TableCell>
                <TableCell>
                    <p className="font-medium text-sm text-red-600">{!isEntry ? formatCurrency(amount) : ''}</p>
                </TableCell>
                <TableCell className="text-right">
                    <p className="font-semibold text-sm">{formatCurrency(currentBalance)}</p>
                </TableCell>
                </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  );
}
