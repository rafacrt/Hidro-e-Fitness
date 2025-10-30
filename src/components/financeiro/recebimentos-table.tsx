'use client';

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
import { MessageSquare, FileEdit, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import type { Database } from '@/lib/database.types';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { DetalhesTransacaoDialog } from './detalhes-transacao-dialog';
import { EditTransacaoDialog } from './edit-transacao-dialog';
import { DeleteTransacaoAlert } from './delete-transacao-alert';

type Payment = Database['public']['Tables']['payments']['Row'];

interface RecebimentosTableProps {
  recebimentos: Payment[];
  onSuccess: () => void;
}

const statusConfig: Record<string, { text: string; class: string }> = {
  pago: { text: 'Pago', class: 'bg-green-100 text-green-800 border-green-200' },
  pendente: { text: 'Pendente', class: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  vencido: { text: 'Vencido', class: 'bg-red-100 text-red-800 border-red-200' },
  inadimplente: { text: 'Inadimplente', class: 'bg-red-200 text-red-900 border-red-300' },
};

const formatCurrency = (value: number | null) => {
  if (!value) return 'R$ 0,00';
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

const parseDateSafe = (value?: string | null): Date | null => {
  if (!value) return null;
  try {
    const parsed = parseISO(value);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed;
    }
  } catch {
    // fallback abaixo
  }
  const fallback = new Date(value);
  return Number.isNaN(fallback.getTime()) ? null : fallback;
};

const resolveReferenceDate = (payment: Payment): Date | null => {
  return (
    parseDateSafe(payment.due_date) ||
    parseDateSafe(payment.payment_date) ||
    parseDateSafe(payment.created_at)
  );
};

export default function RecebimentosTable({ recebimentos, onSuccess }: RecebimentosTableProps) {
  const { toast } = useToast();

  const handleActionClick = (description: string) => {
    toast({
      title: 'Funcionalidade em desenvolvimento',
      description: `A ação "${description}" será implementada em breve.`,
    });
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Descrição</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead>Vencimento</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TooltipProvider>
            {recebimentos.map((item) => {
              const statusInfo =
                statusConfig[item.status as keyof typeof statusConfig] || statusConfig.pendente;
              const referenceDate = resolveReferenceDate(item);
              const description =
                item.description ||
                (referenceDate
                  ? `Mensalidade ${format(referenceDate, 'MMM/yyyy', { locale: ptBR })}`
                  : 'Mensalidade');
              const formattedDate = referenceDate
                ? format(referenceDate, 'dd/MM/yyyy', { locale: ptBR })
                : '-';
              const paymentMethod = item.payment_method || 'Não definido';

              return (
                <DetalhesTransacaoDialog transacao={item} key={item.id} onSuccess={onSuccess}>
                  <TableRow className="cursor-pointer">
                    <TableCell>
                      <p className="font-medium text-sm">{description}</p>
                      <p className="text-xs text-muted-foreground">{paymentMethod}</p>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium text-sm">{formatCurrency(item.amount)}</p>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium text-sm">{formattedDate}</p>
                      {item.status === 'pago' && <p className="text-xs text-green-600">Pago</p>}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn('font-medium capitalize', statusInfo.class)}>
                        {statusInfo.text}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleActionClick('Enviar Lembrete');
                              }}
                            >
                              <MessageSquare className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Enviar Lembrete</p>
                          </TooltipContent>
                        </Tooltip>
                        <EditTransacaoDialog transacao={item} onSuccess={onSuccess}>
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
                        <DeleteTransacaoAlert transacaoId={item.id} onSuccess={onSuccess}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-red-500 hover:text-red-600"
                                onClick={(e) => e.stopPropagation()}
                              >
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
              );
            })}
          </TooltipProvider>
        </TableBody>
      </Table>
    </div>
  );
}
