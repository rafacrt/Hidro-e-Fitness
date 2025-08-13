
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
} from '@/components/ui/dialog';
import { Button, ButtonProps } from '@/components/ui/button';
import { Calendar as CalendarIcon, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { scheduleSelectedPayments } from '@/app/financeiro/actions';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar } from '../ui/calendar';

interface AgendarPagamentosDialogProps {
  paymentIds: string[];
  children: React.ReactElement<ButtonProps>;
  onSuccess: () => void;
  disabled?: boolean;
}

export function AgendarPagamentosDialog({ paymentIds, children, onSuccess, disabled }: AgendarPagamentosDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [newDueDate, setNewDueDate] = React.useState<Date | undefined>(undefined);
  const [isScheduling, setIsScheduling] = React.useState(false);
  const { toast } = useToast();

  const handleSchedule = async () => {
    if (!newDueDate) {
      toast({ title: 'Selecione uma data', variant: 'destructive' });
      return;
    }
    setIsScheduling(true);
    const result = await scheduleSelectedPayments(paymentIds, newDueDate);
    if (result.success) {
      toast({
        title: 'Sucesso!',
        description: result.message,
      });
      onSuccess();
      setOpen(false);
      setNewDueDate(undefined);
    } else {
      toast({
        title: 'Erro!',
        description: result.message,
        variant: 'destructive',
      });
    }
    setIsScheduling(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild disabled={disabled}>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Agendar Pagamentos</DialogTitle>
          <DialogDescription>
            Selecione uma nova data de vencimento para as {paymentIds.length} despesa(s) selecionada(s).
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant={'outline'}
                        className={cn('w-full justify-start text-left font-normal', !newDueDate && 'text-muted-foreground')}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {newDueDate ? format(newDueDate, 'PPP', { locale: ptBR }) : <span>Escolha uma nova data</span>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                    <Calendar
                        mode="single"
                        selected={newDueDate}
                        onSelect={setNewDueDate}
                        initialFocus
                    />
                </PopoverContent>
            </Popover>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
          <Button onClick={handleSchedule} disabled={isScheduling || !newDueDate}>
            {isScheduling && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isScheduling ? 'Agendando...' : 'Salvar Nova Data'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
