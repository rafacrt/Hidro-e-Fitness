
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { QrCode, CreditCard, Wallet, Banknote, Edit, Eye, PlusCircle } from "lucide-react";
import { Separator } from "../ui/separator";

const paymentMethods = [
  {
    icon: QrCode,
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
    title: "PIX",
    description: "Pagamento instantâneo via PIX",
    tag: "Instantâneo",
    tagColor: "bg-green-100 text-green-800 border-green-200",
    enabled: true,
    stats: [
      { label: "Taxa", value: "0%" },
      { label: "Transações", value: "156" },
      { label: "Sucesso", value: "98.5%" },
    ],
    volume: "R$ 19.125,00",
  },
  {
    icon: CreditCard,
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    title: "Cartão de Crédito",
    description: "Visa, Mastercard, Elo, American Express",
    tag: "Cartão",
    tagColor: "bg-blue-100 text-blue-800 border-blue-200",
    enabled: true,
    stats: [
      { label: "Taxa", value: "3.5%" },
      { label: "Transações", value: "89" },
      { label: "Sucesso", value: "94.2%" },
    ],
    volume: "R$ 14.875,00",
  },
  {
    icon: CreditCard,
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
    title: "Cartão de Débito",
    description: "Débito em conta corrente",
    tag: "Cartão",
    tagColor: "bg-blue-100 text-blue-800 border-blue-200",
    enabled: true,
    stats: [
      { label: "Taxa", value: "2%" },
      { label: "Transações", value: "45" },
      { label: "Sucesso", value: "96.8%" },
    ],
    volume: "R$ 6.375,00",
  },
  {
    icon: Wallet,
    iconBg: 'bg-yellow-100',
    iconColor: 'text-yellow-600',
    title: "Dinheiro",
    description: "Pagamento em espécie na recepção",
    tag: "Dinheiro",
    tagColor: "bg-yellow-100 text-yellow-800 border-yellow-200",
    enabled: true,
    stats: [
      { label: "Taxa", value: "0%" },
      { label: "Transações", value: "23" },
      { label: "Sucesso", value: "100%" },
    ],
    volume: "R$ 2.125,00",
  },
  {
    icon: Banknote,
    iconBg: 'bg-zinc-100',
    iconColor: 'text-zinc-600',
    title: "Transferência Bancária",
    description: "TED/DOC para conta da academia",
    tag: "Transferência",
    tagColor: "bg-zinc-100 text-zinc-800 border-zinc-200",
    enabled: false,
    stats: [
      { label: "Taxa", value: "0%" },
      { label: "Transações", value: "0" },
      { label: "Sucesso", value: "0%" },
    ],
    volume: "R$ 0,00",
  },
];

export default function MetodosPagamentoList() {
    return (
        <Card>
            <CardHeader className="flex flex-row justify-between items-center">
                <CardTitle>Métodos de Pagamento Configurados</CardTitle>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Adicionar Método
                </Button>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {paymentMethods.map((method, index) => (
                    <Card key={index} className="flex flex-col">
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-4">
                                    <div className={`flex items-center justify-center h-12 w-12 rounded-lg ${method.iconBg}`}>
                                        <method.icon className={`h-6 w-6 ${method.iconColor}`} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold">{method.title}</h3>
                                        <p className="text-sm text-muted-foreground">{method.description}</p>
                                        <Badge variant="outline" className={`mt-1 font-normal ${method.tagColor}`}>{method.tag}</Badge>
                                    </div>
                                </div>
                                <Switch checked={method.enabled} />
                            </div>
                        </CardHeader>
                        <CardContent className="flex-grow space-y-4">
                            <div className="grid grid-cols-3 gap-4 text-center">
                                {method.stats.map(stat => (
                                    <div key={stat.label} className="bg-secondary/20 p-2 rounded-md">
                                        <p className="text-xs text-muted-foreground">{stat.label}</p>
                                        <p className="font-semibold">{stat.value}</p>
                                    </div>
                                ))}
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Volume do mês:</p>
                                <p className="text-xl font-bold">{method.volume}</p>
                            </div>
                        </CardContent>
                        <div className="p-6 pt-0 mt-auto">
                            <div className="flex items-center gap-2">
                                <Button className="w-full">Configurar</Button>
                                <Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button>
                                <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                            </div>
                        </div>
                    </Card>
                ))}
            </CardContent>
        </Card>
    );
}
