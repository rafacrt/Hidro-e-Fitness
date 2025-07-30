
'use client';

import * as React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { deleteClass } from '@/app/turmas/actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface DeleteClassAlertProps {
  classId: string;
  children: React.ReactNode;
}

export function DeleteClassAlert({ classId, children }: DeleteClassAlertProps) {
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    const result = await deleteClass(classId);
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
    setIsDeleting(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild onClick={(e) => { e.stopPropagation(); setOpen(true); }}>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Você tem certeza absoluta?</AlertDialogTitle>
          <AlertDialogDescription>
            Essa ação não pode ser desfeita. Isso irá excluir permanentemente a turma e todas as suas matrículas.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
            {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isDeleting ? 'Excluindo...' : 'Sim, excluir turma'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
