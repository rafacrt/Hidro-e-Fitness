
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';
import { Download, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const reports = [
    { id: 'receitas', label: 'Relatório de Receitas' },
    { id: 'despesas', label: 'Relatório de Despesas' },
    { id: 'fluxo_caixa', label: 'Fluxo de Caixa' },
    { id: 'inadimplencia', label: 'Relatório de Inadimplência' },
]

export function ExportFinanceiroDialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const [isExporting, setIsExporting] = React.useState(false);
  const { toast } = useToast();

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
        toast({
            title: "Exportação iniciada!",
            description: "Em breve o download do seu arquivo começará.",
        })
        setIsExporting(false);
        setOpen(false);
    }, 1500);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Exportar Dados Financeiros</DialogTitle>
          <DialogDescription>
            Selecione o tipo de relatório e o formato do arquivo.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
            <div className='space-y-2'>
                <Label>Tipo de Relatório</Label>
                <Select defaultValue="receitas">
                    <SelectTrigger>
                        <SelectValue placeholder="Selecione o relatório" />
                    </SelectTrigger>
                    <SelectContent>
                        {reports.map(r => <SelectItem key={r.id} value={r.id}>{r.label}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>
             <div className='space-y-2'>
                <Label>Formato do Arquivo</Label>
                <Select defaultValue="csv">
                    <SelectTrigger>
                        <SelectValue placeholder="Selecione o formato" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="csv">CSV</SelectItem>
                        <SelectItem value="xlsx">XLSX (Excel)</SelectItem>
                        <SelectItem value="pdf">PDF</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className='space-y-2'>
                <Label>Período</Label>
                <Select defaultValue="mes_atual">
                    <SelectTrigger>
                        <SelectValue placeholder="Selecione o período" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="mes_atual">Mês Atual</SelectItem>
                        <SelectItem value="mes_anterior">Mês Anterior</SelectItem>
                        <SelectItem value="ano_atual">Este Ano</SelectItem>
                        <SelectItem value="personalizado">Personalizado</SelectItem>
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
          <Button onClick={handleExport} disabled={isExporting}>
            {isExporting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
            Exportar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
