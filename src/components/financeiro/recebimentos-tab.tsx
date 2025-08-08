
import { Card, CardContent } from "@/components/ui/card";
import RecebimentosStatCards from "./recebimentos-stat-cards";
import RecebimentosFilters from "./recebimentos-filters";
import RecebimentosTable from "./recebimentos-table";
import RecebimentosBatchActions from "./recebimentos-batch-actions";
import type { Database } from "@/lib/database.types";

type Payment = Database['public']['Tables']['payments']['Row'];

interface RecebimentosTabProps {
    recebimentos: Payment[];
}

export default function RecebimentosTab({ recebimentos }: RecebimentosTabProps) {
    return (
        <div className="space-y-6">
            <RecebimentosStatCards />
            <Card>
                <RecebimentosFilters />
                <CardContent className="p-0">
                    <RecebimentosTable recebimentos={recebimentos} />
                </CardContent>
                <RecebimentosBatchActions />
            </Card>
        </div>
    )
}
