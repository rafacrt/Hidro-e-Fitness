
import { Card, CardContent } from "@/components/ui/card";
import AgendamentosFilters from "./agendamentos-filters";
import AgendamentosStatCards from "./agendamentos-stat-cards";
import AgendamentosTable from "./agendamentos-table";

export default function AgendamentosTab() {
    return (
        <div className="space-y-6">
            <AgendamentosStatCards />
            <Card>
                <AgendamentosFilters />
                <CardContent className="p-0">
                    <AgendamentosTable />
                </CardContent>
            </Card>
        </div>
    )
}
