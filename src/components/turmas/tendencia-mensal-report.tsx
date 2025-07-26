import { Separator } from "../ui/separator";

const monthlyTrend = [
    { month: "Out 2023", value: "78%" },
    { month: "Nov 2023", value: "80%" },
    { month: "Dez 2023", value: "85%" },
    { month: "Jan 2024", value: "82%" },
];

export default function TendenciaMensalReport() {
    return (
        <div>
            <h3 className="text-lg font-semibold mb-4">Tendência Mensal</h3>
            <div className="space-y-4">
                {monthlyTrend.map((item, index) => (
                    <div key={index}>
                        <div className="flex justify-between items-center py-2">
                            <p className="font-medium text-muted-foreground">{item.month}</p>
                            <p className="text-lg font-bold text-green-600">{item.value}</p>
                        </div>
                        {index < monthlyTrend.length - 1 && <Separator />}
                    </div>
                ))}
            </div>
        </div>
    )
}
