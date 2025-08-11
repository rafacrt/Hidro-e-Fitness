
'use client';

import * as React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Users, MapPin } from 'lucide-react';
import { ScheduleLegend } from './schedule-legend';
import { addDays, subDays, startOfWeek, endOfWeek, format, eachDayOfInterval, getDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import type { Database } from '@/lib/database.types';

type ClassRow = Database['public']['Tables']['classes']['Row'];
type Instructor = Database['public']['Tables']['instructors']['Row'];
type Modality = Database['public']['Tables']['modalities']['Row'];
type ClassData = ClassRow & { instructors: Pick<Instructor, 'name'> | null } & { modalities: Pick<Modality, 'name'> | null };

interface ScheduleGridProps {
  classes: ClassData[];
}

const times = Array.from({ length: 15 }, (_, i) => `${String(i + 7).padStart(2, '0')}:00`);

const dayNameMap: { [key: string]: number } = {
  'Domingo': 0,
  'Segunda': 1,
  'Terça': 2,
  'Quarta': 3,
  'Quinta': 4,
  'Sexta': 5,
  'Sábado': 6,
};

const modalityColors: { [key: string]: string } = {
  'Natação Adulto': 'bg-blue-500 text-white',
  'Hidroginástica': 'bg-green-500 text-white',
  'Natação Infantil': 'bg-yellow-500 text-white',
  'Aqua Aeróbica': 'bg-purple-500 text-white',
  'Natação Avançado': 'bg-red-500 text-white',
  'default': 'bg-zinc-500 text-white',
};

const getModalityColor = (modalityName: string | null | undefined) => {
  if (!modalityName) return modalityColors.default;
  for (const key in modalityColors) {
    if (modalityName.includes(key)) {
      return modalityColors[key];
    }
  }
  return modalityColors.default;
};


export default function ScheduleGrid({ classes }: ScheduleGridProps) {
  const [currentDate, setCurrentDate] = React.useState(new Date());

  const startOfWeekDate = startOfWeek(currentDate, { weekStartsOn: 1 });
  const endOfWeekDate = endOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDates = eachDayOfInterval({ start: startOfWeekDate, end: endOfWeekDate });

  const handlePrevWeek = () => {
    setCurrentDate(subDays(currentDate, 7));
  };

  const handleNextWeek = () => {
    setCurrentDate(addDays(currentDate, 7));
  };

  const calculateRow = (time: string) => {
    const [hour, minute] = time.split(':').map(Number);
    const totalMinutes = (hour * 60 + minute) - (7 * 60);
    return (totalMinutes / 15) + 1;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="flex justify-between items-center">
            <Button variant="outline" onClick={handlePrevWeek}>
              <ChevronLeft className="h-4 w-4 mr-2" />
              Semana Anterior
            </Button>
            <div className="text-center">
              <p className="font-semibold text-lg capitalize">
                {format(startOfWeekDate, "d 'de' MMMM", { locale: ptBR })} - {format(endOfWeekDate, "d 'de' MMMM 'de' yyyy", { locale: ptBR })}
              </p>
              <p className="text-sm text-muted-foreground">Grade de Horários</p>
            </div>
            <Button variant="outline" onClick={handleNextWeek}>
              Próxima Semana
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>

          <div className="overflow-auto" style={{ maxHeight: '70vh' }}>
            <div className="relative grid grid-cols-[auto_repeat(7,1fr)]">
              {/* Header Vazio */}
              <div className="sticky top-0 bg-background z-20 col-start-1 row-start-1"></div>
              
              {/* Header Dias da Semana */}
              {weekDates.map((date, i) => (
                <div key={i} className="text-center sticky top-0 bg-background z-20 py-2 border-b col-start-auto">
                  <p className="font-semibold capitalize">{format(date, 'EEE', { locale: ptBR })}</p>
                  <p className="text-sm text-muted-foreground">{format(date, 'dd/MM')}</p>
                </div>
              ))}

              {/* Coluna de Horários */}
              <div className="col-start-1 row-start-2 grid divide-y">
                {times.map((time) => (
                  <div key={time} className="h-24 flex justify-end">
                    <span className="text-sm text-muted-foreground -translate-y-3 pr-2">{time}</span>
                  </div>
                ))}
              </div>

              {/* Colunas da Grade */}
              {weekDates.map((date, i) => (
                <div key={i} className="col-start-auto row-start-2 grid divide-y border-l">
                  {times.map((time) => (
                    <div key={time} className="h-24"></div>
                  ))}
                </div>
              ))}
              
              {/* Eventos da Agenda */}
              <div className="col-start-2 col-end-[-1] row-start-2 grid grid-cols-7 grid-rows-[repeat(60,24px)] pointer-events-none">
                 {classes.map((cls) => {
                   return cls.days_of_week.map((day, dayIndex) => {
                      const colStart = dayNameMap[day as keyof typeof dayNameMap];
                      if (colStart === undefined) return null;

                      const rowStart = calculateRow(cls.start_time);
                      const rowEnd = calculateRow(cls.end_time);
                      const colorClasses = getModalityColor(cls.modalities?.name);

                      return (
                          <div
                          key={`${cls.id}-${dayIndex}`}
                          className={cn(
                              `p-2 rounded-lg shadow-md flex flex-col text-xs z-10 m-px overflow-hidden pointer-events-auto`,
                              colorClasses
                          )}
                          style={{
                              gridColumnStart: colStart + 1, // +1 because grid columns are 1-indexed
                              gridRow: `${rowStart} / ${rowEnd}`,
                          }}
                          >
                              <p className="font-semibold">{cls.name}</p>
                              <p className="text-xs opacity-90">{cls.instructors?.name || 'N/A'}</p>
                              <div className="flex-grow"></div>
                              <div className="flex items-center mt-1">
                                  <Users className="h-3 w-3 mr-1" /> 0/{cls.max_students}
                              </div>
                              <div className="flex items-center">
                                  <MapPin className="h-3 w-3 mr-1" /> {cls.location}
                              </div>
                          </div>
                      );
                   })
                })}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <ScheduleLegend />
    </div>
  );
}
