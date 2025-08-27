
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Check, Edit, Trash2, Copy, AlertCircle, XCircle } from 'lucide-react';
import { Separator } from "../ui/separator";
import type { Database } from '@/lib/database.types';

type Modality = Database['public']['Tables']['modalities']['Row'];
type Plan = Database['public']['Tables']['plans']['Row'] & { modalities: Pick<Modality, 'name'> | null };

interface PlanosListProps {
  plans: Plan[];
}

const formatCurrency = (value: number | null) => {
  if (value === null) return 'N/A';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

const recurrenceMap = {
    mensal: { text: "por mês", badge: "Mensal", badgeClass: "bg-blue-100 text-blue-800" },
    trimestral: { text: "por 3 meses", badge: "Trimestral", badgeClass: "bg-green-100 text-green-800" },
    semestral: { text: "por 6 meses", badge: "Semestral", badgeClass: "bg-purple-100 text-purple-800" },
    anual: { text: "por ano", badge: "Anual", badgeClass: "bg-orange-100 text-orange-800" },
}

export default function PlanosList({ plans }: PlanosListProps) {
  if (plans.length === 0) {
    return (
        <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
                <h3 className="text-lg font-semibold">Nenhum plano encontrado</h3>
                <p className="text-sm">Cadastre um novo plano para começar.</p>
            </CardContent>
        </Card>
    )
  }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.map((plan, index) => {
                const recurrenceInfo = recurrenceMap[plan.recurrence as keyof typeof recurrenceMap] || recurrenceMap.mensal;
                return (
                <Card key={index}>
                    <CardHeader>
                        <div className="flex justify-between items-start">
                            <div>
                                <CardTitle className="text-xl">{plan.name}</CardTitle>
                                <p className="text-sm text-muted-foreground">{plan.modalities?.name}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-bold">{formatCurrency(plan.price)}</p>
                                <p className="text-sm text-muted-foreground">{recurrenceInfo.text}</p>
                            </div>
                        </div>
                        <div className="flex justify-between items-center pt-2">
                             <Badge className={recurrenceInfo.badgeClass}>{recurrenceInfo.badge}</Badge>
                             <Badge variant={plan.status === 'ativo' ? 'default' : 'secondary'} className={plan.status === 'ativo' ? 'bg-green-600' : ''}>
                                {plan.status === 'ativo' ? 'Ativo' : 'Inativo'}
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {(plan.benefits && plan.benefits.length > 0) && (
                            <div>
                                <h4 className="font-semibold mb-2 text-sm">Benefícios inclusos:</h4>
                                <ul className="space-y-1.5 text-sm text-muted-foreground">
                                    {plan.benefits.map((benefit: string, i: number) => (
                                        <li key={i} className="flex items-center gap-2">
                                            <Check className="h-4 w-4 text-green-500" />
                                            <span>{benefit}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        
                        <div className="flex items-center gap-2 pt-2">
                            <Button className="w-full">Editar Plano</Button>
                            <Button variant="ghost" size="icon"><Copy className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600"><Trash2 className="h-4 w-4" /></Button>
                        </div>
                    </CardContent>
                </Card>
            )})}
        </div>
    )
}
