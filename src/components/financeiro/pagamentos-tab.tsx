
import { Card, CardContent } from "@/components/ui/card";
import PagamentosStatCards from "./pagamentos-stat-cards";
import PagamentosFilters from "./pagamentos-filters";
import PagamentosTable from "./pagamentos-table";
import PagamentosBatchActions from "./pagamentos-batch-actions";

export default function PagamentosTab() {
    return (
        <div className="space-y-6">
            <PagamentosStatCards />
            <Card>
                <PagamentosFilters />
                <CardContent className="p-0">
                    <PagamentosTable />
                </CardContent>
                <PagamentosBatchActions />
            </Card>
        </div>
    )
}
