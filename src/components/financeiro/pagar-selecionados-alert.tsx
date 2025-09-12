
'use client';

import * as React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { paySelectedPayments } from '@/app/financeiro/actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { Button, ButtonProps } from '../ui/button';

interface PagarSelecionadosAlertProps {
  paymentIds: string[];
  children: React.ReactElement<ButtonProps>;
  onSuccess: () => void;
  disabled?: boolean;
}

export function PagarSelecionadosAlert({ paymentIds, children, onSuccess, disabled }: PagarSelecionadosAlertProps) {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  const handlePay = async () => {
    setIsProcessing(true);
    const result = await paySelectedPayments(paymentIds);
    if (result.success) {
      toast({
        title: 'Sucesso!',
        description: result.message,
      });
      onSuccess();
    } else {
      toast({
        title: 'Erro!',
        description: result.message,
        variant: 'destructive',
      });
    }
    setIsProcessing(false);
    setOpen(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild disabled={disabled}>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmar Pagamento?</AlertDialogTitle>
          <AlertDialogDescription>
            Você está prestes a marcar {paymentIds.length} despesa(s) como "Paga(s)". Esta ação registrará a data de hoje como a data de pagamento.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handlePay} disabled={isProcessing}>
            {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isProcessing ? 'Processando...' : 'Sim, Pagar'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

    