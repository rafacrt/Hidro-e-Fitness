
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import FluxoDeCaixaStatCards from "./fluxo-de-caixa-stat-cards";
import FluxoDeCaixaTable from "./fluxo-de-caixa-table";
import FluxoDeCaixaSummary from "./fluxo-de-caixa-summary";
import { Button } from "../ui/button";
import { BarChart2, Calendar } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

export default function FluxoDeCaixaTab() {
    return (
        <div className="space-y-6">
            <FluxoDeCaixaStatCards />
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Fluxo de Caixa Detalhado</CardTitle>
                    <div className="flex items-center gap-2">
                        <Select defaultValue="jan-2024">
                            <SelectTrigger className="w-[180px]">
                                <Calendar className="mr-2 h-4 w-4" />
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="jan-2024">Janeiro de 2024</SelectItem>
                                <SelectItem value="fev-2024">Fevereiro de 2024</SelectItem>
                                <SelectItem value="mar-2024">Março de 2024</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button>
                            <BarChart2 className="mr-2 h-4 w-4" />
                            Gráfico
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <FluxoDeCaixaTable />
                </CardContent>
            </Card>
            <FluxoDeCaixaSummary />
        </div>
    )
}
