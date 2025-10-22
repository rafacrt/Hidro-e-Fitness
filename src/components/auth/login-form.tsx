
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
// import { login } from '@/app/auth/actions'; // migrated to internal API
import type { Database } from '@/lib/database.types';
import Image from 'next/image';

type AcademySettings = Database['public']['Tables']['academy_settings']['Row'];

interface LoginFormProps {
    settings: AcademySettings | null;
}

const loginFormSchema = z.object({
  email: z.string().email('E-mail inválido.'),
  password: z.string().min(1, 'A senha é obrigatória.'),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

export default function LoginForm({ settings }: LoginFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const logoUrl = settings?.logo_url || '/logo/logo.png';
  
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
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email, password: data.password }),
      });

      if (!res.ok) {
        const payload = await res.json().catch(() => ({ error: 'Falha no login' }));
        const errMsg = typeof payload.error === 'string' ? payload.error : (payload.error?.message || 'E-mail ou senha incorretos.');
        toast({ title: 'Erro no Login', description: errMsg, variant: 'destructive' });
        setIsLoading(false);
        return;
      }

      toast({ title: 'Login realizado com sucesso!', description: 'Redirecionando para o dashboard...' });
      setTimeout(() => {
        router.push('/dashboard');
        router.refresh();
      }, 500);
    } catch (error) {
      toast({ title: 'Erro Inesperado', description: 'Ocorreu um erro inesperado. Tente novamente.', variant: 'destructive' });
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <Image src={logoUrl} alt="Logo da Academia" width={48} height={48} className="object-contain" />
        </div>
        <CardTitle>Bem-vindo ao {settings?.name || 'Hidro Fitness'}</CardTitle>
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
                  <div className="flex justify-between items-center">
                    <FormLabel>Senha</FormLabel>
                    <Link href="/forgot-password" className="text-xs text-primary hover:underline">
                        Esqueceu a senha?
                    </Link>
                  </div>
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
          {process.env.NODE_ENV === 'development' && (
            <div className="text-xs text-muted-foreground bg-muted p-2 rounded">
              <strong>Para teste:</strong><br />
              E-mail: admin@example.com<br />
              Senha: admin123
            </div>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
