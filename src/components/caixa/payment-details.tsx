'use client';

import * as React from 'react';
import type { Database } from '@/lib/database.types';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
import { Loader2, PlusCircle, Receipt, Trash2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Input } from '../ui/input';
import { useToast } from '@/hooks/use-toast';
import { processPayment } from '@/app/caixa/actions';

type Student = Database['public']['Tables']['students']['Row'];
type Payment = Database['public']['Tables']['payments']['Row'];

const paymentMethods = ['PIX', 'Cartão de Crédito', 'Cartão de Débito', 'Dinheiro', 'Boleto'];

interface CartItem {
  id?: string;
  description: string;
  amount: number;
  type: 'receita' | 'despesa';
  category: string;
}

interface PaymentDetailsProps {
  student: Student | null;
  fetchStudentDebts: (studentId: string) => Promise<Payment[]>;
  onClear: () => void;
  onSuccess: () => void;
}

const formatCurrency = (value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

const formatDate = (value: string | null | undefined) => {
  if (!value) return 'Sem data';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return 'Sem data';
  return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'medium' }).format(parsed);
};

const statusLabels: Record<string, string> = {
  pendente: 'Pendente',
  vencido: 'Vencido',
  inadimplente: 'Inadimplente',
  pago: 'Pago',
};

const statusVariant = (status: string | null | undefined): 'default' | 'destructive' | 'secondary' | 'outline' => {
  switch (status) {
    case 'vencido':
    case 'inadimplente':
      return 'destructive';
    case 'pago':
      return 'secondary';
    case 'pendente':
    default:
      return 'outline';
  }
};

