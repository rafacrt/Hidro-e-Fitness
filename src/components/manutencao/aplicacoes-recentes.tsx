import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const applications = [
  {
    product: "Cloro Granulado",
    amount: "2.5 kg",
    details: "Aplicado por: João Silva\nData: 14/01/2024 às 08:00\nMotivo: Manutenção diária"
  },
  {
    product: "Barrilha",
    amount: "1.2 kg",
    details: "Aplicado por: Ana Costa\nData: 14/01/2024 às 09:30\nMotivo: Correção de pH baixo"
  },
  {
    product: "Algicida",
    amount: "0.5 L",
    details: "Aplicado por: Carlos Santos\nData: 13/01/2024 às 16:00\nMotivo: Prevenção de algas"
  },
];

export default function AplicacoesRecentes() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Aplicações Recentes</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {applications.map((app, index) => (
                    <div key={index} className="bg-secondary/50 p-4 rounded-lg">
                        <div className="flex justify-between items-start">
                            <p className="font-semibold">{app.product}</p>
                            <p className="font-bold text-lg">{app.amount}</p>
                        </div>
                        <p className="text-xs text-muted-foreground whitespace-pre-line mt-2">{app.details}</p>
                    </div>
                ))}
            </CardContent>
        </Card>
    )
}
