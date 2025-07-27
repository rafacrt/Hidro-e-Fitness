import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { QrCode, MessageSquare, PlusCircle } from "lucide-react";

export default function RecebimentosBatchActions() {
    return (
        <div className="p-4 border-t">
            <h3 className="text-sm font-semibold mb-2">Ações em Lote</h3>
            <div className="flex flex-wrap gap-2">
                <Button variant="secondary">
                    <QrCode className="mr-2 h-4 w-4" />
                    Gerar PIX para Vencidos
                </Button>
                <Button variant="default" className="bg-green-600 hover:bg-green-700">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Enviar Lembrete WhatsApp
                </Button>
                <Button variant="default" className="bg-orange-500 hover:bg-orange-600">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Gerar Mensalidades
                </Button>
            </div>
        </div>
    )
}
