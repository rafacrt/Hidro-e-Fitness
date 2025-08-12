
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { Database } from '@/lib/database.types';

type ClassRow = Database['public']['Tables']['classes']['Row'];

interface ScheduleClassDialogProps {
  children: React.ReactNode;
  classes: ClassRow[];
}

export function ScheduleClassDialog({ children, classes }: ScheduleClassDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [selectedClass, setSelectedClass] = React.useState<string | null>(null);
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(new Date());
  const { toast } = useToast();

  const handleSchedule = () => {
    if (!selectedClass || !selectedDate) {
      toast({
        title: 'Dados incompletos',
        description: 'Por favor, selecione a turma e a data.',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Aula Agendada com Sucesso!',
      description: `A aula foi agendada para ${format(selectedDate, 'PPP', { locale: ptBR })}.`,
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Agendar Aula Avulsa</DialogTitle>
          <DialogDescription>
            Selecione a turma e a data para agendar uma aula extra ou de reposição.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <Select onValueChange={setSelectedClass}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione a turma..." />
            </SelectTrigger>
            <SelectContent>
              {classes.map((cls) => (
                <SelectItem key={cls.id} value={cls.id}>
                  {cls.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex justify-center">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancelar
            </Button>
          </DialogClose>
          <Button onClick={handleSchedule}>Agendar Aula</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
