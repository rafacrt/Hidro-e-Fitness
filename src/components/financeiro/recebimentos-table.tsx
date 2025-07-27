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
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MessageSquare, Receipt, FileEdit } from 'lucide-react';
import { cn } from '@/lib/utils';

const receipts = [
  {
    studentName: 'Maria Santos Silva',
    studentPhone: '(11) 99999-8888',
    studentAvatar: 'MS',
    description: 'Mensalidade Janeiro 2024',
    modality: 'Natação Adulto',
    value: 'R$ 180,00',
    dueDate: '14/01/2024',
    paidDate: 'Pago em 14/01/2024',
    status: 'Pago',
    statusClass: 'bg-green-100 text-green-800 border-green-200',
    paymentMethod: 'PIX',
  },
  {
    studentName: 'João Pedro Costa',
    studentPhone: '(11) 88888-7777',
    studentAvatar: 'JP',
    description: 'Mensalidade Janeiro 2024',
    modality: 'Hidroginástica',
    value: 'R$ 160,00',
    dueDate: '09/01/2024',
    paidDate: '6 dias em atraso',
    status: 'Vencido',
    statusClass: 'bg-red-100 text-red-800 border-red-200',
  },
  {
    studentName: 'Ana Clara Oliveira',
    studentPhone: '(11) 77777-6666',
    studentAvatar: 'AC',
    description: 'Mensalidade Janeiro 2024',
    modality: 'Natação + Hidroginástica',
    value: 'R$ 200,00',
    dueDate: '19/01/2024',
    status: 'Pendente',
    statusClass: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  },
  {
    studentName: 'Carlos Eduardo Lima',
    studentPhone: '(11) 66666-5555',
    studentAvatar: 'CE',
    description: 'Mensalidade Janeiro 2024',
    modality: 'Natação Infantil',
    value: 'R$ 150,00',
    dueDate: '24/01/2024',
    status: 'Pendente',
    statusClass: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  },
];

export default function RecebimentosTable() {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Aluno</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead>Vencimento</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {receipts.map((item, index) => (
            <TableRow key={index}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-secondary text-secondary-foreground text-xs">{item.studentAvatar}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm">{item.studentName}</p>
                    <p className="text-xs text-muted-foreground">{item.studentPhone}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <p className="font-medium text-sm">{item.description}</p>
                <p className="text-xs text-muted-foreground">{item.modality}</p>
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
                {item.paymentMethod && <p className="text-xs text-muted-foreground mt-1">{item.paymentMethod}</p>}
              </TableCell>
              <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon">
                          <Receipt className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                          <MessageSquare className="h-4 w-4" />
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
