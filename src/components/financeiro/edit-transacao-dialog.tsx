
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
import { format, parse } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { updateTransaction } from '@/app/financeiro/actions';
import { IMaskInput } from 'react-imask';
import type { Database } from '@/lib/database.types';

type Payment = Database['public']['Tables']['payments']['Row'];

interface EditTransacaoDialogProps {
    transacao: Payment;
    children: React.ReactNode;
    onSuccess: () => void;
}

const transactionFormSchema = z.object({
  type: z.enum(['receita', 'despesa'], { required_error: 'Selecione o tipo.' }),
  description: z.string().min(3, 'A descrição deve ter pelo menos 3 caracteres.'),
  amount: z.string().min(1, 'O valor é obrigatório.'),
  due_date: z.date({ required_error: 'A data é obrigatória.' }),
  category: z.string().min(1, 'Selecione uma categoria.'),
  payment_method: z.string().optional(),
  status: z.enum(['pago', 'pendente', 'vencido']).default('pago'),
});

type TransactionFormValues = z.infer<typeof transactionFormSchema>;

const categories = {
  receita: ['Mensalidades', 'Matrículas', 'Vendas de Produtos', 'Outras Receitas'],
  despesa: ['Salários', 'Aluguel', 'Manutenção', 'Produtos de Limpeza', 'Marketing', 'Contas (Água, Luz, etc.)', 'Outras Despesas'],
};
const paymentMethods = ['PIX', 'Cartão de Crédito', 'Cartão de Débito', 'Dinheiro', 'Boleto', 'Transferência'];

const extractCategoryAndDescription = (fullDescription: string) => {
    const parts = fullDescription.split(' - ');
    if (parts.length > 1) {
        const category = parts[0];
        const description = parts.slice(1).join(' - ');
        const allCategories = [...categories.receita, ...categories.despesa];
        if (allCategories.includes(category)) {
            return { category, description };
        }
    }
    return { category: '', description: fullDescription };
}

const formatCurrencyForInput = (value: number | null) => {
    if (value === null || typeof value === 'undefined') return '';
    const absValue = Math.abs(value);
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(absValue).replace('R$', 'R$ ');
}

// Helper to parse date string from Supabase (which is UTC) as if it were local time
const parseUTCDateAsLocal = (dateString: string) => {
    const date = new Date(dateString);
    return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
};


export function EditTransacaoDialog({ children, transacao, onSuccess }: EditTransacaoDialogProps) {
  const [open, setOpen] = React.useState(false);
  const { toast } = useToast();
  
  const { category, description } = extractCategoryAndDescription(transacao.description);

  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: {
        type: (transacao.amount || 0) > 0 ? 'receita' : 'despesa',
        description: description,
        category: category,
        amount: formatCurrencyForInput(transacao.amount),
        due_date: parseUTCDateAsLocal(transacao.due_date),
        payment_method: transacao.payment_method || '',
        status: transacao.status as 'pago' | 'pendente' | 'vencido',
    }
  });

  const transactionType = form.watch('type');

  const onSubmit = async (data: TransactionFormValues) => {
    const result = await updateTransaction(transacao.id, data);

    if (result.success) {
      toast({
        title: 'Sucesso!',
        description: result.message,
      });
      onSuccess();
      setOpen(false);
    } else {
       toast({
        title: 'Erro!',
        description: result.message,
        variant: 'destructive',
      });
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen) {
      const { category, description } = extractCategoryAndDescription(transacao.description);
      form.reset({
        type: (transacao.amount || 0) > 0 ? 'receita' : 'despesa',
        description: description,
        category: category,
        amount: formatCurrencyForInput(transacao.amount),
        due_date: parseUTCDateAsLocal(transacao.due_date),
        payment_method: transacao.payment_method || '',
        status: transacao.status as 'pago' | 'pendente' | 'vencido',
      });
    }
  };


  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Transação</DialogTitle>
          <DialogDescription>
            Ajuste os dados da transação e salve as alterações.
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
                        <IMaskInput
                            mask="R$ num"
                            blocks={{
                                num: { mask: Number, radix: ",", thousandsSeparator: ".", scale: 2, padFractionalZeros: true, normalizeZeros: true, mapToRadix: ['.'] }
                            }}
                            value={String(field.value) || ''}
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
                name="due_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Data</FormLabel>
                    <Popover>
                        <PopoverTrigger asChild>
                        <FormControl>
                            <Button
                            variant={'outline'}
                            className={cn(
                                'w-full pl-3 text-left font-normal',
                                !field.value && 'text-muted-foreground'
                            )}
                            >
                            {field.value ? (
                                format(field.value, 'PPP', { locale: ptBR })
                            ) : (
                                <span>Escolha uma data</span>
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
                            initialFocus
                        />
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
                name="payment_method"
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
             <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="pago">Pago</SelectItem>
                        <SelectItem value="pendente">Pendente</SelectItem>
                        <SelectItem value="vencido">Vencido</SelectItem>
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
                    Salvar Alterações
                </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

    