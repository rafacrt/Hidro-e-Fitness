import { useState, useEffect } from 'react';
import { getModalities } from '@/app/modalidades/actions';
import { getStudents } from '@/app/alunos/actions';
import { getInstructors } from '@/app/professores/actions';
import { getClasses } from '@/app/turmas/actions';
import type { Database } from '@/lib/database.types';

type Modality = Database['public']['Tables']['modalities']['Row'];
type Student = Database['public']['Tables']['students']['Row'];
type Instructor = Database['public']['Tables']['instructors']['Row'];

interface UseFormDataResult {
  modalities: Modality[];
  students: Student[];
  instructors: Instructor[];
  classes: any[];
  loading: {
    modalities: boolean;
    students: boolean;
    instructors: boolean;
    classes: boolean;
  };
  refetch: {
    modalities: () => Promise<void>;
    students: () => Promise<void>;
    instructors: () => Promise<void>;
    classes: () => Promise<void>;
  };
}

export function useFormData(options?: {
  fetchModalities?: boolean;
  fetchStudents?: boolean;
  fetchInstructors?: boolean;
  fetchClasses?: boolean;
  autoLoad?: boolean;
}): UseFormDataResult {
  const {
    fetchModalities = false,
    fetchStudents = false,
    fetchInstructors = false,
    fetchClasses = false,
    autoLoad = true
  } = options || {};

  const [modalities, setModalities] = useState<Modality[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  
  const [loading, setLoading] = useState({
    modalities: false,
    students: false,
    instructors: false,
    classes: false
  });

  const loadModalities = async () => {
    setLoading(prev => ({ ...prev, modalities: true }));
    try {
      const data = await getModalities();
      setModalities(data);
    } catch (error) {
      console.error('Erro ao carregar modalidades:', error);
    } finally {
      setLoading(prev => ({ ...prev, modalities: false }));
    }
  };

  const loadStudents = async () => {
    setLoading(prev => ({ ...prev, students: true }));
    try {
      const data = await getStudents();
      setStudents(data);
    } catch (error) {
      console.error('Erro ao carregar alunos:', error);
    } finally {
      setLoading(prev => ({ ...prev, students: false }));
    }
  };

  const loadInstructors = async () => {
    setLoading(prev => ({ ...prev, instructors: true }));
    try {
      const data = await getInstructors();
      setInstructors(data);
    } catch (error) {
      console.error('Erro ao carregar professores:', error);
    } finally {
      setLoading(prev => ({ ...prev, instructors: false }));
    }
  };

  const loadClasses = async () => {
    setLoading(prev => ({ ...prev, classes: true }));
    try {
      const data = await getClasses();
      setClasses(data);
    } catch (error) {
      console.error('Erro ao carregar turmas:', error);
    } finally {
      setLoading(prev => ({ ...prev, classes: false }));
    }
  };

  useEffect(() => {
    if (autoLoad) {
      if (fetchModalities) loadModalities();
      if (fetchStudents) loadStudents();
      if (fetchInstructors) loadInstructors();
      if (fetchClasses) loadClasses();
    }
  }, [autoLoad, fetchModalities, fetchStudents, fetchInstructors, fetchClasses]);

  return {
    modalities,
    students,
    instructors,
    classes,
    loading,
    refetch: {
      modalities: loadModalities,
      students: loadStudents,
      instructors: loadInstructors,
      classes: loadClasses
    }
  };
}