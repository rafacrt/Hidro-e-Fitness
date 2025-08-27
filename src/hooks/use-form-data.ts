
'use client';

import * as React from 'react';
import { useToast } from './use-toast';
import { getStudents } from '@/app/alunos/actions';
import { getInstructorsForForm, getModalitiesForForm } from '@/app/turmas/actions';
import type { Database } from '@/lib/database.types';

type Student = Pick<Database['public']['Tables']['students']['Row'], 'id' | 'name'>;
type Instructor = Pick<Database['public']['Tables']['instructors']['Row'], 'id' | 'name'>;
type Modality = Pick<Database['public']['Tables']['modalities']['Row'], 'id' | 'name'>;

interface UseFormDataConfig {
  fetchStudents?: boolean;
  fetchInstructors?: boolean;
  fetchModalities?: boolean;
  autoLoad?: boolean;
}

export function useFormData({
  fetchStudents = false,
  fetchInstructors = false,
  fetchModalities = false,
  autoLoad = false,
}: UseFormDataConfig) {
  const { toast } = useToast();
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
    if (fetchStudents) {
      setLoading(prev => ({ ...prev, students: true }));
      promises.push(getStudents());
    }
    if (fetchInstructors) {
      setLoading(prev => ({ ...prev, instructors: true }));
      promises.push(getInstructorsForForm());
    }
    if (fetchModalities) {
      setLoading(prev => ({ ...prev, modalities: true }));
      promises.push(getModalitiesForForm());
    }

    try {
      const results = await Promise.all(promises);
      let resultIndex = 0;
      if (fetchStudents) {
        setStudents(results[resultIndex++] as Student[]);
        setLoading(prev => ({ ...prev, students: false }));
      }
      if (fetchInstructors) {
        setInstructors(results[resultIndex++] as Instructor[]);
        setLoading(prev => ({ ...prev, instructors: false }));
      }
      if (fetchModalities) {
        setModalities(results[resultIndex++] as Modality[]);
        setLoading(prev => ({ ...prev, modalities: false }));
      }
    } catch (error) {
      toast({
        title: 'Erro ao carregar dados',
        description: 'Não foi possível buscar os dados necessários para o formulário.',
        variant: 'destructive',
      });
      setLoading({ students: false, instructors: false, modalities: false });
    }
  }, [fetchStudents, fetchInstructors, fetchModalities, toast]);

  React.useEffect(() => {
    if (autoLoad) {
      loadData();
    }
  }, [autoLoad, loadData]);

  return {
    students,
    instructors,
    modalities,
    loading,
    loadData,
  };
}
