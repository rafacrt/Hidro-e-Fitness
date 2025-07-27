
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar, Line, ResponsiveContainer } from "recharts";

const monthlyData = [
  { month: 'Set/23', receita: 40000, despesa: 22000 },
  { month: 'Out/23', receita: 45000, despesa: 25000 },
  { month: 'Nov/23', receita: 43000, despesa: 24000 },
  { month: 'Dez/23', receita: 52000, despesa: 28000 },
  { month: 'Jan/24', receita: 48000, despesa: 26000 },
  { month: 'Fev/24', receita: 42500, despesa: 23000 },
];

const categoryData = [
  { name: 'Mensalidades', value: 35000 },
  { name: 'Matrículas', value: 4500 },
  { name: 'Produtos', value: 2000 },
  { name: 'Outros', value: 1000 },
];


export default function VisaoGeralCharts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Receita vs. Despesa (Últimos 6 meses)</CardTitle>
          <CardDescription>Análise da evolução financeira mensal.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `R$${(value / 1000)}k`} />
                <Tooltip formatter={(value: number) => `R$ ${value.toFixed(2)}`} />
                <Legend />
                <Line type="monotone" dataKey="receita" stroke="hsl(var(--primary))" strokeWidth={2} name="Receita" />
                <Line type="monotone" dataKey="despesa" stroke="hsl(var(--destructive))" strokeWidth={2} name="Despesa" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Composição da Receita</CardTitle>
          <CardDescription>Distribuição das fontes de receita no mês atual.</CardDescription>
        </CardHeader>
        <CardContent>
           <div className="h-[300px] w-full">
            <ResponsiveContainer>
              <BarChart data={categoryData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" tickFormatter={(value) => `R$${(value / 1000)}k`} />
                <YAxis dataKey="name" type="category" width={80} tickLine={false} axisLine={false} />
                <Tooltip formatter={(value: number) => `R$ ${value.toFixed(2)}`} />
                <Bar dataKey="value" fill="hsl(var(--primary))" name="Valor" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
