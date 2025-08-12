
'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Copy } from 'lucide-react';

// Mock data, replace with real data fetching
const plans = [
    { id: '1', name: 'Natação Adulto - Mensal' },
    { id: '2', name: 'Natação Adulto - Trimestral' },
    { id: '3', name: 'Hidroginástica - Mensal' },
];

export function DuplicatePlanDialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const [selectedPlan, setSelectedPlan] = React.useState('');
  const { toast } = useToast();

  const handleDuplicate = () => {
    if (!selectedPlan) {
      toast({
        title: 'Selecione um plano',
        description: 'Você precisa escolher um plano para duplicar.',
        variant: 'destructive',
      });
      return;
    }
    toast({
      title: 'Funcionalidade em desenvolvimento',
      description: 'A duplicação de planos será implementada em breve.',
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Duplicar Plano</DialogTitle>
          <DialogDescription>
            Selecione um plano existente para usar como modelo para um novo plano.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
            <Select onValueChange={setSelectedPlan}>
                <SelectTrigger>
                    <SelectValue placeholder="Selecione um plano para duplicar..." />
                </SelectTrigger>
                <SelectContent>
                    {plans.map(plan => (
                        <SelectItem key={plan.id} value={plan.id}>{plan.name}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
        <div className="flex justify-end gap-2">
           <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleDuplicate}>
                <Copy className="mr-2 h-4 w-4" />
                Duplicar Plano
            </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
