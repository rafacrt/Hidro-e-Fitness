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
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2, PlusCircle, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getPlans } from '@/app/modalidades/actions';
import type { Database } from '@/lib/database.types';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
import { Badge } from '../ui/badge';

type Plan = Database['public']['Tables']['plans']['Row'] & { modalities: { name: string } | null };

interface ManageStudentPlansDialogProps {
  children: React.ReactNode;
  studentId: string;
  onSucceess: () => void;
}

const formatCurrency = (value: number | null) => {
    if (value === null) return 'N/A';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
};

export function ManageStudentPlansDialog({ children, studentId, onSucceess }: ManageStudentPlansDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [allPlans, setAllPlans] = React.useState<Plan[]>([]);
  const [studentPlanIds, setStudentPlanIds] = React.useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = React.useState(true);
  const { toast } = useToast();

  const loadData = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const [allPlansData] = await Promise.all([
        getPlans(),
        // getStudentPlans(studentId), // This function does not exist anymore
      ]);
      setAllPlans(allPlansData as Plan[]);
      // setStudentPlanIds(new Set(studentPlansData.map(p => p.id)));
    } catch (error) {
      toast({ title: 'Erro ao carregar planos', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  }, [studentId, toast]);

  React.useEffect(() => {
    if (open) {
      loadData();
    }
  }, [open, loadData]);
  
  const handleTogglePlan = (planId: string) => {
    setStudentPlanIds(prev => {
        const newSet = new Set(prev);
        if (newSet.has(planId)) {
            newSet.delete(planId);
        } else {
            newSet.add(planId);
        }
        return newSet;
    })
  }
  
  const handleSave = async () => {
    setIsLoading(true);
    // const result = await updateStudentPlans(studentId, Array.from(studentPlanIds));
    // if (result.success) {
    //   toast({ title: 'Sucesso!', description: result.message });
    //   onSucceess();
    //   setOpen(false);
    // } else {
    //   toast({ title: 'Erro!', description: result.message, variant: 'destructive' });
    // }
    setIsLoading(false);
  };
  
  const availablePlans = allPlans.filter(p => !studentPlanIds.has(p.id));
  const studentPlans = allPlans.filter(p => studentPlanIds.has(p.id));

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Gerenciar Planos do Aluno</DialogTitle>
          <DialogDescription>
            Adicione ou remova planos para este aluno.
          </DialogDescription>
        </DialogHeader>
        
        {isLoading ? (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        ) : (
            <div className="grid grid-cols-2 gap-6 items-start py-4">
                {/* Available Plans */}
                <div className="border rounded-lg h-96 flex flex-col">
                    <h3 className="p-3 font-semibold border-b">Planos Disponíveis</h3>
                    <ScrollArea>
                        <div className="p-2 space-y-1">
                            {availablePlans.map(plan => (
                                <div key={plan.id} className="p-2 flex items-center justify-between hover:bg-accent rounded-md">
                                    <div>
                                        <p className="font-medium text-sm">{plan.name}</p>
                                        <p className="text-xs text-muted-foreground">{formatCurrency(plan.price)}</p>
                                    </div>
                                    <Button size="icon" variant="ghost" onClick={() => handleTogglePlan(plan.id)}>
                                        <PlusCircle className="h-4 w-4 text-green-500" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </div>
                {/* Student's Plans */}
                <div className="border rounded-lg h-96 flex flex-col">
                    <h3 className="p-3 font-semibold border-b">Planos do Aluno</h3>
                    <ScrollArea>
                        <div className="p-2 space-y-1">
                            {studentPlans.map(plan => (
                                <div key={plan.id} className="p-2 flex items-center justify-between bg-secondary/50 rounded-md">
                                    <div>
                                        <p className="font-medium text-sm">{plan.name}</p>
                                        <p className="text-xs text-muted-foreground">{formatCurrency(plan.price)}</p>
                                    </div>
                                    <Button size="icon" variant="ghost" onClick={() => handleTogglePlan(plan.id)}>
                                        <Trash2 className="h-4 w-4 text-red-500" />
                                    </Button>
                                </div>
                            ))}
                             {studentPlans.length === 0 && (
                                <p className="text-center text-sm text-muted-foreground p-4">Nenhum plano selecionado.</p>
                            )}
                        </div>
                    </ScrollArea>
                </div>
            </div>
        )}

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Salvar Alterações
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
