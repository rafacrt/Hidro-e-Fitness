import { Separator } from "../ui/separator";

const revenueByModality = [
    { name: "Natação Adulto", students: 96, avgPrice: 180, total: 17280 },
    { name: "Hidroginástica", students: 108, avgPrice: 160, total: 17280 },
    { name: "Natação Infantil", students: 40, avgPrice: 150, total: 6000 },
    { name: "Aqua Aeróbica", students: 45, avgPrice: 140, total: 6300 },
    { name: "Natação Avançada", students: 20, avgPrice: 220, total: 4400 },
];

const formatCurrency = (value: number) => {
    return `R$ ${value.toFixed(2).replace('.', ',')}`;
}

export default function ReceitaPorModalidadePerformance() {
    return (
        <div>
            <h3 className="text-lg font-semibold mb-4">Receita por Modalidade</h3>
            <div className="space-y-4">
                {revenueByModality.map((item, index) => (
                    <div key={index}>
                        <div className="p-4 rounded-lg bg-secondary/50">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="font-semibold">{item.name}</p>
                                    <p className="text-sm text-muted-foreground">Alunos: {item.students}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-lg">{formatCurrency(item.total)}</p>
                                    <p className="text-sm text-muted-foreground">Preço médio: {formatCurrency(item.avgPrice)}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
