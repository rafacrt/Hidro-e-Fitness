
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
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar, Loader2, PlusCircle, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateMonthlyPayments } from '@/app/financeiro/actions';
import { addMonths, format, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

export function GerarMensalidadesDialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [selectedMonth, setSelectedMonth] = React.useState(format(new Date(), 'yyyy-MM'));

  const handleGenerate = async () => {
    setIsGenerating(true);
    const [year, month] = selectedMonth.split('-');
    const dateToGenerate = new Date(parseInt(year), parseInt(month) - 1, 1);
    
    const result = await generateMonthlyPayments(dateToGenerate);

    if (result.success) {
      toast({
        title: 'Sucesso!',
        description: result.message,
      });
      setOpen(false);
    } else {
      toast({
        title: 'Erro!',
        description: result.message,
        variant: 'destructive',
      });
    }
    setIsGenerating(false);
  };
  
  const monthOptions = Array.from({ length: 3 }, (_, i) => {
    const date = addMonths(new Date(), i - 1); // Mês anterior, atual, próximo
    return {
      value: format(date, 'yyyy-MM'),
      label: format(date, 'MMMM / yyyy', { locale: ptBR }),
    };
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Gerar Mensalidades em Lote</DialogTitle>
          <DialogDescription>
            Esta ação irá criar cobranças de mensalidade para todos os alunos ativos que ainda não foram cobrados no mês selecionado.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
            <div className="flex flex-col items-center justify-center text-center p-6 bg-secondary rounded-md">
                <Users className="h-10 w-10 text-secondary-foreground mb-3" />
                <p className="text-sm text-muted-foreground">
                    O sistema irá verificar todos os alunos com status "Ativo" e gerar uma nova cobrança de mensalidade com base no plano associado.
                </p>
            </div>

            <div className='space-y-2'>
                <label htmlFor="month-select" className="text-sm font-medium">Mês de Referência</label>
                 <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                    <SelectTrigger id="month-select">
                        <SelectValue placeholder="Selecione o mês..." />
                    </SelectTrigger>
                    <SelectContent>
                        {monthOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                               <span className='capitalize'>{option.label}</span>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancelar
            </Button>
          </DialogClose>
          <Button onClick={handleGenerate} disabled={isGenerating}>
            {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PlusCircle className="mr-2 h-4 w-4" />}
            {isGenerating ? 'Gerando...' : 'Gerar Mensalidades'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
