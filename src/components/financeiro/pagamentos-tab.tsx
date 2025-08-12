
import { Card, CardContent } from "@/components/ui/card";
import PagamentosStatCards from "./pagamentos-stat-cards";
import PagamentosFilters from "./pagamentos-filters";
import PagamentosTable from "./pagamentos-table";
import PagamentosBatchActions from "./pagamentos-batch-actions";
import type { Database } from "@/lib/database.types";

type Payment = Database['public']['Tables']['payments']['Row'];

interface PagamentosTabProps {
    pagamentos: Payment[];
}

export default function PagamentosTab({ pagamentos }: PagamentosTabProps) {
    return (
        <div className="space-y-6">
            <PagamentosStatCards pagamentos={pagamentos} />
            <Card>
                <PagamentosFilters />
                <CardContent className="p-0">
                    <PagamentosTable pagamentos={pagamentos} />
                </CardContent>
                <PagamentosBatchActions />
            </Card>
        </div>
    )
}
