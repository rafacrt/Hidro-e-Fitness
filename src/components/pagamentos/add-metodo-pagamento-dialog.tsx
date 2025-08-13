
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
import { Switch } from '@/components/ui/switch';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { IMaskInput } from 'react-imask';
import { cn } from '@/lib/utils';

const addMethodSchema = z.object({
  name: z.string().min(3, 'O nome do método é obrigatório.'),
  type: z.enum(['pix', 'card', 'cash', 'transfer'], { required_error: 'Selecione um tipo.' }),
  fee_percentage: z.string().optional(),
  enabled: z.boolean().default(true),
});

type AddMethodFormValues = z.infer<typeof addMethodSchema>;

export function AddMetodoPagamentoDialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const { toast } = useToast();
  const form = useForm<AddMethodFormValues>({
    resolver: zodResolver(addMethodSchema),
    defaultValues: {
      enabled: true,
    },
  });

  const onSubmit = async (data: AddMethodFormValues) => {
    // Simulating API call
    form.formState.isSubmitting = true;
    await new Promise(resolve => setTimeout(resolve, 1000));

    toast({
      title: 'Funcionalidade em desenvolvimento',
      description: 'A criação de novos métodos de pagamento será implementada em breve.',
    });
    
    setOpen(false);
    form.reset();
    form.formState.isSubmitting = false;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Adicionar Método de Pagamento</DialogTitle>
          <DialogDescription>
            Configure um novo método de pagamento para a sua academia.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Método</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Cartão de Crédito (Online)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="pix">PIX</SelectItem>
                        <SelectItem value="card">Cartão</SelectItem>
                        <SelectItem value="cash">Dinheiro</SelectItem>
                        <SelectItem value="transfer">Transferência</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="fee_percentage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Taxa (%)</FormLabel>
                    <FormControl>
                       <IMaskInput
                          mask="num %"
                          blocks={{
                            num: { mask: Number, radix: ",", scale: 2, padFractionalZeros: false }
                          }}
                          value={field.value || ''}
                          onAccept={(value) => field.onChange(value)}
                          className={cn('flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm')}
                          placeholder="0,00 %"
                        />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="enabled"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <FormLabel className="mb-0">Ativo</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
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
                Adicionar Método
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
