'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';

type Reservation = {
  id: string;
  className: string;
  instructor: string;
  date: string;
  time: string;
};

const reservations: Reservation[] = [
  { id: 'r1', className: 'Deep Water Run', instructor: 'Carlos P.', date: '2024-07-28', time: '6:00 PM' },
  { id: 'r2', className: 'Advanced Strokes', instructor: 'John L.', date: '2024-07-29', time: '7:00 PM' },
  { id: 'r3', className: 'Zumba Splash', instructor: 'Sofia R.', date: '2024-07-30', time: '11:00 AM' },
];

export default function ReservationManagement() {
  const { toast } = useToast();

  const handleCancel = (reservation: Reservation) => {
    toast({
      title: 'Reservation Cancelled',
      description: `Your booking for ${reservation.className} has been cancelled.`,
      variant: 'destructive',
    });
    // In a real app, you would also update the state to remove the reservation.
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Reservations</CardTitle>
        <CardDescription>Manage your upcoming class bookings.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Class</TableHead>
              <TableHead>Instructor</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reservations.map((reservation) => (
              <TableRow key={reservation.id}>
                <TableCell className="font-medium">{reservation.className}</TableCell>
                <TableCell>{reservation.instructor}</TableCell>
                <TableCell>{reservation.date}</TableCell>
                <TableCell>{reservation.time}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" onClick={() => handleCancel(reservation)}>
                    Cancel
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
