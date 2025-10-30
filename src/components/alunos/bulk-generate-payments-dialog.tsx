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
import { Loader2, CalendarIcon, CreditCard } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generatePaymentOrders } from '@/app/pagamentos/payment-generator';
import { getRecurrenceLabel, getMaxRecommendedInstallments } from '@/lib/payment-utils';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface BulkGeneratePaymentsDialogProps {
  selectedStudents: Array<{
    id: string;
    name: string;
    plans: Array<{
      id: string;
      name: string;
      price: number;
      recurrence: string;
    }>;
  }>;
  onSuccess?: () => void;
  children: React.ReactNode;
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

export function BulkGeneratePaymentsDialog({
  selectedStudents,
  onSuccess,
  children,
}: BulkGeneratePaymentsDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const { toast } = useToast();

  // Calcular totais
  const totalStudents = selectedStudents.length;
  const totalPlans = selectedStudents.reduce((sum, s) => sum + s.plans.length, 0);

  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      numberOfInstallments: 6,
      startDate: new Date(),
    },
  });

  const onSubmit = async (data: PaymentFormValues) => {
    setLoading(true);
    let successCount = 0;
    let errorCount = 0;
    const errors: string[] = [];

    try {
      // Gerar pagamentos para cada aluno e cada plano
      for (const student of selectedStudents) {
        for (const plan of student.plans) {
          try {
            const result = await generatePaymentOrders({
              studentId: student.id,
              planId: plan.id,
              planName: plan.name,
              price: plan.price,
              recurrence: plan.recurrence,
              numberOfInstallments: data.numberOfInstallments,
              startDate: data.startDate,
            });

            if (result.success) {
              successCount++;
            } else {
              errorCount++;
              errors.push(`${student.name} - ${plan.name}: ${result.message}`);
            }
          } catch (error: any) {
            errorCount++;
            errors.push(`${student.name} - ${plan.name}: ${error.message}`);
          }
        }
      }

      // Mostrar resultado
      if (successCount > 0 && errorCount === 0) {
        toast({
          title: 'Sucesso!',
          description: `Pagamentos gerados para ${successCount} plano(s) de ${totalStudents} aluno(s)`,
        });
        setOpen(false);
        form.reset();
        onSuccess?.();
      } else if (successCount > 0 && errorCount > 0) {
        toast({
          title: 'Parcialmente concluído',
          description: `${successCount} sucesso(s), ${errorCount} erro(s). Verifique os detalhes.`,
          variant: 'default',
        });
      } else {
        toast({
          title: 'Erro',
          description: `Falha ao gerar pagamentos. ${errors[0] || 'Erro desconhecido'}`,
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
          <DialogTitle>Gerar Pagamentos em Lote</DialogTitle>
          <DialogDescription>
            Gere ordens de pagamento para múltiplos alunos de uma vez
          </DialogDescription>
        </DialogHeader>

        <div className="bg-muted p-4 rounded-lg space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Alunos selecionados:</span>
            <span className="font-semibold">{totalStudents}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Total de planos:</span>
            <span className="font-semibold">{totalPlans}</span>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                    Será gerado este número de parcelas para cada plano
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
                  <>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Gerar Pagamentos
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
