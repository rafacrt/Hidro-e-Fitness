import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import UsersTable from './users-table';
import { AddUserDialog } from './add-user-dialog';
import type { Database } from '@/lib/database.types';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface UserManagementProps {
  users: Profile[];
  currentUserRole?: string | null;
}

export default function UserManagement({ users, currentUserRole }: UserManagementProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
            <CardTitle>Gerenciamento de Usuários</CardTitle>
            <CardDescription>Adicione, edite ou remova usuários do sistema.</CardDescription>
        </div>
        <AddUserDialog>
            <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Novo Usuário
            </Button>
        </AddUserDialog>
      </CardHeader>
      <CardContent>
        <UsersTable users={users} currentUserRole={currentUserRole} />
      </CardContent>
    </Card>
  );
}
