'use client';

import { Waves, PersonStanding, Fish, Star } from 'lucide-react';
import type { ComponentProps } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import Image from 'next/image';

type ClassType = {
  id: string;
  name: string;
  instructor: string;
  avatar: string;
  time: string;
  spotsLeft: number;
  isPopular?: boolean;
};

const classes: Record<string, ClassType[]> = {
  hydro: [
    { id: 'h1', name: 'Aqua Aerobics', instructor: 'Maria S.', avatar: 'https://placehold.co/40x40.png', time: '9:00 AM - 10:00 AM', spotsLeft: 5, isPopular: true },
    { id: 'h2', name: 'Deep Water Run', instructor: 'Carlos P.', avatar: 'https://placehold.co/40x40.png', time: '6:00 PM - 7:00 PM', spotsLeft: 2 },
  ],
  swim: [
    { id: 's1', name: 'Beginner Freestyle', instructor: 'Ana K.', avatar: 'https://placehold.co/40x40.png', time: '10:00 AM - 11:00 AM', spotsLeft: 3 },
    { id: 's2', name: 'Advanced Strokes', instructor: 'John L.', avatar: 'https://placehold.co/40x40.png', time: '7:00 PM - 8:00 PM', spotsLeft: 8, isPopular: true },
  ],
  dance: [
    { id: 'd1', name: 'Zumba Splash', instructor: 'Sofia R.', avatar: 'https://placehold.co/40x40.png', time: '11:00 AM - 12:00 PM', spotsLeft: 10 },
    { id: 'd2', name: 'Aqua Ballet', instructor: 'Isabela C.', avatar: 'https://placehold.co/40x40.png', time: '5:00 PM - 6:00 PM', spotsLeft: 4, isPopular: true },
  ],
};

function ClassCard({ classInfo }: { classInfo: ClassType }) {
  const { toast } = useToast();

  return (
    <Card className="transition-all hover:shadow-lg">
      <CardContent className="p-4 flex items-center gap-4">
        <Avatar className="h-12 w-12">
          <Image src={classInfo.avatar} alt={classInfo.instructor} width={48} height={48} data-ai-hint="person portrait" />
          <AvatarFallback>{classInfo.instructor.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="font-semibold">{classInfo.name}</p>
            {classInfo.isPopular && <Badge variant="outline" className="text-accent border-accent"><Star className="h-3 w-3 mr-1" /> Popular</Badge>}
          </div>
          <p className="text-sm text-muted-foreground">{classInfo.instructor} • {classInfo.time}</p>
          <p className="text-sm text-primary font-medium mt-1">{classInfo.spotsLeft} spots left</p>
        </div>
        <Button 
          variant="default"
          onClick={() => toast({
            title: "Class Booked!",
            description: `You've booked ${classInfo.name} with ${classInfo.instructor}.`,
          })}
          aria-label={`Book class ${classInfo.name}`}
        >
          Book Now
        </Button>
      </CardContent>
    </Card>
  );
}

const tabTriggers: { value: string; label: string; icon: React.ElementType }[] = [
    { value: 'hydro', label: 'Hydrogymnastics', icon: Waves },
    { value: 'swim', label: 'Swimming', icon: Fish },
    { value: 'dance', label: 'Dance', icon: PersonStanding },
]

export default function ClassSchedule() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Class Schedule</CardTitle>
        <CardDescription>Book your favorite classes for the week.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="hydro">
          <TabsList className="grid w-full grid-cols-3">
            {tabTriggers.map(({ value, label, icon: Icon }) => (
                <TabsTrigger key={value} value={value}>
                    <Icon className="mr-2 h-4 w-4" /> {label}
                </TabsTrigger>
            ))}
          </TabsList>
          {Object.keys(classes).map((key) => (
             <TabsContent key={key} value={key}>
                <div className="space-y-4 mt-4">
                    {classes[key].map((classInfo) => (
                        <ClassCard key={classInfo.id} classInfo={classInfo} />
                    ))}
                </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
