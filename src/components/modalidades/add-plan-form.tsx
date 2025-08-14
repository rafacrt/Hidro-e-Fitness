
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
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getModalities, addPlan } from '@/app/modalidades/actions';
import { IMaskInput } from 'react-imask';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import type { Database } from '@/lib/database.types';

type Modality = Database['public']['Tables']['modalities']['Row'];

interface AddPlanFormProps {
  children: React.ReactNode;
  onSuccess?: () => void;
}

const planFormSchema = z.object({
  name: z.string().min(3, 'O nome do plano deve ter pelo menos 3 caracteres.'),
  modality_id: z.string({ required_error: 'Selecione uma modalidade.' }).min(1, 'Selecione uma modalidade.'),
  price: z.string().min(1, 'O preço é obrigatório.'),
  recurrence: z.enum(['mensal', 'trimestral', 'semestral', 'anual']),
  benefits: z.string().optional(),
  status: z.enum(['ativo', 'inativo']).default('ativo'),
});

type PlanFormValues = z.infer<typeof planFormSchema>;

export function AddPlanForm({ children, onSuccess }: AddPlanFormProps) {
  const [open, setOpen] = React.useState(false);
  const [modalities, setModalities] = React.useState<Modality[]>([]);
  const { toast } = useToast();

  React.useEffect(() => {
    if (open) {
        getModalities().then(setModalities);
    }
  }, [open]);

  const form = useForm<PlanFormValues>({
    resolver: zodResolver(planFormSchema),
    defaultValues: {
      name: '',
      recurrence: 'mensal',
      status: 'ativo',
    },
  });

  const onSubmit = async (data: PlanFormValues) => {
    const result = await addPlan(data);
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
        title: 'Erro ao cadastrar plano!',
        description: result.message,
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Criar Novo Plano</DialogTitle>
          <DialogDescription>
            Preencha os dados para adicionar um novo plano de preços.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Plano</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Natação Adulto - Mensal" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
                <FormField
                control={form.control}
                name="modality_id"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Modalidade</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Selecione..." />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        {modalities.map((m) => (
                            <SelectItem key={m.id} value={m.id}>
                            {m.name}
                            </SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
                />
                 <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preço</FormLabel>
                    <FormControl>
                       <IMaskInput
                          mask="R$ num"
                          blocks={{
                            num: { mask: Number, radix: ",", thousandsSeparator: ".", scale: 2, padFractionalZeros: true, normalizeZeros: true, mapToRadix: ['.'] }
                          }}
                          value={field.value || ''}
                          onAccept={(value) => field.onChange(value)}
                          className={cn('flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm')}
                          placeholder="R$ 0,00"
                        />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
             <FormField
                control={form.control}
                name="recurrence"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Recorrência</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Selecione..." />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                           <SelectItem value="mensal">Mensal</SelectItem>
                           <SelectItem value="trimestral">Trimestral</SelectItem>
                           <SelectItem value="semestral">Semestral</SelectItem>
                           <SelectItem value="anual">Anual</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
                />
            <FormField
              control={form.control}
              name="benefits"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Benefícios (Opcional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Liste os benefícios separados por vírgula. Ex: Aulas ilimitadas, Acesso à piscina..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancelar</Button>
              </DialogClose>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {form.formState.isSubmitting ? 'Salvando...' : 'Salvar Plano'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
