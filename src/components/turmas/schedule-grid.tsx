
'use client';

import * as React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Users, MapPin } from 'lucide-react';
import { ScheduleLegend } from './schedule-legend';
import { addDays, subDays, startOfWeek, endOfWeek, format, eachDayOfInterval } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const days = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
const times = Array.from({ length: 16 }, (_, i) => `${String(i + 6).padStart(2, '0')}:00`);

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
  
  const calculatePosition = (time: string) => {
    const [hour, minute] = time.split(':').map(Number);
    return (hour - 6) * 60 + minute;
  };

  const dayNames = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];

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
                {format(startOfWeekDate, 'd \'de\' MMMM', { locale: ptBR })} - {format(endOfWeekDate, 'd \'de\' MMMM \'de\' yyyy', { locale: ptBR })}
              </p>
              <p className="text-sm text-muted-foreground">Grade de Horários</p>
            </div>
            <Button variant="outline" onClick={handleNextWeek}>
              Próxima Semana
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>

          <div className="relative grid grid-cols-[auto_repeat(7,1fr)] grid-rows-[auto_repeat(16,60px)] gap-x-2">
            {/* Header Vazio */}
            <div className="sticky top-0 bg-background z-10"></div>
            {/* Header Dias da Semana */}
            {weekDates.map((date, i) => (
              <div key={i} className="text-center sticky top-0 bg-background z-10 py-2">
                <p className="font-semibold capitalize">{format(date, 'EEE', { locale: ptBR })}</p>
                <p className="text-sm text-muted-foreground">{format(date, 'dd/MM')}</p>
              </div>
            ))}

            {/* Coluna de Horários e Linhas da Grade */}
            {times.map((time, index) => (
              <React.Fragment key={time}>
                <div className="row-start-auto text-right pr-4 text-sm text-muted-foreground">
                  {time}
                </div>
                {dayNames.map(day => (
                  <div key={`${day}-${time}`} className="border-t border-r last:border-r-0"></div>
                ))}
              </React.Fragment>
            ))}
            
            {/* Eventos da Agenda */}
            {classes.map((cls, index) => {
              const start = calculatePosition(cls.start);
              const duration = calculatePosition(cls.end) - start;
              const dayIndex = dayNames.indexOf(cls.day) + 2; // +2 para compensar a coluna de horário

              if (dayIndex < 2) return null;

              return (
                <div
                  key={index}
                  className={`absolute p-2 rounded-lg shadow-md flex flex-col ${cls.color} ${cls.textColor}`}
                  style={{
                    gridColumnStart: dayIndex,
                    top: `${(start / (16 * 60)) * (16 * 64)}px`, // Aproximação da posição
                    height: `${(duration / (16 * 60)) * (16 * 64)}px`, // Aproximação da altura
                    left: `${((dayIndex - 2) / 7) * 100}%`,
                    width: `calc(${100/7}% - 8px)`,
                    marginLeft: '8px'
                  }}
                >
                  <p className="font-semibold text-sm">{cls.title}</p>
                  <p className="text-xs">{cls.instructor}</p>
                  <div className="flex-grow"></div>
                  <div className="flex items-center text-xs mt-1">
                    <Users className="h-3 w-3 mr-1" /> A: {cls.students}
                  </div>
                  <div className="flex items-center text-xs">
                    <MapPin className="h-3 w-3 mr-1" /> {cls.location}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
      <ScheduleLegend />
    </div>
  );
}
