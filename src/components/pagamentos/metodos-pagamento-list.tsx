
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { QrCode, CreditCard, Wallet, Banknote, Edit, Eye, PlusCircle } from "lucide-react";
import type { PaymentMethod } from "@/app/pagamentos/actions";
import { AddMetodoPagamentoDialog } from "./add-metodo-pagamento-dialog";

interface MetodosPagamentoListProps {
  methods: PaymentMethod[];
}

const iconMap = {
  pix: { icon: QrCode, bg: 'bg-green-100', text: 'text-green-600' },
  card: { icon: CreditCard, bg: 'bg-blue-100', text: 'text-blue-600' },
  cash: { icon: Wallet, bg: 'bg-yellow-100', text: 'text-yellow-600' },
  transfer: { icon: Banknote, bg: 'bg-zinc-100', text: 'text-zinc-600' },
};

export default function MetodosPagamentoList({ methods }: MetodosPagamentoListProps) {
    return (
        <Card>
            <CardHeader className="flex flex-row justify-between items-center">
                <CardTitle>Métodos de Pagamento Configurados</CardTitle>
                <AddMetodoPagamentoDialog>
                    <Button>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Adicionar Método
                    </Button>
                </AddMetodoPagamentoDialog>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {methods.map((method) => {
                    const IconInfo = iconMap[method.type] || iconMap.transfer;
                    const Icon = IconInfo.icon;
                    return (
                    <Card key={method.id} className="flex flex-col">
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-4">
                                    <div className={`flex items-center justify-center h-12 w-12 rounded-lg ${IconInfo.bg}`}>
                                        <Icon className={`h-6 w-6 ${IconInfo.text}`} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold">{method.name}</h3>
                                        <p className="text-sm text-muted-foreground capitalize">{method.type}</p>
                                    </div>
                                </div>
                                <Switch checked={method.enabled} />
                            </div>
                        </CardHeader>
                        <CardContent className="flex-grow space-y-4">
                            <div className="grid grid-cols-3 gap-4 text-center">
                                <div className="bg-secondary/20 p-2 rounded-md">
                                    <p className="text-xs text-muted-foreground">Taxa</p>
                                    <p className="font-semibold">{method.fee_percentage}%</p>
                                </div>
                                 <div className="bg-secondary/20 p-2 rounded-md">
                                    <p className="text-xs text-muted-foreground">Transações</p>
                                    <p className="font-semibold">0</p>
                                </div>
                                 <div className="bg-secondary/20 p-2 rounded-md">
                                    <p className="text-xs text-muted-foreground">Sucesso</p>
                                    <p className="font-semibold">0%</p>
                                </div>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Volume do mês:</p>
                                <p className="text-xl font-bold">R$ 0,00</p>
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
                    )
                })}
            </CardContent>
        </Card>
    );
}
