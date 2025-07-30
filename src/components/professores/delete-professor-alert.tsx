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
import { deleteInstructor } from '@/app/professores/actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface DeleteProfessorAlertProps {
  instructorId: string;
  children: React.ReactNode;
}

export function DeleteProfessorAlert({ instructorId, children }: DeleteProfessorAlertProps) {
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    const result = await deleteInstructor(instructorId);
    if (result.success) {
      toast({
        title: 'Sucesso!',
        description: result.message,
      });
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
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Você tem certeza absoluta?</AlertDialogTitle>
          <AlertDialogDescription>
            Essa ação não pode ser desfeita. Isso irá excluir permanentemente os dados do professor.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
            {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isDeleting ? 'Excluindo...' : 'Sim, excluir professor'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
