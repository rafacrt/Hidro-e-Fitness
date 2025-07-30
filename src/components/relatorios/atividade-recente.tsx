import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Download, BarChart2, Eye, Clock } from 'lucide-react';

interface Activity {
  title: string;
  author: string;
  time: string;
  icon: 'File' | 'Download' | 'BarChart2' | 'Eye';
}

interface AtividadeRecenteProps {
  activities: Activity[];
}

const iconMap = {
    'File': { icon: FileText, bg: 'bg-green-100', text: 'text-green-600' },
    'Download': { icon: Download, bg: 'bg-blue-100', text: 'text-blue-600' },
    'BarChart2': { icon: BarChart2, bg: 'bg-yellow-100', text: 'text-yellow-600' },
    'Eye': { icon: Eye, bg: 'bg-purple-100', text: 'text-purple-600' },
}

export default function AtividadeRecente({ activities }: AtividadeRecenteProps) {
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Atividade Recente</CardTitle>
        <FileText className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity, index) => {
           const IconInfo = iconMap[activity.icon as keyof typeof iconMap];
           const Icon = IconInfo.icon;
           return (
            <div key={index} className="flex items-center gap-4">
              <div className={`flex items-center justify-center h-10 w-10 rounded-lg ${IconInfo.bg}`}>
                  <Icon className={`h-5 w-5 ${IconInfo.text}`} />
              </div>
              <div className="flex-grow">
                <p className="font-semibold text-sm">{activity.title}</p>
                <p className="text-xs text-muted-foreground">{activity.author}</p>
              </div>
              <div className="flex items-center text-xs text-muted-foreground">
                <Clock className="h-3 w-3 mr-1" />
                <span>{activity.time}</span>
              </div>
            </div>
           )
        })}
      </CardContent>
    </Card>
  );
}
