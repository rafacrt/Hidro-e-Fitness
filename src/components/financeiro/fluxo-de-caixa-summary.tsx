
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { FinancialSummary } from "@/app/financeiro/actions";

interface FluxoDeCaixaSummaryProps {
    summary: FinancialSummary;
}

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

export default function FluxoDeCaixaSummary({ summary }: FluxoDeCaixaSummaryProps) {
    const margin = summary.totalRevenue > 0 ? (summary.netFlow / summary.totalRevenue) * 100 : 0;
    
    const analysisItems = [
        { label: "Margem de Lucro:", value: `${margin.toFixed(1)}%`, color: "text-green-600" },
        // Outras análises podem ser adicionadas aqui
    ];

    const projectionItems = [
        { label: "Receita Projetada (Fev):", value: "R$ 0,00" },
        { label: "Despesas Projetadas (Fev):", value: "R$ 0,00" },
        { label: "Lucro Projetado (Fev):", value: "R$ 0,00" },
        { label: "Saldo Final Projetado:", value: "R$ 0,00" },
    ];

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
