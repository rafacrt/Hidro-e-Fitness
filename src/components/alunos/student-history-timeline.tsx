
'use client';

import * as React from 'react';
import { getStudentHistory, type HistoryEvent } from '@/app/alunos/actions';
import { Loader2, Calendar, DollarSign, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ScrollArea } from '../ui/scroll-area';

interface StudentHistoryTimelineProps {
  studentId: string;
}

const eventTypeConfig = {
  enrollment: { icon: Calendar, color: 'bg-blue-500' },
  payment: { icon: DollarSign, color: 'bg-green-500' },
  attendance: { icon: CheckCircle, color: 'bg-yellow-500' },
};

export default function StudentHistoryTimeline({ studentId }: StudentHistoryTimelineProps) {
  const [history, setHistory] = React.useState<HistoryEvent[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadHistory() {
      setLoading(true);
      const data = await getStudentHistory(studentId);
      setHistory(data);
      setLoading(false);
    }
    loadHistory();
  }, [studentId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="flex items-center justify-center h-96 text-center text-muted-foreground">
        Nenhum histórico encontrado para este aluno.
      </div>
    );
  }

  return (
    <ScrollArea className="h-96 pr-4">
      <div className="relative pl-6">
        {/* Timeline Line */}
        <div className="absolute left-8 top-0 h-full w-0.5 bg-border" />

        {history.map((event, index) => {
          const EventIcon = eventTypeConfig[event.type].icon;
          const iconColor = eventTypeConfig[event.type].color;
          return (
            <div key={index} className="relative mb-8">
              <div className={`absolute left-0 top-1 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full ${iconColor}`}>
                <EventIcon className="h-4 w-4 text-white" />
              </div>
              <div className="pl-8">
                <p className="font-semibold text-sm">{event.title}</p>
                <p className="text-xs text-muted-foreground">{event.description}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {format(new Date(event.date), 'PPP p', { locale: ptBR })}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
}
