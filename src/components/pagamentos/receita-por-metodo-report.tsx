
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const paymentMethods = [
    { name: "PIX", amount: "R$ 26.325", percentage: 45, transactions: "158 transações", color: "bg-green-500" },
    { name: "Cartão de Crédito", amount: "R$ 20.475", percentage: 35, transactions: "89 transações", color: "bg-green-500" },
    { name: "Cartão de Débito", amount: "R$ 8.775", percentage: 15, transactions: "45 transações", color: "bg-green-500" },
    { name: "Dinheiro", amount: "R$ 2.925", percentage: 5, transactions: "23 transações", color: "bg-green-500" },
];

export default function ReceitaPorMetodoReport() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Receita por Método</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {paymentMethods.map((method, index) => (
                    <div key={index}>
                        <div className="flex justify-between items-center mb-1">
                            <div>
                                <p className="font-semibold">{method.name}</p>
                                <p className="text-sm text-muted-foreground">{method.amount}</p>
                            </div>
                            <div className="text-right">
                                <p className="font-semibold text-sm">{method.percentage}%</p>
                                <p className="text-xs text-muted-foreground">{method.transactions}</p>
                            </div>
                        </div>
                        <Progress value={method.percentage} className="h-2" indicatorClassName={method.color} />
                    </div>
                ))}
            </CardContent>
        </Card>
    )
}
