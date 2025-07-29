'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Icons } from '../icons';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { login } from '@/app/auth/actions';

const loginFormSchema = z.object({
  email: z.string().email('E-mail inválido.'),
  password: z.string().min(1, 'A senha é obrigatória.'),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

export default function LoginForm() {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  // Evitar problemas de hidratação
  React.useEffect(() => {
    setMounted(true);
  }, []);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    
    try {
      console.log('=== TENTATIVA DE LOGIN ===');
      console.log('E-mail:', data.email);
      
      // Toast de início (removido para evitar conflito)
      
      const result = await login(data);
      
      console.log('=== RESULTADO DO LOGIN ===');
      console.log('Result:', result);
      
      if (result?.error) {
        console.error('❌ Erro no login:', result.error);
        
        // Alert específico baseado no erro
        let errorMessage = result.error.message;
        let errorTitle = "Erro no Login";
        
        if (errorMessage.includes("Invalid login credentials")) {
          errorTitle = "Credenciais Inválidas";
          errorMessage = "E-mail ou senha incorretos. Verifique seus dados e tente novamente.";
        } else if (errorMessage.includes("Email not confirmed")) {
          errorTitle = "E-mail Não Confirmado";
          errorMessage = "Verifique seu e-mail e confirme sua conta antes de fazer login.";
        } else if (errorMessage.includes("Too many requests")) {
          errorTitle = "Muitas Tentativas";
          errorMessage = "Aguarde alguns minutos antes de tentar novamente.";
        }
        
        // Toast de erro
        toast({
          title: errorTitle,
          description: errorMessage,
          variant: 'destructive',
        });
        
        setIsLoading(false);
        
      } else if (result?.success) {
        console.log('✅ Login bem-sucedido!');
        
        // Toast de sucesso
        toast({
          title: "Login realizado com sucesso!",
          description: "Redirecionando para o dashboard...",
        });
        
        // MUDANÇA: Redirect no client-side em vez de server-side
        setTimeout(() => {
          router.push('/dashboard');
          router.refresh(); // Força refresh para atualizar o estado de autenticação
        }, 1000);
        
      } else {
        console.error('❌ Resposta inesperada:', result);
        toast({
          title: "Erro Inesperado",
          description: "Resposta inesperada do servidor. Tente novamente.",
          variant: 'destructive',
        });
        setIsLoading(false);
      }
    } catch (error) {
      console.error('💥 Erro inesperado no login:', error);
      
      toast({
        title: "Erro Inesperado",
        description: "Ocorreu um erro inesperado. Tente novamente.",
        variant: 'destructive',
      });
      
      setIsLoading(false);
    }
  };

  // Evitar renderização no servidor para componentes que dependem do client
  if (!mounted) {
    return (
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Icons.Logo className="h-12 w-12 text-primary" />
          </div>
          <CardTitle>Carregando...</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <Icons.Logo className="h-12 w-12 text-primary" />
        </div>
        <CardTitle>Bem-vindo ao Hidro Fitness</CardTitle>
        <CardDescription>
          Acesse sua conta para gerenciar a academia.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="seu@email.com"
                      {...field}
                      disabled={isLoading}
                      autoComplete="email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      {...field}
                      disabled={isLoading}
                      autoComplete="current-password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <div className="text-center space-y-2">
          <p className="text-xs text-muted-foreground">
            Não tem uma conta?{' '}
            <Link href="/register" className="font-medium text-primary hover:underline">
              Cadastre-se
            </Link>
          </p>
          
          {/* Dados de teste para desenvolvimento */}
          {process.env.NODE_ENV === 'development' && (
            <div className="text-xs text-muted-foreground bg-muted p-2 rounded">
              <strong>Para teste:</strong><br />
              E-mail: tecnorafa12@gmail.com<br />
              Senha: sua senha
            </div>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}