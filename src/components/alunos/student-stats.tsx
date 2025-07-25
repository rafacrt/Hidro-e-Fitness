import { Card, CardContent } from "@/components/ui/card"

const stats = [
    { value: 3, label: "Alunos Ativos" },
    { value: 1, label: "Alunos Inativos" },
    { value: 2, label: "Menores de Idade" },
    { value: 4, label: "Com WhatsApp" },
]

export default function StudentStats() {
    return (
        <Card>
            <CardContent className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    {stats.map((stat, index) => (
                        <div key={index}>
                            <p className="text-2xl font-bold">{stat.value}</p>
                            <p className="text-sm text-muted-foreground">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
