import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const announcements = [
  { id: 'a1', title: 'Summer Schedule Update', content: 'Our new summer schedule starts next Monday! Check the app for updated class times.', date: '2 days ago' },
  { id: 'a2', title: 'Facility Maintenance', content: 'The main pool will be closed for maintenance this weekend.', date: '5 days ago' },
];

export default function AnnouncementFeed() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Announcements</CardTitle>
        <CardDescription>Latest news from the academy.</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {announcements.map((item, index) => (
            <li key={item.id}>
              {index > 0 && <Separator className="mb-4" />}
              <div className="space-y-1">
                <p className="font-semibold text-sm">{item.title}</p>
                <p className="text-sm text-muted-foreground">{item.content}</p>
                <p className="text-xs text-muted-foreground pt-1">{item.date}</p>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
