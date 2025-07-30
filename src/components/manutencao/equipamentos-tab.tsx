
import { Card, CardContent } from "@/components/ui/card";
import EquipamentosFilters from "./equipamentos-filters";
import EquipamentosQuickActions from "./equipamentos-quick-actions";
import EquipamentosStatCards from "./equipamentos-stat-cards";
import EquipamentosTable from "./equipamentos-table";
import type { Database } from "@/lib/database.types";

type Equipment = Database['public']['Tables']['equipments']['Row'];

interface EquipamentosTabProps {
    equipments: Equipment[];
}

export default function EquipamentosTab({ equipments }: EquipamentosTabProps) {
    return (
        <div className="space-y-6">
            <EquipamentosStatCards />
            <Card>
                <EquipamentosFilters />
                <CardContent className="p-0">
                    <EquipamentosTable equipments={equipments} />
                </CardContent>
            </Card>
            <EquipamentosQuickActions />
        </div>
    )
}
