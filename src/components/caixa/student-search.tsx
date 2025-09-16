
'use client';

import * as React from 'react';
import type { Database } from '@/lib/database.types';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { User, X } from 'lucide-react';
import { Button } from '../ui/button';

type Student = Database['public']['Tables']['students']['Row'];

interface StudentSearchProps {
  students: Student[];
  selectedStudent: Student | null;
  onSelectStudent: (student: Student | null) => void;
}

const getInitials = (name: string | null) => {
  if (!name) return '';
  const names = name.split(' ');
  return names.length > 1 ? `${names[0][0]}${names[names.length - 1][0]}` : name.substring(0, 2);
};

export default function StudentSearch({ students, selectedStudent, onSelectStudent }: StudentSearchProps) {
  const [open, setOpen] = React.useState(false);

  if (selectedStudent) {
    return (
        <div className="p-6 h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Cliente Selecionado</h2>
                <Button variant="ghost" size="icon" onClick={() => onSelectStudent(null)}>
                    <X className="h-5 w-5" />
                </Button>
            </div>
            <div className="flex items-center gap-4 p-4 border rounded-lg">
                <Avatar className="h-12 w-12">
                    <AvatarFallback className="text-lg bg-primary/20 text-primary">{getInitials(selectedStudent.name)}</AvatarFallback>
                </Avatar>
                <div>
                    <p className="font-bold text-lg">{selectedStudent.name}</p>
                    <p className="text-sm text-muted-foreground">{selectedStudent.email || 'Sem e-mail'}</p>
                </div>
            </div>
            <div className="flex-grow flex items-center justify-center">
                 <p className="text-muted-foreground">Adicione itens ao carrinho no painel à direita.</p>
            </div>
        </div>
    )
  }

  return (
    <div className="p-6 h-full flex flex-col">
      <h2 className="text-xl font-semibold mb-4">Caixa Rápido</h2>
       <Command className="rounded-lg border shadow-sm">
        <CommandInput placeholder="Buscar aluno por nome ou CPF..." />
        <CommandList>
          <CommandEmpty>Nenhum aluno encontrado.</CommandEmpty>
          <CommandGroup heading="Alunos">
            {students.map((student) => (
              <CommandItem
                key={student.id}
                value={`${student.name} ${student.cpf}`}
                onSelect={() => onSelectStudent(student)}
                className="flex items-center gap-3"
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-secondary text-secondary-foreground text-xs">{getInitials(student.name)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{student.name}</p>
                  <p className="text-xs text-muted-foreground">{student.cpf}</p>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
      <div className="flex-grow flex flex-col items-center justify-center text-center text-muted-foreground">
        <User className="h-16 w-16 mb-4" />
        <p className="font-semibold">Selecione um aluno para iniciar</p>
        <p className="text-sm">Busque pelo nome ou CPF para ver débitos e registrar pagamentos.</p>
      </div>
    </div>
  );
}
