
'use client';

import * as React from 'react';
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
import { Building, DollarSign, FileEdit, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import type { Database } from '@/lib/database.types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { EditTransacaoDialog } from './edit-transacao-dialog';
import { DetalhesTransacaoDialog } from './detalhes-transacao-dialog';
import { DeleteTransacaoAlert } from './delete-transacao-alert';
import { Checkbox } from '../ui/checkbox';

type Payment = Database['public']['Tables']['payments']['Row'];

interface PagamentosTableProps {
  pagamentos: Payment[];
  selectedPayments: string[];
  setSelectedPayments: React.Dispatch<React.SetStateAction<string[]>>;
}

const statusConfig = {
    pago: { text: 'Pago', class: 'bg-green-100 text-green-800 border-green-200' },
    pendente: { text: 'Pendente', class: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
    vencido: { text: 'Vencido', class: 'bg-red-100 text-red-800 border-red-200' },
};

const formatCurrency = (value: number | null) => {
    if (!value) return 'R$ 0,00';
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

export default function PagamentosTable({ pagamentos, selectedPayments, setSelectedPayments }: PagamentosTableProps) {
  const { toast } = useToast();
  
  const handleSelectAll = (checked: boolean | 'indeterminate') => {
    if (checked === true) {
      setSelectedPayments(pagamentos.map(p => p.id));
    } else {
      setSelectedPayments([]);
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedPayments(prev => [...prev, id]);
    } else {
      setSelectedPayments(prev => prev.filter(pId => pId !== id));
    }
  };
  
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox 
                checked={selectedPayments.length > 0 && selectedPayments.length === pagamentos.length}
                onCheckedChange={handleSelectAll}
              />
            </TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead>Vencimento</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TooltipProvider>
            {pagamentos.map((item) => {
              const statusInfo = statusConfig[item.status as keyof typeof statusConfig] || statusConfig.pendente;
              return (
                <DetalhesTransacaoDialog transacao={item} key={item.id}>
                  <TableRow className="cursor-pointer">
                     <TableCell onClick={(e) => e.stopPropagation()}>
                        <Checkbox 
                            checked={selectedPayments.includes(item.id)}
                            onCheckedChange={(checked) => handleSelectOne(item.id, !!checked)}
                        />
                    </TableCell>
                    <TableCell>
                      <p className="font-medium text-sm">{item.description}</p>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium text-sm">{formatCurrency(item.amount)}</p>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium text-sm">{format(new Date(item.due_date), 'dd/MM/yyyy', { locale: ptBR })}</p>
                      {item.paid_at && <p className="text-xs text-muted-foreground">Pago em {format(new Date(item.paid_at), 'dd/MM/yyyy')}</p>}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn("font-medium capitalize", statusInfo.class)}>
                        {statusInfo.text}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <EditTransacaoDialog transacao={item}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
                                    <FileEdit className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Editar</p>
                              </TooltipContent>
                            </Tooltip>
                          </EditTransacaoDialog>
                          <DeleteTransacaoAlert transacaoId={item.id}>
                             <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600" onClick={(e) => e.stopPropagation()}>
                                      <Trash2 className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Excluir</p>
                                </TooltipContent>
                              </Tooltip>
                          </DeleteTransacaoAlert>
                        </div>
                    </TableCell>
                  </TableRow>
                </DetalhesTransacaoDialog>
              )
            })}
          </TooltipProvider>
        </TableBody>
      </Table>
    </div>
  );
}
