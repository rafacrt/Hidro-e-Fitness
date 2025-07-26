import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const monthlyEvolution = [
    { month: "Nov 2023", value: "R$ 38.000,00" },
    { month: "Dez 2023", value: "R$ 40.000,00" },
    { month: "Jan 2024", value: "R$ 42.500,00" }
];

export default function EvolucaoMensal() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Evolução Mensal</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {monthlyEvolution.map((item, index) => (
                    <div key={index} className="bg-secondary p-4 rounded-lg text-center">
                        <p className="text-sm text-muted-foreground">{item.month}</p>
                        <p className="text-2xl font-bold mt-1">{item.value}</p>
                    </div>
                ))}
            </CardContent>
        </Card>
    )
}
