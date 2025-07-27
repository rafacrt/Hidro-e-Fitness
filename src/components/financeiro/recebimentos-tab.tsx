import { Card, CardContent } from "@/components/ui/card";
import RecebimentosStatCards from "./recebimentos-stat-cards";
import RecebimentosFilters from "./recebimentos-filters";
import RecebimentosTable from "./recebimentos-table";
import RecebimentosBatchActions from "./recebimentos-batch-actions";

export default function RecebimentosTab() {
    return (
        <div className="space-y-6">
            <RecebimentosStatCards />
            <Card>
                <RecebimentosFilters />
                <CardContent className="p-0">
                    <RecebimentosTable />
                </CardContent>
                <RecebimentosBatchActions />
            </Card>
        </div>
    )
}
