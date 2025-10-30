'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, CalendarIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generatePaymentOrders } from '@/app/pagamentos/payment-generator';
import { getRecurrenceLabel, getMaxRecommendedInstallments } from '@/lib/payment-utils';
import type { Database } from '@/lib/database.types';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

type Plan = Database['public']['Tables']['plans']['Row'];

interface GeneratePaymentsDialogProps {
  studentId: string;
  plan: Plan;
  children: React.ReactNode;
  onSuccess?: () => void;
}

const paymentFormSchema = z.object({
  numberOfInstallments: z.coerce
    .number()
    .min(1, 'Informe pelo menos 1 parcela')
    .max(24, 'Máximo de 24 parcelas'),
  startDate: z.date({
    required_error: 'Selecione a data de início',
  }),
});

type PaymentFormValues = z.infer<typeof paymentFormSchema>;

export function GeneratePaymentsDialog({
  studentId,
  plan,
  children,
  onSuccess,
}: GeneratePaymentsDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const { toast } = useToast();

  const maxRecommended = getMaxRecommendedInstallments(plan.recurrence);
  const recurrenceLabel = getRecurrenceLabel(plan.recurrence);

  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      numberOfInstallments: maxRecommended,
      startDate: new Date(),
    },
  });

  const onSubmit = async (data: PaymentFormValues) => {
    setLoading(true);
    try {
      const result = await generatePaymentOrders({
        studentId,
        planId: plan.id,
        planName: plan.name,
        price: plan.price,
        recurrence: plan.recurrence,
        numberOfInstallments: data.numberOfInstallments,
        startDate: data.startDate,
      });

      if (result.success) {
        toast({
          title: 'Sucesso!',
          description: result.message,
        });
        setOpen(false);
        form.reset();
        onSuccess?.();
      } else {
        toast({
          title: 'Erro ao gerar pagamentos',
          description: result.message,
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      toast({
        title: 'Erro ao gerar pagamentos',
        description: error.message || 'Ocorreu um erro inesperado',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Gerar Ordens de Pagamento</DialogTitle>
          <DialogDescription>
            Gere automaticamente as ordens de pagamento para o plano <strong>{plan.name}</strong>
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="bg-muted p-4 rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Plano:</span>
                <span className="font-semibold">{plan.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Valor:</span>
                <span className="font-semibold">
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  }).format(plan.price)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Recorrência:</span>
                <span className="font-semibold capitalize">{recurrenceLabel}</span>
              </div>
            </div>

            <FormField
              control={form.control}
              name="numberOfInstallments"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número de Parcelas</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      max={24}
                      placeholder="6"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Recomendado: {maxRecommended} {recurrenceLabel.toLowerCase()}(s)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Data de Início</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            'w-full pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value ? (
                            format(field.value, 'PPP', { locale: ptBR })
                          ) : (
                            <span>Selecione uma data</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date < new Date(new Date().setHours(0, 0, 0, 0))
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    Data de vencimento da primeira parcela
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Gerando...
                  </>
                ) : (
                  'Gerar Pagamentos'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
