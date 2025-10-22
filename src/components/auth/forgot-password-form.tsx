
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
import { Loader2, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { forgotPassword } from '@/app/auth/actions';
import type { Database } from '@/lib/database.types';
import Image from 'next/image';

type AcademySettings = Database['public']['Tables']['academy_settings']['Row'];

interface ForgotPasswordFormProps {
    settings: AcademySettings | null;
}

const forgotPasswordSchema = z.object({
  email: z.string().email('E-mail inválido.'),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordForm({ settings }: ForgotPasswordFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);
  const logoUrl = settings?.logo_url || '/logo/logo.png';

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    setIsLoading(true);
    const result = await forgotPassword(data);

    if (result.success) {
      toast({
        title: 'E-mail Enviado!',
        description: 'Verifique sua caixa de entrada para redefinir sua senha.',
      });
      setSubmitted(true);
    } else {
      toast({
        title: 'Erro',
        description: result.message,
        variant: 'destructive',
      });
    }
    setIsLoading(false);
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <Image src={logoUrl} alt="Logo da Academia" width={48} height={48} className="object-contain" />
        </div>
        <CardTitle>Esqueceu a Senha?</CardTitle>
        <CardDescription>
          {submitted
            ? 'Enviamos um link para o seu e-mail. Verifique sua caixa de entrada e spam.'
            : 'Digite seu e-mail para receber um link de redefinição de senha.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!submitted && (
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
                <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? 'Enviando...' : 'Enviar Link de Redefinição'}
                </Button>
            </form>
            </Form>
        )}
      </CardContent>
      <CardFooter>
        <Button variant="link" className="w-full" asChild>
            <Link href="/login">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar para o Login
            </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
