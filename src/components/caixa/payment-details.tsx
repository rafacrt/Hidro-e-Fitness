
'use client';

import * as React from 'react';
import type { Database } from '@/lib/database.types';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
import { AlertCircle, Loader2, PlusCircle, Receipt, ShoppingCart, Trash2, UserPlus } from 'lucide-react';
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

export default function PaymentDetails({ student, fetchStudentDebts, onClear, onSuccess }: PaymentDetailsProps) {
  const [pendingPayments, setPendingPayments] = React.useState<Payment[]>([]);
  const [loadingDebts, setLoadingDebts] = React.useState(false);
  const [cart, setCart] = React.useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = React.useState('');
  const [processing, setProcessing] = React.useState(false);
  const { toast } = useToast();

  React.useEffect(() => {
    if (student) {
      setLoadingDebts(true);
      fetchStudentDebts(student.id).then(data => {
        setPendingPayments(data);
        // Automatically add all pending payments to cart
        const pendingCartItems = data.map(p => ({
            id: p.id,
            description: p.description,
            amount: p.amount || 0,
            type: 'receita',
            category: p.category || 'Mensalidade'
        }));
        setCart(pendingCartItems);
        setLoadingDebts(false);
      });
    } else {
      setPendingPayments([]);
      setCart([]);
      setPaymentMethod('');
    }
  }, [student, fetchStudentDebts]);
  
  const handleRemoveFromCart = (index: number) => {
    setCart(prev => prev.filter((_, i) => i !== index));
  };
  
  const handleAddAvulso = () => {
    setCart(prev => [...prev, { description: 'Item avulso', amount: 0, type: 'receita', category: 'Venda Avulsa' }]);
  }
  
  const handleUpdateCartItem = (index: number, field: 'description' | 'amount', value: string | number) => {
    setCart(prev => {
        const newCart = [...prev];
        if (field === 'amount') {
            newCart[index][field] = Number(value) || 0;
        } else {
            newCart[index][field] = String(value);
        }
        return newCart;
    });
  }

  const total = React.useMemo(() => cart.reduce((sum, item) => sum + item.amount, 0), [cart]);

  const handleProcessPayment = async () => {
    if (!student || cart.length === 0 || !paymentMethod) {
        toast({ title: 'Dados incompletos', description: 'Selecione um aluno, itens e um método de pagamento.', variant: 'destructive'});
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
        onClear(); // Clear student selection and cart
        onSuccess(); // Re-fetch initial data if needed
    } else {
        toast({ title: 'Erro!', description: result.message, variant: 'destructive'});
    }
    setProcessing(false);
  }

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
            {cart.map((item, index) => (
                <div key={item.id || `avulso-${index}`} className="flex items-center gap-2">
                    <div className="flex-grow space-y-1">
                        <Input 
                            value={item.description}
                            onChange={(e) => handleUpdateCartItem(index, 'description', e.target.value)}
                            className="h-8 text-sm"
                            disabled={!!item.id} // Don't allow editing description of existing debts
                        />
                         <Input 
                            type="number"
                            value={item.amount}
                            onChange={(e) => handleUpdateCartItem(index, 'amount', e.target.value)}
                            className="h-8 text-sm font-semibold"
                        />
                    </div>
                    <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600" onClick={() => handleRemoveFromCart(index)}>
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            ))}
            <Button variant="outline" className="w-full" onClick={handleAddAvulso}>
                <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Item Avulso
            </Button>
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
                {paymentMethods.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
            </SelectContent>
        </Select>
        <Button className="w-full" size="lg" disabled={processing || cart.length === 0 || !paymentMethod} onClick={handleProcessPayment}>
          {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {processing ? 'Processando...' : `Finalizar Pagamento (${formatCurrency(total)})`}
        </Button>
      </div>
    </div>
  );
}
