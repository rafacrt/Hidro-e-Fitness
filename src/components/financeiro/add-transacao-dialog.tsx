
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Textarea } from '../ui/textarea';

const transactionFormSchema = z.object({
  type: z.enum(['receita', 'despesa'], { required_error: 'Selecione o tipo.' }),
  description: z.string().min(3, 'A descrição deve ter pelo menos 3 caracteres.'),
  amount: z.string().min(1, 'O valor é obrigatório.'),
  date: z.date({ required_error: 'A data é obrigatória.' }),
  category: z.string().min(1, 'Selecione uma categoria.'),
  paymentMethod: z.string().optional(),
});

type TransactionFormValues = z.infer<typeof transactionFormSchema>;

const categories = {
  receita: ['Mensalidades', 'Matrículas', 'Vendas de Produtos', 'Outras Receitas'],
  despesa: ['Salários', 'Aluguel', 'Manutenção', 'Produtos de Limpeza', 'Marketing', 'Contas (Água, Luz, etc.)', 'Outras Despesas'],
};
const paymentMethods = ['PIX', 'Cartão de Crédito', 'Cartão de Débito', 'Dinheiro', 'Boleto', 'Transferência'];

export function AddTransacaoDialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const { toast } = useToast();
  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionFormSchema),
  });

  const transactionType = form.watch('type');

  const onSubmit = (data: TransactionFormValues) => {
    console.log(data);
    toast({
        title: "Transação Registrada!",
        description: `Sua ${data.type} de ${data.amount} foi registrada com sucesso.`,
    })
    setOpen(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Registrar Nova Transação</DialogTitle>
          <DialogDescription>
            Preencha os dados para adicionar uma nova receita ou despesa.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Transação</FormLabel>
                   <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione..." />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                           <SelectItem value="receita">Receita</SelectItem>
                           <SelectItem value="despesa">Despesa</SelectItem>
                        </SelectContent>
                    </Select>
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
                    <Input placeholder="Ex: Mensalidade de Janeiro" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="R$ 0,00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col pt-2">
                    <FormLabel>Data</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn('pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}
                          >
                            {field.value ? format(field.value, 'PPP', { locale: ptBR }) : <span>Escolha uma data</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoria</FormLabel>
                   <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!transactionType}>
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder={!transactionType ? "Selecione o tipo primeiro" : "Selecione..."} />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {transactionType && categories[transactionType].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                        </SelectContent>
                    </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
                control={form.control}
                name="paymentMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Método de Pagamento</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {paymentMethods.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="outline">
                    Cancelar
                    </Button>
                </DialogClose>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Registrar
                </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
