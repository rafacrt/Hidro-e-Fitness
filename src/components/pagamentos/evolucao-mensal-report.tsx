
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "../ui/separator";

const monthlyEvolution = [
    { month: "Out 2023", revenue: "R$ 52.000", tax: "R$ 2.800" },
    { month: "Nov 2023", revenue: "R$ 54.500", tax: "R$ 2.950" },
    { month: "Dez 2023", revenue: "R$ 56.000", tax: "R$ 3.100" },
    { month: "Jan 2024", revenue: "R$ 58.500", tax: "R$ 3.180" },
];

export default function EvolucaoMensalReport() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Evolução Mensal</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {monthlyEvolution.map((item, index) => (
                        <div key={index}>
                            <div className="flex justify-between items-center py-2">
                                <p className="font-medium text-muted-foreground">{item.month}</p>
                                <div className="text-right">
                                    <p className="font-semibold">{item.revenue}</p>
                                    <p className="text-xs text-muted-foreground">Taxas: {item.tax}</p>
                                </div>
                            </div>
                            {index < monthlyEvolution.length - 1 && <Separator />}
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
