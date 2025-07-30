'use client';

import * as React from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Camera, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { uploadAvatar } from '@/app/configuracoes/actions';
import { updatePassword } from '@/app/auth/actions';
import Image from 'next/image';

const updatePasswordSchema = z.object({
    password: z.string().min(6, 'A nova senha deve ter pelo menos 6 caracteres.'),
});

type UpdatePasswordFormValues = z.infer<typeof updatePasswordSchema>;

export default function ProfileSettings() {
  const { toast } = useToast();
  const [avatarUrl, setAvatarUrl] = React.useState<string | null>(null);
  const [isUploading, setIsUploading] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const form = useForm<UpdatePasswordFormValues>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      password: '',
    },
  });

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('avatar', file);
    const result = await uploadAvatar(formData);
    setIsUploading(false);

    if (result.success && result.avatarUrl) {
      setAvatarUrl(result.avatarUrl);
      toast({
        title: 'Sucesso!',
        description: result.message,
      });
    } else {
      toast({
        title: 'Erro!',
        description: result.message,
        variant: 'destructive',
      });
    }
  };

  const onPasswordSubmit = async (data: UpdatePasswordFormValues) => {
    const result = await updatePassword(data);
    if (result.success) {
      toast({
        title: 'Sucesso!',
        description: result.message,
      });
      form.reset();
    } else {
      toast({
        title: 'Erro!',
        description: result.message,
        variant: 'destructive',
      });
    }
  };


  return (
    <Card className="overflow-hidden">
        <div className="h-24 bg-secondary" />
        <CardHeader className="items-center text-center p-6 pt-0">
            <div className="relative -mt-12">
                <Avatar className="h-24 w-24 border-4 border-background">
                <Image src={avatarUrl || 'https://placehold.co/96x96.png'} alt="Admin's avatar" width={96} height={96} className="object-cover" data-ai-hint="person portrait" />
                <AvatarFallback>AD</AvatarFallback>
                </Avatar>
                <Button size="icon" className="absolute bottom-0 right-0 rounded-full h-8 w-8" onClick={handleAvatarClick} disabled={isUploading}>
                    {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
                </Button>
                 <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/png, image/jpeg, image/gif"
                    disabled={isUploading}
                />
            </div>
            <CardTitle>Admin Sistema</CardTitle>
            <CardDescription>admin@hidrofitness.com</CardDescription>
        </CardHeader>
      <CardContent className="space-y-6 px-6 pb-6">
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onPasswordSubmit)} className="space-y-4">
                <h4 className="font-medium text-center">Alterar Senha</h4>
                 <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Nova Senha</FormLabel>
                        <FormControl>
                            <Input id="new-password" type="password" {...field} autoComplete="new-password" />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                 />
                <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Salvar Nova Senha
                </Button>
            </form>
        </Form>
      </CardContent>
    </Card>
  );
}
