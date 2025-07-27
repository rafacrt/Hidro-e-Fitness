import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { QrCode, CreditCard, Wallet, Link, BarChart } from "lucide-react";
import { Button } from "../ui/button";

const methods = [
    { 
        icon: QrCode, 
        name: "PIX", 
        transactions: "178 transações", 
        avgTime: "15s", 
        successRate: 98.9, 
        amount: "R$ 28.820", 
        percentage: 52,
        color: "bg-green-500"
    },
    { 
        icon: CreditCard, 
        name: "Cartão de Crédito", 
        transactions: "74 transações", 
        avgTime: "45s", 
        successRate: 94.6, 
        amount: "R$ 17.050", 
        percentage: 31,
        color: "bg-blue-500"
    },
    { 
        icon: Wallet, 
        name: "Cartão de Débito", 
        transactions: "44 transações", 
        avgTime: "32s", 
        successRate: 96.2, 
        amount: "R$ 8.800", 
        percentage: 12,
        color: "bg-sky-500"
    },
    { 
        icon: Link, 
        name: "Link de Pagamento", 
        transactions: "25 transações", 
        avgTime: "2m 15s", 
        successRate: 89.3, 
        amount: "R$ 2.750", 
        percentage: 5,
        color: "bg-orange-500"
    }
];

export default function PerformanceMetodos() {
    return (
        <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Performance dos Métodos</CardTitle>
                <Button variant="ghost" size="icon">
                    <BarChart className="h-5 w-5" />
                </Button>
            </CardHeader>
            <CardContent className="space-y-6">
                {methods.map((method, index) => (
                    <div key={index}>
                        <div className="flex items-start gap-4">
                           <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-secondary">
                                <method.icon className="h-5 w-5 text-secondary-foreground" />
                           </div>
                           <div className="flex-1">
                                <div className="flex justify-between items-center mb-1">
                                    <div>
                                        <p className="font-semibold">{method.name}</p>
                                        <p className="text-sm text-muted-foreground">{method.transactions}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-lg">{method.percentage}%</p>
                                        <p className="text-sm text-muted-foreground">{method.amount}</p>
                                    </div>
                                </div>
                                <Progress value={method.successRate} className="h-2" indicatorClassName={method.color} />
                                <div className="flex justify-between items-center mt-1 text-xs text-muted-foreground">
                                    <span>Tempo médio: {method.avgTime}</span>
                                    <span>Taxa de sucesso: {method.successRate}%</span>
                                </div>
                           </div>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}

// Add a new prop to Progress to allow for custom indicator color
const OldProgress = Progress;
const NewProgress = ({ indicatorClassName, ...props }: React.ComponentProps<typeof OldProgress> & { indicatorClassName?: string }) => {
    return (
        <OldProgress
            {...props}
            classNames={{
                indicator: indicatorClassName
            }}
        />
    )
}

export { NewProgress as Progress }
