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
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Clock, MapPin, User, Users, Calendar, PlusCircle } from 'lucide-react';
import { Separator } from '../ui/separator';

const modalities = ['Natação Adulto', 'Hidroginástica', 'Natação Infantil', 'Zumba Aquática', 'Funcional Aquático'];
const weekdays = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

const searchResults = [
  {
    name: 'Natação Adulto - Intermediário',
    professorName: 'Prof. Ana Silva',
    schedule: '08:00 - 09:00',
    days: ['Terça', 'Quinta'],
    occupancy: '14/15',
    location: 'Piscina 1',
  },
  {
    name: 'Hidroginástica',
    professorName: 'Prof. Carlos Santos',
    schedule: '09:00 - 10:00',
    days: ['Segunda', 'Quarta', 'Sexta'],
    occupancy: '20/20',
    location: 'Piscina 2',
  },
];

export function SearchClassDialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const [hasSearched, setHasSearched] = React.useState(false);

  const handleSearch = () => {
    setHasSearched(true);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Buscar Turma</DialogTitle>
          <DialogDescription>
            Use os filtros abaixo para encontrar turmas específicas.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col md:flex-row gap-4 p-1">
            <Input placeholder="Buscar por nome, professor..." className="flex-1" />
            <Select>
                <SelectTrigger className="md:w-[180px]">
                    <SelectValue placeholder="Dia da Semana" />
                </SelectTrigger>
                <SelectContent>
                    {weekdays.map(day => <SelectItem key={day} value={day}>{day}</SelectItem>)}
                </SelectContent>
            </Select>
            <Select>
                <SelectTrigger className="md:w-[180px]">
                    <SelectValue placeholder="Modalidade" />
                </SelectTrigger>
                <SelectContent>
                     {modalities.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                </SelectContent>
            </Select>
            <Button onClick={handleSearch}>
                <Search className="mr-2 h-4 w-4" />
                Buscar
            </Button>
        </div>
        <Separator />
        <div className="flex-1 overflow-y-auto pr-2">
            {!hasSearched ? (
                 <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                    <Search className="h-12 w-12 mb-4" />
                    <h3 className="text-lg font-semibold">Realize uma busca</h3>
                    <p className="text-sm">Os resultados das turmas aparecerão aqui.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    <h4 className="font-semibold">{searchResults.length} turmas encontradas</h4>
                    {searchResults.map((result, index) => (
                        <div key={index} className="p-4 border rounded-lg bg-secondary/50">
                            <div className="flex justify-between items-start">
                                <p className="font-semibold">{result.name}</p>
                                <Button size="sm">
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    Matricular
                                </Button>
                            </div>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-2 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2"><User className="h-4 w-4" />{result.professorName}</div>
                                <div className="flex items-center gap-2"><Clock className="h-4 w-4" />{result.schedule}</div>
                                <div className="flex items-center gap-2"><Calendar className="h-4 w-4" />{result.days.join(', ')}</div>
                                <div className="flex items-center gap-2"><Users className="h-4 w-4" />{result.occupancy}</div>
                                <div className="flex items-center gap-2 col-span-2"><MapPin className="h-4 w-4" />{result.location}</div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
