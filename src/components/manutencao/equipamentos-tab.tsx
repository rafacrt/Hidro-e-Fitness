
import { Card, CardContent } from "@/components/ui/card";
import EquipamentosFilters from "./equipamentos-filters";
import EquipamentosQuickActions from "./equipamentos-quick-actions";
import EquipamentosStatCards from "./equipamentos-stat-cards";
import EquipamentosTable from "./equipamentos-table";

export default function EquipamentosTab() {
    return (
        <div className="space-y-6">
            <EquipamentosStatCards />
            <Card>
                <EquipamentosFilters />
                <CardContent className="p-0">
                    <EquipamentosTable />
                </CardContent>
            </Card>
            <EquipamentosQuickActions />
        </div>
    )
}
