'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
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
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const loginFormSchema = z.object({
  email: z.string().email('E-mail inválido.'),
  password: z.string().min(1, 'A senha é obrigatória.'),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

export default function LoginForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);

  // Check for dev mode
  React.useEffect(() => {
    if (process.env.NEXT_PUBLIC_DEV_MODE === 'true') {
      setIsLoading(true);
      toast({
        title: "Modo de Desenvolvimento Ativado",
        description: "Login automático. Redirecionando para o dashboard...",
      });
      setTimeout(() => {
        router.push('/dashboard');
      }, 1000);
    }
  }, [router, toast]);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    setIsLoading(true);
    console.log(data);
    // Simulate API call
    setTimeout(() => {
      // For this example, we'll just assume login is successful
      // In a real app, you would check credentials here.
       toast({
        title: "Login bem-sucedido!",
        description: "Redirecionando para o dashboard...",
      });
      router.push('/dashboard');
    }, 1500);
  };

  if (process.env.NEXT_PUBLIC_DEV_MODE === 'true') {
    return (
       <div className="flex flex-col items-center justify-center text-center">
        <Loader2 className="h-12 w-12 animate-spin mb-4 text-primary" />
        <h3 className="text-lg font-semibold">Modo de Desenvolvimento</h3>
        <p className="text-sm text-muted-foreground">Realizando login automático...</p>
      </div>
    )
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
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Entrar
            </Button>
          </form>
        </Form>
      </CardContent>
       <CardFooter className="flex flex-col gap-4">
        <p className="text-xs text-muted-foreground">
          Não tem uma conta?{' '}
          <Link href="/register" className="font-medium text-primary hover:underline">
            Cadastre-se
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
