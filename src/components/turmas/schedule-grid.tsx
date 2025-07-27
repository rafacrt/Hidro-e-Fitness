
'use client';

import * as React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Users, MapPin } from 'lucide-react';
import { ScheduleLegend } from './schedule-legend';
import { addDays, subDays, startOfWeek, endOfWeek, format, eachDayOfInterval } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

const times = Array.from({ length: 15 }, (_, i) => `${String(i + 7).padStart(2, '0')}:00`);

const classes = [
  { day: 'Segunda', start: '08:00', end: '09:00', title: 'Natação Adulto - Iniciante', instructor: 'Prof. Ana Silva', students: '12/15', location: 'Piscina 1', color: 'bg-blue-500', textColor: 'text-white' },
  { day: 'Segunda', start: '09:00', end: '10:00', title: 'Hidroginástica', instructor: 'Prof. Carlos Santos', students: '18/20', location: 'Piscina 2', color: 'bg-green-500', textColor: 'text-white' },
  { day: 'Segunda', start: '10:00', end: '11:00', title: 'Natação Infantil', instructor: 'Prof. Marina Costa', students: '8/10', location: 'Piscina 1', color: 'bg-yellow-500', textColor: 'text-white' },
  { day: 'Segunda', start: '14:00', end: '15:00', title: 'Aqua Aeróbica', instructor: 'Prof. Roberto Lima', students: '11/15', location: 'Piscina 2', color: 'bg-purple-500', textColor: 'text-white' },
  { day: 'Terça', start: '08:00', end: '09:00', title: 'Natação Adulto - Intermediário', instructor: 'Prof. Ana Silva', students: '14/15', location: 'Piscina 1', color: 'bg-blue-500', textColor: 'text-white' },
  { day: 'Terça', start: '09:00', end: '10:00', title: 'Hidroginástica', instructor: 'Prof. Carlos Santos', students: '20/20', location: 'Piscina 2', color: 'bg-green-500', textColor: 'text-white' },
  { day: 'Quarta', start: '07:00', end: '08:30', title: 'Natação Adulto - Avançado', instructor: 'Prof. Roberto Lima', students: '10/10', location: 'Piscina 1', color: 'bg-red-500', textColor: 'text-white' },
  { day: 'Sexta', start: '15:30', end: '17:00', title: 'Natação Infantil', instructor: 'Prof. Marina Costa', students: '9/10', location: 'Piscina 1', color: 'bg-yellow-500', textColor: 'text-white' },
];

const dayNames = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];

export default function ScheduleGrid() {
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
    const totalMinutes = (hour - 7) * 60 + minute;
    return (totalMinutes / 30) * 2 + 2; // Each hour has 4 slots of 15min, starts at row 2
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

          <div className="relative grid grid-cols-[auto_repeat(7,1fr)] overflow-auto">
            {/* Header Vazio */}
            <div className="sticky top-0 bg-background z-20 col-start-1 row-start-1"></div>
            
            {/* Header Dias da Semana */}
            {weekDates.map((date, i) => (
              <div key={i} className="text-center sticky top-0 bg-background z-20 py-2 border-b col-start-auto">
                <p className="font-semibold capitalize">{format(date, 'EEE', { locale: ptBR })}</p>
                <p className="text-sm text-muted-foreground">{format(date, 'dd/MM')}</p>
              </div>
            ))}
            
            {/* Coluna de Horários e Linhas da Grade */}
            <div className="col-start-1 col-end-9 row-start-1 grid grid-cols-[auto_repeat(7,1fr)] grid-rows-[auto_repeat(60,15px)] -z-10">
              {/* Coluna de Horários */}
              <div className="col-start-1 row-start-2 row-end-[-1] grid grid-rows-subgrid">
                 {times.map((time) => (
                    <div key={time} className="row-start-auto row-span-4 text-right pr-4 text-sm text-muted-foreground -mt-2">
                       {time}
                    </div>
                ))}
              </div>

               {/* Linhas da Grade */}
              <div className="col-start-2 col-end-[-1] row-start-2 row-end-[-1] grid grid-cols-subgrid grid-rows-subgrid">
                {Array.from({ length: 7 * 60 }).map((_, i) => (
                   <div key={i} className={cn(
                       "border-r border-b",
                       (i + 1) % 4 === 0 ? "border-b-zinc-300" : "border-b-zinc-200",
                       (i + 1) % (7 * 4) === 0 ? "border-r-transparent" : "",
                   )}></div>
                ))}
              </div>

                {/* Eventos da Agenda */}
                {classes.map((cls, index) => {
                    const colStart = dayNames.indexOf(cls.day) + 2;
                    const rowStart = calculateRow(cls.start);
                    const rowEnd = calculateRow(cls.end);

                    if (colStart < 2) return null;

                    return (
                        <div
                        key={index}
                        className={cn(
                            `p-2 rounded-lg shadow-md flex flex-col text-xs z-10 m-px overflow-hidden`,
                            cls.color,
                            cls.textColor
                        )}
                        style={{
                            gridColumnStart: colStart,
                            gridRowStart: rowStart,
                            gridRowEnd: rowEnd,
                        }}
                        >
                            <p className="font-semibold">{cls.title}</p>
                            <p className="text-xs opacity-90">{cls.instructor}</p>
                            <div className="flex-grow"></div>
                            <div className="flex items-center mt-1">
                                <Users className="h-3 w-3 mr-1" /> {cls.students}
                            </div>
                            <div className="flex items-center">
                                <MapPin className="h-3 w-3 mr-1" /> {cls.location}
                            </div>
                        </div>
                    );
                })}

            </div>
          </div>
        </CardContent>
      </Card>
      <ScheduleLegend />
    </div>
  );
}
