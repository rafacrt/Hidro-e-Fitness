import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const paymentMethods = [
    { name: "PIX", percentage: 60, value: "R$ 25.500,00", color: "bg-sky-500" },
    { name: "Cartão de Crédito", percentage: 30, value: "R$ 12.750,00", color: "bg-blue-500" },
    { name: "Dinheiro", percentage: 10, value: "R$ 4.250,00", color: "bg-cyan-500" },
];

export default function FormaDePagamento() {
    return (
        <div>
            <h3 className="text-lg font-semibold mb-4">Forma de Pagamento</h3>
            <div className="space-y-4">
                {paymentMethods.map((method, index) => (
                    <div key={index}>
                        <div className="flex justify-between items-center mb-1 text-sm">
                            <span className="font-medium">{method.name}</span>
                            <div className="flex items-center">
                                <span className="text-muted-foreground mr-2">{method.percentage}%</span>
                                <span className="font-semibold">{method.value}</span>
                            </div>
                        </div>
                        <Progress value={method.percentage} className="h-2" indicatorClassName={method.color} />
                    </div>
                ))}
            </div>
        </div>
    )
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
