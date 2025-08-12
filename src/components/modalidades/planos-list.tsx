
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Check, Edit, Trash2, Copy, AlertCircle, XCircle } from 'lucide-react';
import { Separator } from "../ui/separator";

const plans: any[] = []

export default function PlanosList() {
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {plans.map((plan, index) => (
                <Card key={index} className={plan.highlight ? "bg-green-50/50 border-green-200" : ""}>
                    <CardHeader>
                        <div className="flex justify-between items-start">
                            <CardTitle className="text-xl">{plan.title}</CardTitle>
                            <div className="text-right">
                                {plan.originalPrice && <p className="text-sm text-muted-foreground line-through">{plan.originalPrice}</p>}
                                <p className="text-2xl font-bold">{plan.price}</p>
                                <p className="text-sm text-muted-foreground">{plan.period}</p>
                            </div>
                        </div>
                        <div className="flex justify-between items-center pt-2">
                             <Badge className={plan.badgeClass}>{plan.badge}</Badge>
                             {plan.discount && (
                                <div className="text-right">
                                    <p className="font-semibold text-sm text-green-700">{plan.discount.percentage}</p>
                                    <p className="text-xs text-green-600">{plan.discount.saving}</p>
                                </div>
                             )}
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-center">
                            <div className="bg-card p-3 rounded-lg border">
                                <p className="text-sm text-muted-foreground">Alunos</p>
                                <p className="text-lg font-bold">{plan.students}</p>
                            </div>
                             <div className="bg-card p-3 rounded-lg border">
                                <p className="text-sm text-muted-foreground">Receita</p>
                                <p className="text-lg font-bold">{plan.revenue}</p>
                            </div>
                        </div>

                        <Separator />
                        
                        <div>
                            <h4 className="font-semibold mb-2">Benefícios inclusos:</h4>
                            <ul className="space-y-1.5 text-sm text-muted-foreground">
                                {plan.benefits.map((benefit: string, i: number) => (
                                    <li key={i} className="flex items-center gap-2">
                                        <Check className="h-4 w-4 text-green-500" />
                                        <span>{benefit}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-2">Restrições:</h4>
                            <ul className="space-y-1.5 text-sm text-muted-foreground">
                                {plan.restrictions.map((restriction: string, i: number) => (
                                    <li key={i} className="flex items-center gap-2">
                                        <XCircle className="h-4 w-4 text-red-500" />
                                        <span>{restriction}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        
                        <div className="flex items-center gap-2 pt-2">
                            <Button className="w-full">Editar Plano</Button>
                            <Button variant="ghost" size="icon"><Copy className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600"><Trash2 className="h-4 w-4" /></Button>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
