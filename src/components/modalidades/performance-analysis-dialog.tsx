
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
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Natação Adulto - Mensal', revenue: 17280, students: 96 },
  { name: 'Hidroginástica - Mensal', revenue: 17280, students: 108 },
  { name: 'Natação Adulto - Trimestral', revenue: 11664, students: 24 },
  { name: 'Combo Natação + Hidro', revenue: 9248, students: 32 },
  { name: 'Natação Infantil - Semestral', revenue: 13770, students: 18 },
];

export function PerformanceAnalysisDialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Análise de Performance dos Planos</DialogTitle>
          <DialogDescription>
            Visualize a receita e o número de alunos por plano para identificar os mais populares e rentáveis.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-4 h-[400px]">
            <div className="flex flex-col h-full">
                <h3 className="font-semibold text-center mb-2">Receita por Plano (R$)</h3>
                 <div className="relative h-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} layout="vertical" margin={{ left: 100 }}>
                            <XAxis type="number" hide />
                            <YAxis dataKey="name" type="category" width={100} tickLine={false} axisLine={false} fontSize={10} />
                            <Tooltip
                                cursor={{ fill: 'hsl(var(--muted))' }}
                                formatter={(value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)}
                            />
                            <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
             <div className="flex flex-col h-full">
                <h3 className="font-semibold text-center mb-2">Alunos por Plano</h3>
                 <div className="relative h-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} layout="vertical" margin={{ left: 100 }}>
                            <XAxis type="number" hide />
                            <YAxis dataKey="name" type="category" width={100} tickLine={false} axisLine={false} fontSize={10} />
                            <Tooltip cursor={{ fill: 'hsl(var(--muted))' }} />
                            <Bar dataKey="students" fill="hsl(var(--primary) / 0.7)" radius={[0, 4, 4, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
        <div className="flex justify-end">
             <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Fechar
            </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
