'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { Database } from '@/lib/database.types';
import { User } from 'lucide-react';
import { StudentProfileModal } from '@/components/alunos/student-profile-modal';

type Student = Database['public']['Tables']['students']['Row'];

interface ActiveStudentsProps {
  students: Student[];
}

export default function ActiveStudents({ students }: ActiveStudentsProps) {
  const [selectedStudent, setSelectedStudent] = React.useState<Student | null>(null);
  const [modalOpen, setModalOpen] = React.useState(false);

  const handleStudentClick = (student: Student) => {
    setSelectedStudent(student);
    setModalOpen(true);
  };
  if (students.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Alunos Ativos</CardTitle>
          <CardDescription>Últimos alunos cadastrados com status ativo</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            Nenhum aluno ativo encontrado
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Alunos Ativos</CardTitle>
        <CardDescription>Últimos alunos cadastrados com status ativo</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {students.map((student) => (
            <button
              key={student.id}
              onClick={() => handleStudentClick(student)}
              className="w-full flex items-center gap-3 p-3 rounded-lg border hover:bg-accent transition-colors text-left"
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-cyan-100 flex items-center justify-center">
                <User className="w-5 h-5 text-cyan-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{student.name}</p>
                <p className="text-sm text-muted-foreground truncate">{student.email}</p>
              </div>
              <div className="flex-shrink-0 text-sm text-muted-foreground">
                {student.phone}
              </div>
            </button>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t">
          <a
            href="/alunos"
            className="text-sm text-primary hover:underline font-medium"
          >
            Ver todos os alunos →
          </a>
        </div>
      </CardContent>
      <StudentProfileModal
        student={selectedStudent}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </Card>
  );
}
