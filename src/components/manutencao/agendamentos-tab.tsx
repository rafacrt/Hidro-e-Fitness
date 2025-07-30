
import { Card, CardContent } from "@/components/ui/card";
import AgendamentosFilters from "./agendamentos-filters";
import AgendamentosStatCards from "./agendamentos-stat-cards";
import AgendamentosTable from "./agendamentos-table";
import type { Database } from "@/lib/database.types";

type Equipment = Database['public']['Tables']['equipments']['Row'];
type Maintenance = Database['public']['Tables']['maintenance_schedules']['Row'] & { equipments: Pick<Equipment, 'name'> | null };

interface AgendamentosTabProps {
    maintenances: Maintenance[];
    equipments: Equipment[];
}

export default function AgendamentosTab({ maintenances, equipments }: AgendamentosTabProps) {
    return (
        <div className="space-y-6">
            <AgendamentosStatCards />
            <Card>
                <AgendamentosFilters equipments={equipments} />
                <CardContent className="p-0">
                    <AgendamentosTable maintenances={maintenances} />
                </CardContent>
            </Card>
        </div>
    )
}
