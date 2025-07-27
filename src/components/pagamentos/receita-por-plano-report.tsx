
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const revenueByPlan = [
    { name: "Natação Adulto - Mensal", revenue: "R$ 17.280", students: "96 alunos" },
    { name: "Hidroginástica - Mensal", revenue: "R$ 17.280", students: "108 alunos" },
    { name: "Natação Adulto - Trimestral", revenue: "R$ 11.664", students: "24 alunos" },
    { name: "Combo Natação + Hidro", revenue: "R$ 9.248", students: "32 alunos" },
    { name: "Natação Infantil - Semestral", revenue: "R$ 13.770", students: "18 alunos" },
];

export default function ReceitaPorPlanoReport() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Receita por Plano</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {revenueByPlan.map((plan, index) => (
                    <div key={index} className="bg-secondary/50 p-4 rounded-lg">
                        <p className="font-semibold">{plan.name}</p>
                        <p className="text-2xl font-bold mt-2">{plan.revenue}</p>
                        <p className="text-sm text-muted-foreground">{plan.students}</p>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
