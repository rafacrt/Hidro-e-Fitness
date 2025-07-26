
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
import { Download, FileUp, Loader2, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function ImportStudentDialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const [isImporting, setIsImporting] = React.useState(false);
  const { toast } = useToast();

  const handleImport = () => {
    setIsImporting(true);
    setTimeout(() => {
        toast({
            title: "Importação Agendada!",
            description: "Os dados serão processados em segundo plano. Você será notificado quando terminar.",
        })
        setIsImporting(false);
        setOpen(false);
    }, 1500);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Importar Alunos</DialogTitle>
          <DialogDescription>
            Faça o upload de um arquivo CSV ou XLSX para adicionar múltiplos alunos de uma vez.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
            <div className="flex flex-col items-center justify-center w-full p-8 border-2 border-dashed rounded-lg">
                <FileUp className="w-12 h-12 text-muted-foreground" />
                <p className="mt-4 text-sm text-muted-foreground">Arraste e solte seu arquivo aqui</p>
                <p className="text-xs text-muted-foreground">ou</p>
                <Button variant="outline" size="sm" className='mt-2'>
                    Selecionar Arquivo
                </Button>
            </div>
            <div className='text-center'>
                 <Button variant="link" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Baixar modelo de planilha
                </Button>
            </div>
            <div className='p-4 bg-secondary rounded-md text-sm text-secondary-foreground'>
                <p className='font-semibold'>Instruções:</p>
                <ul className='list-disc pl-5 mt-2 text-xs'>
                    <li>O arquivo deve estar no formato CSV ou XLSX.</li>
                    <li>Siga a ordem das colunas do modelo.</li>
                    <li>A importação pode levar alguns minutos.</li>
                </ul>
            </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancelar
            </Button>
          </DialogClose>
          <Button onClick={handleImport} disabled={isImporting}>
            {isImporting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
            Importar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
