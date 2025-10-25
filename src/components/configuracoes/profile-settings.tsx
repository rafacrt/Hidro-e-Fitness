'use client';

import * as React from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Camera, Loader2, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { uploadAvatar } from '@/app/configuracoes/actions';
import { updatePassword } from '@/app/auth/actions';
import Image from 'next/image';
import type { Database } from '@/lib/database.types';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface ProfileSettingsProps {
    userProfile: Profile | null;
}

const updatePasswordSchema = z.object({
    password: z.string().min(6, 'A nova senha deve ter pelo menos 6 caracteres.'),
});

type UpdatePasswordFormValues = z.infer<typeof updatePasswordSchema>;

export default function ProfileSettings({ userProfile }: ProfileSettingsProps) {
  const { toast } = useToast();
  const [avatarUrl, setAvatarUrl] = React.useState<string | null>(userProfile?.avatar_url || null);
  const [isUploading, setIsUploading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const form = useForm<UpdatePasswordFormValues>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: { password: '' },
  });

  const onPasswordSubmit = async (data: UpdatePasswordFormValues) => {
    const result = await updatePassword(data);
    if (result.success) {
      toast({ title: 'Sucesso!', description: result.message });
      form.reset();
    } else {
      toast({ title: 'Erro!', description: result.message, variant: 'destructive' });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Meu Perfil</CardTitle>
        <CardDescription>Atualize seu avatar e senha.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            {avatarUrl ? (
              <img src={avatarUrl} alt={userProfile?.full_name || 'Avatar'} className="h-full w-full object-cover" />
            ) : (
              <AvatarFallback>{(userProfile?.full_name || '??').substring(0, 2)}</AvatarFallback>
            )}
          </Avatar>
          <div>
            <p className="font-medium">{userProfile?.full_name || 'Usuário'}</p>
            <p className="text-sm text-muted-foreground">{userProfile?.email}</p>
            <div className="mt-2">
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                setIsUploading(true);
                const fd = new FormData();
                fd.append('avatar', file);
                const result = await uploadAvatar(fd);
                setIsUploading(false);
                if (result.success) {
                  setAvatarUrl(result.avatarUrl);
                }
              }} />
              <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
                {isUploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Camera className="mr-2 h-4 w-4" />
                Alterar Avatar
              </Button>
            </div>
          </div>
        </div>

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
                    <div className="relative">
                      <Input id="new-password" type={showPassword ? 'text' : 'password'} {...field} autoComplete="new-password" />
                      <button
                        type="button"
                        aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        tabIndex={-1}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
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
