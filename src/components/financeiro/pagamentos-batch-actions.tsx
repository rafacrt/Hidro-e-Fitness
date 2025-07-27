
import { Button } from "@/components/ui/button";
import { PlusCircle, CheckCircle, Calendar } from "lucide-react";

export default function PagamentosBatchActions() {
    return (
        <div className="p-4 border-t">
            <h3 className="text-sm font-semibold mb-2">Ações Rápidas</h3>
            <div className="flex flex-wrap gap-2">
                <Button variant="default">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Nova Despesa
                </Button>
                <Button variant="secondary" className="bg-green-600 hover:bg-green-700 text-white">
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Pagar Selecionados
                </Button>
                <Button variant="secondary" className="bg-orange-500 hover:bg-orange-600 text-white">
                    <Calendar className="mr-2 h-4 w-4" />
                    Agendar Pagamentos
                </Button>
            </div>
        </div>
    )
}
