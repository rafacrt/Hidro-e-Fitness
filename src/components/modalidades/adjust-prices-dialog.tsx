
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
import { ArrowDown, ArrowUp, Percent, Tag } from 'lucide-react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

const modalities = [
    { id: 'all', name: 'Todas as Modalidades' },
    { id: '1', name: 'Natação Adulto' },
    { id: '2', name: 'Hidroginástica' },
];

export function AdjustPricesDialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const { toast } = useToast();

  const handleAdjust = () => {
    toast({
      title: 'Funcionalidade em desenvolvimento',
      description: 'O ajuste de preços em lote será implementado em breve.',
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Ajustar Preços em Lote</DialogTitle>
          <DialogDescription>
            Aumente ou diminua os preços de todos os planos de uma modalidade de uma vez.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
            <div>
                <Label>Modalidade</Label>
                <Select defaultValue="all">
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {modalities.map(m => <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>
             <div className="grid grid-cols-2 gap-4">
                 <div>
                    <Label>Ação</Label>
                    <Select defaultValue="increase">
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="increase">
                                <div className="flex items-center gap-2"><ArrowUp className="h-4 w-4 text-green-500" /> Aumentar</div>
                            </SelectItem>
                             <SelectItem value="decrease">
                                <div className="flex items-center gap-2"><ArrowDown className="h-4 w-4 text-red-500" /> Diminuir</div>
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div>
                     <Label>Percentual</Label>
                     <div className="relative">
                        <Input type="number" placeholder="10" />
                        <Percent className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                     </div>
                </div>
            </div>
        </div>
        <div className="flex justify-end gap-2">
           <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAdjust}>
                <Tag className="mr-2 h-4 w-4" />
                Ajustar Preços
            </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
