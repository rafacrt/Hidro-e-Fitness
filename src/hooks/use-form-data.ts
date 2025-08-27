
'use client';

import * as React from 'react';
import { getStudents } from '@/app/alunos/actions';
import { getInstructorsForForm, getModalitiesForForm } from '@/app/turmas/actions';
import type { Database } from '@/lib/database.types';

type Student = Pick<Database['public']['Tables']['students']['Row'], 'id' | 'name'>;
type Instructor = Pick<Database['public']['Tables']['instructors']['Row'], 'id' | 'name'>;
type Modality = Pick<Database['public']['Tables']['modalities']['Row'], 'id' | 'name'>;

interface UseFormDataProps {
  fetchStudents?: boolean;
  fetchInstructors?: boolean;
  fetchModalities?: boolean;
  autoLoad?: boolean; // If true, fetches data automatically based on fetch flags
}

interface FormDataState {
  students: Student[];
  instructors: Instructor[];
  modalities: Modality[];
  loading: {
    students: boolean;
    instructors: boolean;
    modalities: boolean;
  };
  loadData: () => Promise<void>;
}

export function useFormData({
  fetchStudents = false,
  fetchInstructors = false,
  fetchModalities = false,
  autoLoad = false,
}: UseFormDataProps): FormDataState {
  const [students, setStudents] = React.useState<Student[]>([]);
  const [instructors, setInstructors] = React.useState<Instructor[]>([]);
  const [modalities, setModalities] = React.useState<Modality[]>([]);
  const [loading, setLoading] = React.useState({
    students: false,
    instructors: false,
    modalities: false,
  });

  const loadData = React.useCallback(async () => {
    const promises = [];
    setLoading(prev => ({
      students: fetchStudents ? true : prev.students,
      instructors: fetchInstructors ? true : prev.instructors,
      modalities: fetchModalities ? true : prev.modalities,
    }));

    if (fetchStudents) {
      promises.push(
        getStudents().then(data => setStudents(data as Student[])).catch(() => setStudents([]))
      );
    }
    if (fetchInstructors) {
      promises.push(
        getInstructorsForForm().then(setInstructors).catch(() => setInstructors([]))
      );
    }
    if (fetchModalities) {
      promises.push(
        getModalitiesForForm().then(setModalities).catch(() => setModalities([]))
      );
    }

    await Promise.all(promises);

    setLoading({
      students: false,
      instructors: false,
      modalities: false,
    });
  }, [fetchStudents, fetchInstructors, fetchModalities]);

  React.useEffect(() => {
    if (autoLoad) {
      loadData();
    }
  }, [autoLoad, loadData]);

  return { students, instructors, modalities, loading, loadData };
}
