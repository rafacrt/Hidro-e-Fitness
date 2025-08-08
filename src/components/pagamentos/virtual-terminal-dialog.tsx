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
  DialogClose,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, CreditCard } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { IMaskInput } from 'react-imask';
import { cn } from '@/lib/utils';

// Schema de validação para o formulário do terminal virtual
const terminalSchema = z.object({
  amount: z.string().min(1, 'O valor é obrigatório.'),
  description: z.string().min(3, 'A descrição é obrigatória.'),
  cardName: z.string().min(3, 'O nome no cartão é obrigatório.'),
  cardNumber: z.string().refine((val) => val.replace(/\s/g, '').length >= 13 && val.replace(/\s/g, '').length <= 19, {
    message: 'Número de cartão inválido.',
  }),
  cardExpiry: z.string().regex(/^(0[1-9]|1[0-2])\s?\/\s?([0-9]{2})$/, 'Data de validade inválida (MM/AA).'),
  cardCvv: z.string().min(3, 'CVV inválido.').max(4, 'CVV inválido.'),
});

type TerminalFormValues = z.infer<typeof terminalSchema>;

export function VirtualTerminalDialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const { toast } = useToast();
  const form = useForm<TerminalFormValues>({
    resolver: zodResolver(terminalSchema),
    defaultValues: {
      amount: '',
      description: '',
      cardName: '',
      cardNumber: '',
      cardExpiry: '',
      cardCvv: '',
    },
  });

  const onSubmit = (data: TerminalFormValues) => {
    // Simula o processamento do pagamento
    form.formState.isSubmitting = true;
    setTimeout(() => {
        toast({
            title: "Pagamento Processado!",
            description: `A cobrança de ${data.amount} foi realizada com sucesso.`,
        })
        setOpen(false);
        form.reset();
        form.formState.isSubmitting = false;
    }, 1500);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Terminal Virtual</DialogTitle>
          <DialogDescription>
            Processe pagamentos com cartão de crédito manualmente.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor da Cobrança</FormLabel>
                  <FormControl>
                    <IMaskInput
                      mask="R$ num"
                      blocks={{
                        num: { mask: Number, radix: ",", thousandsSeparator: ".", scale: 2, padFractionalZeros: true, normalizeZeros: true, mapToRadix: ['.'] }
                      }}
                      value={field.value}
                      onAccept={(value) => field.onChange(value)}
                      className={cn('flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm')}
                      placeholder="R$ 0,00"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Mensalidade, Produtos" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="pt-4 border-t">
              <h4 className="text-sm font-medium mb-4">Dados do Cartão</h4>
              <div className="space-y-4">
                 <FormField
                  control={form.control}
                  name="cardName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome no Cartão</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: JOAO D SILVA" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="cardNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número do Cartão</FormLabel>
                      <FormControl>
                         <div className="relative">
                            <IMaskInput
                                mask="0000 0000 0000 0000"
                                value={field.value}
                                onAccept={(value) => field.onChange(value)}
                                className={cn('flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-10 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm')}
                                placeholder="0000 0000 0000 0000"
                            />
                            <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                    control={form.control}
                    name="cardExpiry"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Validade</FormLabel>
                        <FormControl>
                            <IMaskInput
                                mask="00 / 00"
                                value={field.value}
                                onAccept={(value) => field.onChange(value)}
                                className={cn('flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm')}
                                placeholder="MM/AA"
                            />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="cardCvv"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>CVV</FormLabel>
                        <FormControl>
                            <IMaskInput
                                mask="000[0]"
                                value={field.value}
                                onAccept={(value) => field.onChange(value)}
                                className={cn('flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm')}
                                placeholder="123"
                            />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </div>
              </div>
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancelar
                </Button>
              </DialogClose>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {form.formState.isSubmitting ? 'Processando...' : 'Processar Pagamento'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
