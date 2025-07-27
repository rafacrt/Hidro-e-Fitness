
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Check, Edit, Trash2, Copy, AlertCircle, XCircle } from 'lucide-react';
import { Separator } from "../ui/separator";

const plans = [
    {
        title: "Natação Adulto - Mensal",
        price: "R$ 180,00",
        period: "por mês",
        badge: "Mensal",
        badgeClass: "bg-blue-100 text-blue-800",
        students: 96,
        revenue: "R$ 17.280",
        benefits: ["Aulas ilimitadas", "Acesso à piscina", "Suporte técnico"],
        restrictions: ["Válido apenas para natação adulto"],
        highlight: false,
    },
    {
        title: "Natação Adulto - Trimestral",
        originalPrice: "R$ 540,00",
        price: "R$ 486,00",
        period: "por 3 meses",
        badge: "Trimestral",
        badgeClass: "bg-green-100 text-green-800",
        students: 24,
        revenue: "R$ 11.664",
        benefits: ["Aulas ilimitadas", "Acesso à piscina", "Suporte técnico", "10% de desconto"],
        restrictions: ["Válido apenas para natação adulto", "Pagamento à vista"],
        discount: {
            percentage: "10% de desconto",
            saving: "Economia de R$ 54,00"
        },
        highlight: true,
    },
    {
        title: "Hidroginástica - Mensal",
        price: "R$ 160,00",
        period: "por mês",
        badge: "Mensal",
        badgeClass: "bg-blue-100 text-blue-800",
        students: 108,
        revenue: "R$ 17.280",
        benefits: ["Aulas ilimitadas", "Acesso à piscina", "Equipamentos inclusos"],
        restrictions: ["Válido apenas para hidroginástica"],
        highlight: false,
    },
    {
        title: "Combo Natação + Hidro",
        originalPrice: "R$ 340,00",
        price: "R$ 289,00",
        period: "por mês",
        badge: "Mensal",
        badgeClass: "bg-blue-100 text-blue-800",
        students: 32,
        revenue: "R$ 9.248",
        benefits: ["Acesso a natação e hidroginástica", "Aulas ilimitadas", "Desconto especial"],
        restrictions: ["Requer matrícula em ambas modalidades"],
        discount: {
            percentage: "15% de desconto",
            saving: "Economia de R$ 51,00"
        },
        highlight: true,
    },
    {
        title: "Natação Infantil - Semestral",
        originalPrice: "R$ 900,00",
        price: "R$ 765,00",
        period: "por 6 meses",
        badge: "Semestral",
        badgeClass: "bg-purple-100 text-purple-800",
        students: 18,
        revenue: "R$ 13.770",
        benefits: ["Aulas especializadas", "Material didático", "Acompanhamento individual", "15% de desconto"],
        restrictions: ["Idade entre 3-12 anos", "Pagamento à vista"],
        discount: {
            percentage: "15% de desconto",
            saving: "Economia de R$ 135,00"
        },
        highlight: true,
    },
    {
        title: "Funcional Aquático - Premium",
        price: "R$ 220,00",
        period: "por mês",
        badge: "Mensal",
        badgeClass: "bg-blue-100 text-blue-800",
        students: 18,
        revenue: "R$ 3.960",
        benefits: ["Treinos personalizados", "Equipamentos premium", "Avaliação física"],
        restrictions: ["Requer avaliação física prévia"],
        highlight: false,
    }
]

export default function PlanosList() {
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
                                {plan.benefits.map((benefit, i) => (
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
                                {plan.restrictions.map((restriction, i) => (
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
