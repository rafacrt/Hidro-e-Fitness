
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const cashFlowData = [
  { date: '31/12/2023', description: 'Saldo Inicial', category: 'Saldo Inicial', entry: '', exit: '', balance: 'R$ 15.000,00', categoryClass: 'bg-zinc-100 text-zinc-800' },
  { date: '04/01/2024', description: 'Mensalidades Janeiro', category: 'Mensalidades', entry: '+R$ 8.500,00', exit: '', balance: 'R$ 23.500,00', categoryClass: 'bg-green-100 text-green-800' },
  { date: '04/01/2024', description: 'Salários Professores', category: 'Salários', entry: '', exit: 'R$ 7.500,00', balance: 'R$ 16.000,00', categoryClass: 'bg-blue-100 text-blue-800' },
  { date: '09/01/2024', description: 'Mensalidades Janeiro (2ª parcela)', category: 'Mensalidades', entry: '+R$ 12.000,00', exit: '', balance: 'R$ 28.000,00', categoryClass: 'bg-green-100 text-green-800' },
  { date: '14/01/2024', description: 'Conta de Luz', category: 'Infraestrutura', entry: '', exit: 'R$ 850,00', balance: 'R$ 27.150,00', categoryClass: 'bg-purple-100 text-purple-800' },
  { date: '19/01/2024', description: 'Produtos Químicos', category: 'Manutenção', entry: '', exit: 'R$ 320,00', balance: 'R$ 26.830,00', categoryClass: 'bg-orange-100 text-orange-800' },
  { date: '24/01/2024', description: 'Mensalidades Janeiro (3ª parcela)', category: 'Mensalidades', entry: '+R$ 15.000,00', exit: '', balance: 'R$ 41.830,00', categoryClass: 'bg-green-100 text-green-800' },
  { date: '31/01/2024', description: 'Aluguel', category: 'Infraestrutura', entry: '', exit: 'R$ 4.500,00', balance: 'R$ 37.330,00', isProjected: true, categoryClass: 'bg-purple-100 text-purple-800' },
  { date: '04/02/2024', description: 'Mensalidades Fevereiro (Projetado)', category: 'Mensalidades', entry: '+R$ 35.000,00', exit: '', balance: 'R$ 72.330,00', isProjected: true, categoryClass: 'bg-green-100 text-green-800' },
  { date: '04/02/2024', description: 'Salários (Projetado)', category: 'Salários', entry: '', exit: 'R$ 7.500,00', balance: 'R$ 64.830,00', isProjected: true, categoryClass: 'bg-blue-100 text-blue-800' },
];

export default function FluxoDeCaixaTable() {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Data</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead>Entrada</TableHead>
            <TableHead>Saída</TableHead>
            <TableHead className="text-right">Saldo</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cashFlowData.map((item, index) => (
            <TableRow key={index} className={cn(item.isProjected ? 'bg-blue-50/50' : '')}>
              <TableCell>
                <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{item.date}</span>
                    {item.isProjected && <Badge variant="outline" className="text-blue-600 bg-blue-100 border-blue-200">Projetado</Badge>}
                </div>
              </TableCell>
              <TableCell>
                <p className="font-medium text-sm">{item.description}</p>
              </TableCell>
              <TableCell>
                 <Badge variant="outline" className={cn("font-normal", item.categoryClass)}>{item.category}</Badge>
              </TableCell>
              <TableCell>
                <p className="font-medium text-sm text-green-600">{item.entry}</p>
              </TableCell>
              <TableCell>
                <p className="font-medium text-sm text-red-600">{item.exit}</p>
              </TableCell>
              <TableCell className="text-right">
                <p className="font-semibold text-sm">{item.balance}</p>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
