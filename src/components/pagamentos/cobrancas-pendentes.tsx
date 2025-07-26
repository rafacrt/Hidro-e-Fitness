import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, AlertCircle, Copy } from 'lucide-react';
import { Badge } from '../ui/badge';

const pendingCharges = [
  { 
    name: 'Roberto Silva', 
    modality: 'Natação Adulto', 
    date: '19/01/2024', 
    amount: 'R$ 180,00'
  },
  { 
    name: 'Lucia Santos', 
    modality: 'Hidroginástica', 
    date: '17/01/2024', 
    amount: 'R$ 160,00',
    attempts: 2
  },
  { 
    name: 'Pedro Oliveira', 
    modality: 'Combo Natação + Hidro', 
    date: '14/01/2024', 
    amount: 'R$ 200,00',
    attempts: 1
  },
];

export default function CobrancasPendentes() {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <div className="flex items-center gap-2">
            <CardTitle>Cobranças Pendentes</CardTitle>
            <Badge variant="destructive">3</Badge>
        </div>
        <Button variant="ghost" size="icon">
            <AlertCircle className="h-5 w-5 text-yellow-500" />
        </Button>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {pendingCharges.map((charge, index) => (
          <div key={index} className="p-4 rounded-lg border bg-card shadow-sm">
            <div className="flex justify-between items-start">
                <div>
                    <p className="font-semibold">{charge.name}</p>
                    <p className="text-sm text-muted-foreground">{charge.modality}</p>
                </div>
                {charge.attempts && (
                    <Badge variant="outline" className='bg-yellow-100 text-yellow-800 border-yellow-200'>{charge.attempts} tentativas</Badge>
                )}
            </div>
            <div className="flex items-center text-sm text-muted-foreground mt-2">
                <Calendar className="h-4 w-4 mr-1.5" />
                <span>Vencimento: {charge.date}</span>
            </div>
            <div className="flex justify-between items-center mt-4">
                <p className="text-lg font-bold">{charge.amount}</p>
                <div className='flex gap-2'>
                    <Button size="sm" variant="outline">Cobrar Agora</Button>
                    <Button variant="outline" size="icon">
                        <Copy className="h-4 w-4" />
                    </Button>
                </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
