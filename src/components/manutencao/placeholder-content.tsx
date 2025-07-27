import { Card, CardContent } from "@/components/ui/card";
import { Wrench } from "lucide-react";

interface PlaceholderContentProps {
    title: string;
}

export default function PlaceholderContent({ title }: PlaceholderContentProps) {
    return (
        <Card className="h-96">
            <CardContent className="h-full flex flex-col items-center justify-center text-center text-muted-foreground">
                <Wrench className="h-12 w-12 mb-4" />
                <h3 className="text-lg font-semibold text-foreground">Funcionalidade em Construção</h3>
                <p className="text-sm">O relatório "{title}" está sendo desenvolvido e estará disponível em breve.</p>
            </CardContent>
        </Card>
    )
}
