
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import UsersTable from './users-table';
import { AddUserDialog } from './add-user-dialog';

export default function UserManagement() {
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
        <UsersTable />
      </CardContent>
    </Card>
  );
}
