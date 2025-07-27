
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DicasConfiguracao() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Dicas de Configuração</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-secondary/20 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">PIX</h4>
                    <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                        <li>Configure chave PIX da empresa</li>
                        <li>Ative geração automática de QR Code</li>
                        <li>Defina tempo de expiração adequado</li>
                    </ul>
                </div>
                <div className="bg-secondary/20 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Cartões</h4>
                    <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                        <li>Configure parcelamento máximo</li>
                        <li>Defina valor mínimo por transação</li>
                        <li>Ative verificação de segurança</li>
                    </ul>
                </div>
            </CardContent>
        </Card>
    )
}
