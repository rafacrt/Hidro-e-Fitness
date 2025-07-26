import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, X, Copy } from "lucide-react";

export default function AttendanceBatchActions() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Ações em Lote</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
                <Button variant="default" className="bg-green-600 hover:bg-green-700 text-white">
                    <Check className="mr-2 h-4 w-4" />
                    Marcar Todos Presentes
                </Button>
                <Button variant="destructive">
                    <X className="mr-2 h-4 w-4" />
                    Marcar Todos Ausentes
                </Button>
                <Button variant="outline">
                    <Copy className="mr-2 h-4 w-4" />
                    Copiar Lista Anterior
                </Button>
            </CardContent>
        </Card>
    )
}
