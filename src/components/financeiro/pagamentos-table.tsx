
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
import { Building, DollarSign, FileEdit } from 'lucide-react';
import { cn } from '@/lib/utils';

const payments = [
  {
    description: 'Salário - Prof. Ana Silva',
    isRecurring: true,
    supplier: 'Ana Silva Santos',
    category: 'Salários',
    categoryClass: 'bg-blue-100 text-blue-800 border-blue-200',
    value: 'R$ 2.500,00',
    dueDate: '04/01/2024',
    paidDate: 'Pago em 04/01/2024',
    status: 'Pago',
    statusClass: 'bg-green-100 text-green-800 border-green-200',
  },
  {
    description: 'Conta de Luz - CPFL',
    isRecurring: true,
    supplier: 'CPFL Energia',
    category: 'Infraestrutura',
    categoryClass: 'bg-purple-100 text-purple-800 border-purple-200',
    value: 'R$ 850,00',
    dueDate: '14/01/2024',
    paidDate: 'Pago em 13/01/2024',
    status: 'Pago',
    statusClass: 'bg-green-100 text-green-800 border-green-200',
  },
  {
    description: 'Produtos Químicos - Piscina',
    isRecurring: false,
    supplier: 'AquaChem Ltda',
    category: 'Manutenção',
    categoryClass: 'bg-orange-100 text-orange-800 border-orange-200',
    value: 'R$ 320,00',
    dueDate: '19/01/2024',
    status: 'Pendente',
    statusClass: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  },
  {
    description: 'Aluguel do Prédio',
    isRecurring: true,
    supplier: 'Imobiliária Central',
    category: 'Infraestrutura',
    categoryClass: 'bg-purple-100 text-purple-800 border-purple-200',
    value: 'R$ 4.500,00',
    dueDate: '09/01/2024',
    paidDate: '6 dias em atraso',
    status: 'Vencido',
    statusClass: 'bg-red-100 text-red-800 border-red-200',
  },
  {
    description: 'Internet - Vivo Fibra',
    isRecurring: true,
    supplier: 'Vivo S.A.',
    category: 'Operacional',
    categoryClass: 'bg-cyan-100 text-cyan-800 border-cyan-200',
    value: 'R$ 150,00',
    dueDate: '24/01/2024',
    status: 'Pendente',
    statusClass: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  },
];

export default function PagamentosTable() {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Descrição</TableHead>
            <TableHead>Fornecedor</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead>Vencimento</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.map((item, index) => (
            <TableRow key={index}>
              <TableCell>
                <div className="flex items-center gap-2">
                    <p className="font-medium text-sm">{item.description}</p>
                    {item.isRecurring && <Badge variant="outline">Recorrente</Badge>}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2 text-muted-foreground">
                    <Building className="h-4 w-4" />
                    <span className='text-sm'>{item.supplier}</span>
                </div>
              </TableCell>
              <TableCell>
                 <Badge variant="outline" className={cn("font-normal", item.categoryClass)}>{item.category}</Badge>
              </TableCell>
              <TableCell>
                <p className="font-medium text-sm">{item.value}</p>
              </TableCell>
              <TableCell>
                <p className="font-medium text-sm">{item.dueDate}</p>
                {item.paidDate && (
                    <p className={cn("text-xs", item.status === 'Vencido' ? 'text-red-600' : 'text-green-600')}>
                        {item.paidDate}
                    </p>
                )}
              </TableCell>
              <TableCell>
                 <Badge variant="outline" className={cn("font-medium", item.statusClass)}>
                   {item.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon">
                          <DollarSign className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                          <FileEdit className="h-4 w-4" />
                      </Button>
                  </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
