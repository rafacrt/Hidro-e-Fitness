
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
import { useToast } from '@/hooks/use-toast';
import { Copy, Loader2 } from 'lucide-react';
import type { Database } from '@/lib/database.types';
import { addPlan } from '@/app/modalidades/actions';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

type Plan = Database['public']['Tables']['plans']['Row'];

interface DuplicatePlanDialogProps {
  children: React.ReactNode;
  plan: Plan;
  onSuccess: () => void;
}

const formatCurrencyForInput = (value: number | null) => {
    if (value === null || typeof value === 'undefined') return '';
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(value).replace('R$', 'R$ ');
}

export function DuplicatePlanDialog({ children, plan, onSuccess }: DuplicatePlanDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [newPlanName, setNewPlanName] = React.useState(`${plan.name} (Cópia)`);
  const [isDuplicating, setIsDuplicating] = React.useState(false);
  const { toast } = useToast();

  const handleDuplicate = async () => {
    setIsDuplicating(true);
    const result = await addPlan({
        name: newPlanName,
        modality_id: String(plan.modality_id),
        price: formatCurrencyForInput(plan.price),
        recurrence: plan.recurrence,
        benefits: plan.benefits?.join(', '),
        status: plan.status,
    });
    
    if (result.success) {
      toast({
        title: 'Sucesso!',
        description: 'Plano duplicado com sucesso.',
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
    setIsDuplicating(false);
  };
  
  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen) {
      setNewPlanName(`${plan.name} (Cópia)`);
    }
  };


  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Duplicar Plano</DialogTitle>
          <DialogDescription>
            Crie uma cópia do plano "{plan.name}". Você pode renomear o novo plano abaixo.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2 py-4">
            <Label htmlFor="new-plan-name">Nome do Novo Plano</Label>
            <Input 
                id="new-plan-name"
                value={newPlanName}
                onChange={(e) => setNewPlanName(e.target.value)}
            />
        </div>
        <DialogFooter>
           <DialogClose asChild>
                <Button type="button" variant="outline">
                Cancelar
                </Button>
            </DialogClose>
            <Button onClick={handleDuplicate} disabled={isDuplicating}>
                {isDuplicating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Copy className="mr-2 h-4 w-4" />}
                {isDuplicating ? 'Duplicando...' : 'Duplicar Plano'}
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
