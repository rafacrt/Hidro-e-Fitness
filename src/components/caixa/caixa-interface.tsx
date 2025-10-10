
'use client';

import * as React from 'react';
import type { Database } from '@/lib/database.types';
import StudentSearch from './student-search';
import PaymentDetails from './payment-details';

type Student = Database['public']['Tables']['students']['Row'];
type Payment = Database['public']['Tables']['payments']['Row'];

interface CaixaInterfaceProps {
  students: Student[];
  fetchStudentDebts: (studentId: string) => Promise<Payment[]>;
  onSuccess: () => void;
  preSelectedStudentId?: string | null;
}

export default function CaixaInterface({ students, fetchStudentDebts, onSuccess, preSelectedStudentId }: CaixaInterfaceProps) {
  const [selectedStudent, setSelectedStudent] = React.useState<Student | null>(null);

  // Auto-select student if preSelectedStudentId is provided
  React.useEffect(() => {
    if (preSelectedStudentId && students.length > 0) {
      const student = students.find(s => s.id === preSelectedStudentId);
      if (student) {
        setSelectedStudent(student);
      }
    }
  }, [preSelectedStudentId, students]);

  const handleSelectStudent = (student: Student | null) => {
    setSelectedStudent(student);
  };
  
  const handleClear = () => {
    setSelectedStudent(null);
  };
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-10rem)]">
        <div className="lg:col-span-2 bg-card rounded-lg shadow-sm">
            <StudentSearch 
                students={students} 
                selectedStudent={selectedStudent}
                onSelectStudent={handleSelectStudent}
            />
        </div>
        <div className="lg:col-span-1 bg-card rounded-lg shadow-sm">
            <PaymentDetails
                student={selectedStudent}
                fetchStudentDebts={fetchStudentDebts}
                onClear={handleClear}
                onSuccess={onSuccess}
            />
        </div>
    </div>
  );
}
