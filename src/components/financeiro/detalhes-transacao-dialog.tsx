
'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Pencil,
  FileText,
  DollarSign,
  Calendar,
  CreditCard,
  CheckCircle2,
  Clock,
  AlertCircle,
  Hash
} from 'lucide-react';
import type { Database } from '@/lib/database.types';
import { format } from 'date-fns';
import { EditTransacaoDialog } from './edit-transacao-dialog';
import { Separator } from '../ui/separator';

type Payment = Database['public']['Tables']['payments']['Row'];

interface DetalhesTransacaoDialogProps {
  transacao: Payment;
  children: React.ReactNode;
}

const formatCurrency = (value: number | null) => {
    if (value === null) return 'Não informado';
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

const statusConfig: { [key: string]: { text: string; icon: React.ElementType, className: string } } = {
  pago: { text: 'Pago', icon: CheckCircle2, className: 'bg-green-100 text-green-800 border-green-200' },
  pendente: { text: 'Pendente', icon: Clock, className: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  vencido: { text: 'Vencido', icon: AlertCircle, className: 'bg-red-100 text-red-800 border-red-200' },
};

const DetailItem = ({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: React.ReactNode }) => (
  <div>
    <p className="text-xs text-muted-foreground flex items-center gap-1.5"><Icon className="h-3 w-3" /> {label}</p>
    <p className="text-sm font-medium">{value || 'Não informado'}</p>
  </div>
);

export function DetalhesTransacaoDialog({ transacao, children }: DetalhesTransacaoDialogProps) {
  const [open, setOpen] = React.useState(false);
  const statusInfo = statusConfig[transacao.status] || statusConfig.pendente;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl">Detalhes da Transação</DialogTitle>
          <DialogDescription>
            Informações completas sobre o registro financeiro.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto pr-2">
            <div className="p-4 rounded-lg bg-secondary/50 flex justify-between items-center">
                <div>
                    <p className="text-muted-foreground text-sm">Valor</p>
                    <p className="text-3xl font-bold">{formatCurrency(transacao.amount)}</p>
                </div>
                <Badge variant="outline" className={statusInfo.className}>
                    <statusInfo.icon className="mr-1.5 h-4 w-4" />
                    {statusInfo.text}
                </Badge>
            </div>
             <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                    <DetailItem icon={FileText} label="Descrição" value={transacao.description} />
                    <DetailItem icon={CreditCard} label="Método" value={transacao.payment_method} />
                    <DetailItem icon={Calendar} label="Data de Vencimento" value={format(new Date(transacao.due_date), 'dd/MM/yyyy')} />
                    {transacao.paid_at && <DetailItem icon={CheckCircle2} label="Data de Pagamento" value={format(new Date(transacao.paid_at), 'dd/MM/yyyy')} />}
                     <DetailItem icon={Hash} label="ID da Transação" value={<span className="text-xs font-mono">{transacao.id}</span>} />
                </div>
            </div>
        </div>

        <DialogFooter className="sm:justify-between">
            <DialogClose asChild>
                <Button type="button" variant="outline">
                    Fechar
                </Button>
            </DialogClose>
            <EditTransacaoDialog transacao={transacao}>
                <Button onClick={(e) => { e.stopPropagation(); setOpen(false); }}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Editar Transação
                </Button>
            </EditTransacaoDialog>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
