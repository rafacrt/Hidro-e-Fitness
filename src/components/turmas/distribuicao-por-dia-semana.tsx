
'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const data = [
  { day: 'Seg', turmas: 12 },
  { day: 'Ter', turmas: 15 },
  { day: 'Qua', turmas: 14 },
  { day: 'Qui', turmas: 16 },
  { day: 'Sex', turmas: 18 },
  { day: 'Sáb', turmas: 8 },
];

export default function DistribuicaoPorDiaSemana() {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Distribuição por Dia da Semana</h3>
        <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Bar dataKey="turmas" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
            </ResponsiveContainer>
        </div>
    </div>
  );
}