export default function PaymentDetails({ student, fetchStudentDebts, onClear, onSuccess }: PaymentDetailsProps) {
  const [pendingPayments, setPendingPayments] = React.useState<Payment[]>([]);
  const [loadingDebts, setLoadingDebts] = React.useState(false);
  const [cart, setCart] = React.useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = React.useState('');
  const [processing, setProcessing] = React.useState(false);
  const { toast } = useToast();

  React.useEffect(() => {
    let isActive = true;

    if (!student) {
      setPendingPayments([]);
      setCart([]);
      setPaymentMethod('');
      setLoadingDebts(false);
      return;
    }

    setPendingPayments([]);
    setCart([]);
    setPaymentMethod('');

    const loadDebts = async () => {
      setLoadingDebts(true);
      try {
        const data = await fetchStudentDebts(student.id);
        if (!isActive) return;
        setPendingPayments(data);
        const pendingCartItems = data.map((payment) => ({
          id: payment.id,
          description: payment.description || 'Cobrança',
          amount: payment.amount || 0,
          type: 'receita',
          category: payment.category || 'Mensalidade',
        }));
        setCart(pendingCartItems);
      } catch (error) {
        if (!isActive) return;
        console.error('Failed to load pending payments', error);
        toast({
          title: 'Erro ao carregar cobranças',
          description: 'Não foi possível carregar as cobranças pendentes.',
          variant: 'destructive',
        });
        setPendingPayments([]);
        setCart([]);
      } finally {
        if (isActive) {
          setLoadingDebts(false);
        }
      }
    };

    loadDebts();

    return () => {
      isActive = false;
    };
  }, [student, fetchStudentDebts, toast]);

  const handleRemoveFromCart = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddAvulso = () => {
    setCart((prev) => [
      ...prev,
      { description: 'Item avulso', amount: 0, type: 'receita', category: 'Venda Avulsa' },
    ]);
  };

  const handleUpdateCartItem = (index: number, field: 'description' | 'amount', value: string | number) => {
    setCart((prev) => {
      const newCart = [...prev];
      if (field === 'amount') {
        newCart[index][field] = Number(value) || 0;
      } else {
        newCart[index][field] = String(value);
      }
      return newCart;
    });
  };

  const total = React.useMemo(() => cart.reduce((sum, item) => sum + item.amount, 0), [cart]);

  const handleTogglePendingPayment = (paymentId: string) => {
    setCart((prev) => {
      const alreadySelected = prev.some((item) => item.id === paymentId);
      if (alreadySelected) {
        return prev.filter((item) => item.id !== paymentId);
      }
      const payment = pendingPayments.find((item) => item.id === paymentId);
      if (!payment) return prev;
      return [
        ...prev,
        {
          id: payment.id,
          description: payment.description || 'Cobrança',
          amount: payment.amount || 0,
          type: 'receita',
          category: payment.category || 'Mensalidade',
        },
      ];
    });
  };

  const handleProcessPayment = async () => {
    if (!student || cart.length === 0 || !paymentMethod) {
      toast({
        title: 'Dados incompletos',
        description: 'Selecione um aluno, itens e um método de pagamento.',
        variant: 'destructive',
      });
      return;
    }

    setProcessing(true);
    const result = await processPayment({
      student_id: student.id,
      items: cart,
      payment_method: paymentMethod,
      total,
    });

    if (result.success) {
      toast({ title: 'Sucesso!', description: result.message });
      onClear();
      onSuccess();
    } else {
      toast({ title: 'Erro!', description: result.message, variant: 'destructive' });
    }

    setProcessing(false);
  };

  if (!student) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 text-center text-muted-foreground">
        <Receipt className="h-16 w-16 mb-4" />
        <p className="font-semibold">Nenhum cliente selecionado</p>
        <p className="text-sm">Selecione um aluno para ver seus débitos e iniciar um pagamento.</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <h3 className="font-semibold text-lg">Detalhes do Pagamento</h3>
      </div>

      <ScrollArea className="flex-grow">
        <div className="p-4 space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold uppercase text-muted-foreground">Cobranças pendentes</h4>
              {loadingDebts && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
            </div>
            {!loadingDebts && pendingPayments.length === 0 && (
              <div className="rounded-md border border-dashed p-4 text-sm text-muted-foreground">
                Nenhuma cobrança pendente para este aluno.
              </div>
            )}
            {pendingPayments.map((payment) => {
              const inCart = cart.some((item) => item.id === payment.id);
              return (
                <div key={payment.id} className="rounded-lg border p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <p className="text-sm font-semibold leading-tight">{payment.description}</p>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                        <span>Vencimento: {formatDate(payment.due_date)}</span>
                        <span>{formatCurrency(payment.amount || 0)}</span>
                      </div>
                      <Badge variant={statusVariant(payment.status)}>
                        {statusLabels[payment.status || 'pendente'] || 'Pendente'}
                      </Badge>
                    </div>
                    <Button
                      size="sm"
                      variant={inCart ? 'secondary' : 'outline'}
                      onClick={() => handleTogglePendingPayment(payment.id)}
                      disabled={processing}
                    >
                      {inCart ? 'Remover' : 'Adicionar'}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold uppercase text-muted-foreground">Itens selecionados</h4>
              <Badge variant="secondary">{cart.length}</Badge>
            </div>
            {cart.length === 0 ? (
              <div className="rounded-md border border-dashed p-4 text-sm text-muted-foreground">
                Nenhum item selecionado no momento.
              </div>
            ) : (
              cart.map((item, index) => (
                <div key={item.id || `avulso-${index}`} className="flex items-center gap-2">
                  <div className="flex-grow space-y-2">
                    <Input
                      value={item.description}
                      onChange={(event) => handleUpdateCartItem(index, 'description', event.target.value)}
                      className="h-8 text-sm"
                      disabled={!!item.id}
                    />
                    <Input
                      type="number"
                      value={item.amount}
                      onChange={(event) => handleUpdateCartItem(index, 'amount', event.target.value)}
                      className="h-8 text-sm font-semibold"
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:text-red-600"
                    onClick={() => handleRemoveFromCart(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))
            )}
            <Button variant="outline" className="w-full" onClick={handleAddAvulso}>
              <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Item Avulso
            </Button>
          </div>
        </div>
      </ScrollArea>

      <div className="p-4 border-t space-y-4 bg-secondary/50">
        <div className="flex justify-between items-center font-bold text-xl">
          <span>Total</span>
          <span>{formatCurrency(total)}</span>
        </div>
        <Select onValueChange={setPaymentMethod} value={paymentMethod}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione o método de pagamento" />
          </SelectTrigger>
          <SelectContent>
            {paymentMethods.map((method) => (
              <SelectItem key={method} value={method}>
                {method}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          className="w-full"
          size="lg"
          disabled={processing || cart.length === 0 || !paymentMethod}
          onClick={handleProcessPayment}
        >
          {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {processing ? 'Processando...' : `Finalizar Pagamento (${formatCurrency(total)})`}
        </Button>
      </div>
    </div>
  );
}
