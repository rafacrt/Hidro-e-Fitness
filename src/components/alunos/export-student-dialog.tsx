
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

const columns = [
    { id: 'name', label: 'Nome Completo' },
    { id: 'cpf', label: 'CPF' },
    { id: 'email', label: 'E-mail' },
    { id: 'phone', label: 'Telefone' },
    { id: 'status', label: 'Status' },
    { id: 'birthDate', label: 'Data de Nascimento' },
    { id: 'address', label: 'Endereço Completo' },
    { id: 'responsible', label: 'Dados do Responsável' },
]

export function ExportStudentDialog({ children }: { children: React.ReactNode }) {
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
          <DialogTitle>Exportar Dados dos Alunos</DialogTitle>
          <DialogDescription>
            Selecione o formato e as colunas que deseja exportar.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
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
                <Label>Colunas para Exportar</Label>
                <div className='grid grid-cols-2 gap-2 p-4 border rounded-md max-h-48 overflow-y-auto'>
                    {columns.map(col => (
                        <div key={col.id} className="flex items-center space-x-2">
                            <Checkbox id={col.id} defaultChecked />
                            <Label htmlFor={col.id} className='font-normal'>{col.label}</Label>
                        </div>
                    ))}
                </div>
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
