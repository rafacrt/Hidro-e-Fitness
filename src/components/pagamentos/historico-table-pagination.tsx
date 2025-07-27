import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function HistoricoTablePagination() {
    return (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
            <p>Mostrando 7 de 24 transações</p>
            <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Anterior
                </Button>
                <div className="flex items-center gap-1">
                    <Button variant="default" size="sm" className="h-8 w-8 p-0">1</Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">2</Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">3</Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">...</Button>
                </div>
                <Button variant="outline" size="sm">
                    Próximo
                    <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
            </div>
        </div>
    )
}
