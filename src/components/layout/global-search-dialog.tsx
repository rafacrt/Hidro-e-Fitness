
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
import { Input } from '@/components/ui/input';
import { Search, User, Users, Calendar } from 'lucide-react';
import { Separator } from '../ui/separator';
import { Avatar, AvatarFallback } from '../ui/avatar';

const studentResults = [
  { name: 'Maria Silva Santos', cpf: '123.456.789-10', avatar: 'MS' },
  { name: 'João Pedro Costa', cpf: '987.654.321-00', avatar: 'JP' },
];

const classResults = [
  { name: 'Natação Adulto - Intermediário', professor: 'Prof. Ana Silva' },
  { name: 'Hidroginástica', professor: 'Prof. Carlos Santos' },
];

export function GlobalSearchDialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');

  const hasResults = studentResults.length > 0 || classResults.length > 0;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px] top-20 translate-y-0 p-0">
        <DialogHeader className="sr-only">
          <DialogTitle>Busca Global</DialogTitle>
          <DialogDescription>
            Busque por alunos, turmas, professores em todo o sistema.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center border-b px-4">
            <Search className="h-5 w-5 text-muted-foreground" />
            <Input 
                placeholder="Buscar alunos, turmas, professores..." 
                className="h-12 border-0 shadow-none focus-visible:ring-0"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
        </div>
        <div className="max-h-[400px] overflow-y-auto p-4 pt-0">
            {query.length > 0 ? (
                hasResults ? (
                <div className="space-y-4">
                    <div>
                        <h4 className="text-sm font-semibold text-muted-foreground px-2 my-2 flex items-center gap-2"><Users className='h-4 w-4' /> Alunos</h4>
                        <div className="space-y-1">
                            {studentResults.map((student, i) => (
                                <div key={i} className="flex items-center gap-3 p-2 rounded-md hover:bg-accent cursor-pointer">
                                    <Avatar className="h-8 w-8">
                                        <AvatarFallback className="bg-cyan-100 text-cyan-700 text-xs">{student.avatar}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-medium text-sm">{student.name}</p>
                                        <p className="text-xs text-muted-foreground">{student.cpf}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <Separator />
                    <div>
                        <h4 className="text-sm font-semibold text-muted-foreground px-2 my-2 flex items-center gap-2"><Calendar className='h-4 w-4' /> Turmas</h4>
                         <div className="space-y-1">
                            {classResults.map((cls, i) => (
                                <div key={i} className="flex items-center gap-3 p-2 rounded-md hover:bg-accent cursor-pointer">
                                    <div className='flex items-center justify-center h-8 w-8 rounded-md bg-secondary'>
                                        <Calendar className='h-4 w-4 text-secondary-foreground' />
                                    </div>
                                    <div>
                                        <p className="font-medium text-sm">{cls.name}</p>
                                        <p className="text-xs text-muted-foreground">{cls.professor}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-48 text-center text-muted-foreground">
                        <Search className="h-10 w-10 mb-4" />
                        <h3 className="text-lg font-semibold">Nenhum resultado encontrado</h3>
                        <p className="text-sm">Tente uma busca diferente.</p>
                    </div>
                )
            ) : (
                <div className="flex flex-col items-center justify-center h-48 text-center text-muted-foreground">
                    <Search className="h-10 w-10 mb-4" />
                    <h3 className="text-lg font-semibold">Busque em todo o sistema</h3>
                    <p className="text-sm">Encontre alunos, turmas, professores e mais.</p>
                </div>
            )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
