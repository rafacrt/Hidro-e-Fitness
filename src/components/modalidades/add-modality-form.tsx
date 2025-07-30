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
import { addModality } from '@/app/modalidades/actions';
import { IMaskInput } from 'react-imask';
import { cn } from '@/lib/utils';

const modalityFormSchema = z.object({
  name: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres.'),
  description: z.string().optional(),
  price: z.string().min(1, 'O preço é obrigatório.'),
});

type ModalityFormValues = z.infer<typeof modalityFormSchema>;

export function AddModalityForm({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const { toast } = useToast();

  const form = useForm<ModalityFormValues>({
    resolver: zodResolver(modalityFormSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 'R$ 0,00',
    },
  });

  const onSubmit = async (data: ModalityFormValues) => {
    // Convert price string "R$ 180,00" to number 180.00
    const priceAsNumber = Number(data.price.replace('R$ ', '').replace(/\./g, '').replace(',', '.'));
    
    const result = await addModality({ ...data, price: priceAsNumber });

    if (result.success) {
      toast({
        title: 'Sucesso!',
        description: result.message,
      });
      setOpen(false);
      form.reset();
    } else {
      toast({
        title: 'Erro ao cadastrar modalidade!',
        description: result.message,
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nova Modalidade</DialogTitle>
          <DialogDescription>
            Adicione uma nova modalidade ou atividade oferecida na academia.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome da Modalidade</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Natação Adulto" {...field} />
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
                  <FormLabel>Descrição (Opcional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descreva brevemente a modalidade..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preço Mensal (R$)</FormLabel>
                  <FormControl>
                     <IMaskInput
                      mask="R$ num"
                      blocks={{
                        num: {
                          mask: Number,
                          radix: ",",
                          thousandsSeparator: ".",
                          scale: 2,
                          padFractionalZeros: true,
                          normalizeZeros: true,
                          mapToRadix: ['.'],
                        }
                      }}
                      value={field.value}
                      onAccept={(value) => field.onChange(value)}
                      className={cn(
                        'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm'
                      )}
                      placeholder="R$ 0,00"
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
                {form.formState.isSubmitting ? 'Salvando...' : 'Salvar Modalidade'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
