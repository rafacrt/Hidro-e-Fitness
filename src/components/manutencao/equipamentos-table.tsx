
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { MapPin, Eye, Edit, Trash2 } from 'lucide-react';

const equipment = [
  {
    name: 'Bomba Principal Piscina 1',
    details: 'Dancor PF-17 | S/N: DAN2023001',
    category: 'Bombas e Filtros',
    location: 'Casa de Máquinas A',
    status: 'Operacional',
    statusClass: 'bg-green-100 text-green-800 border-green-200',
    nextMaintenance: '09/04/2024',
    maintenanceStatus: 'Vencendo em breve',
    cost: 'R$ 2.500,00',
    maintenanceCost: 'Manutenção: R$ 450,00',
  },
  {
    name: 'Aquecedor Solar Piscina 2',
    details: 'Soletrol MAX-400 | S/N: SOL2023002',
    category: 'Aquecimento',
    location: 'Cobertura',
    status: 'Manutenção',
    statusClass: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    nextMaintenance: '19/01/2024',
    maintenanceStatus: 'Vencendo em breve',
    cost: 'R$ 8.500,00',
    maintenanceCost: 'Manutenção: R$ 1200,00',
  },
  {
    name: 'Sistema LED Piscina 1',
    details: 'Philips AquaLED-50 | S/N: PHI2023003',
    category: 'Iluminação',
    location: 'Piscina 1',
    status: 'Operacional',
    statusClass: 'bg-green-100 text-green-800 border-green-200',
    nextMaintenance: '14/03/2024',
    maintenanceStatus: 'Vencendo em breve',
    cost: 'R$ 3.200,00',
    maintenanceCost: 'Manutenção: R$ 320,00',
  },
  {
    name: 'Filtro de Areia Principal',
    details: 'Pentair Sand-Master | S/N: PEN2023004',
    category: 'Bombas e Filtros',
    location: 'Casa de Máquinas A',
    status: 'Operacional',
    statusClass: 'bg-green-100 text-green-800 border-green-200',
    nextMaintenance: '11/07/2024',
    maintenanceStatus: 'Vencendo em breve',
    cost: 'R$ 1.800,00',
    maintenanceCost: 'Manutenção: R$ 180,00',
  },
  {
    name: 'Controlador de pH Automático',
    details: 'Hayward pH-Control-Pro | S/N: HAY2023005',
    category: 'Automação',
    location: 'Casa de Máquinas B',
    status: 'Quebrado',
    statusClass: 'bg-red-100 text-red-800 border-red-200',
    nextMaintenance: '24/01/2024',
    maintenanceStatus: 'Vencendo em breve',
    cost: 'R$ 4.500,00',
    maintenanceCost: 'Manutenção: R$ 800,00',
  },
];

export default function EquipamentosTable() {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Equipamento</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead>Local</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Próxima Manutenção</TableHead>
            <TableHead>Custo</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {equipment.map((item, index) => (
            <TableRow key={index}>
              <TableCell>
                <p className="font-medium text-sm">{item.name}</p>
                <p className="text-xs text-muted-foreground">{item.details}</p>
              </TableCell>
              <TableCell>
                <p className="font-medium text-sm">{item.category}</p>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span className='text-sm'>{item.location}</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className={cn("font-medium", item.statusClass)}>
                   {item.status}
                </Badge>
              </TableCell>
              <TableCell>
                <p className="font-medium text-sm">{item.nextMaintenance}</p>
                <p className="text-xs text-yellow-600">{item.maintenanceStatus}</p>
              </TableCell>
              <TableCell>
                <p className="font-medium text-sm">{item.cost}</p>
                <p className="text-xs text-muted-foreground">{item.maintenanceCost}</p>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1">
                  <Button variant="ghost" size="icon">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
