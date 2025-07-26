import { Button } from "@/components/ui/button";
import { Eye, ArrowDownToDot, CreditCard, Repeat, FilePieChart } from "lucide-react";

const filters = [
    { label: "Visão Geral", icon: Eye },
    { label: "Recebimentos", icon: ArrowDownToDot },
    { label: "Pagamentos", icon: CreditCard },
    { label: "Fluxo de Caixa", icon: Repeat },
    { label: "Relatórios", icon: FilePieChart, active: true },
];

export default function FiltrosFinanceiro() {
    return (
        <div className="flex flex-wrap items-center gap-2 border-b pb-2">
            {filters.map((filter, index) => (
                <Button key={index} variant={filter.active ? "default" : "ghost"} className="font-normal text-muted-foreground data-[state=active]:text-foreground data-[state=active]:font-semibold">
                    <filter.icon className="mr-2 h-4 w-4" />
                    {filter.label}
                </Button>
            ))}
        </div>
    )
}
