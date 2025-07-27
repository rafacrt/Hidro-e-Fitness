
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const analysisItems = [
    { label: "Taxa de Crescimento:", value: "+12%", color: "text-green-600" },
    { label: "Margem de Lucro:", value: "56%", color: "text-green-600" },
    { label: "Maior Entrada:", value: "R$ 15.000,00" },
    { label: "Maior Saída:", value: "R$ 7.500,00" },
];

const projectionItems = [
    { label: "Receita Projetada (Fev):", value: "R$ 35.000,00" },
    { label: "Despesas Projetadas (Fev):", value: "R$ 12.000,00" },
    { label: "Lucro Projetado (Fev):", value: "R$ 23.000,00" },
    { label: "Saldo Final Projetado:", value: "R$ 64.830,00" },
];

export default function FluxoDeCaixaSummary() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>Análise do Período</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-3">
                        {analysisItems.map(item => (
                            <li key={item.label} className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground">{item.label}</span>
                                <span className={`font-semibold ${item.color || ''}`}>{item.value}</span>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Projeções</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-3">
                        {projectionItems.map(item => (
                            <li key={item.label} className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground">{item.label}</span>
                                <span className="font-semibold">{item.value}</span>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
        </div>
    )
}
