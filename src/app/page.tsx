import AnnouncementFeed from '@/components/dashboard/announcement-feed';
import ClassSchedule from '@/components/dashboard/class-schedule';
import MembershipDetails from '@/components/dashboard/membership-details';
import ReservationManagement from '@/components/dashboard/reservation-management';
import Header from '@/components/layout/header';
import Sidebar from '@/components/layout/sidebar';

export default function Dashboard() {
  return (
    <div className="flex min-h-screen w-full bg-background selection:bg-primary/20 selection:text-primary">
      <Sidebar />
      <div className="flex flex-col w-0 flex-1">
        <Header />
        <main className="flex-1 p-4 md:p-6 lg:p-8 space-y-8 overflow-y-auto">
          <div id="dashboard" className="max-w-6xl mx-auto w-full space-y-8">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Welcome back, Jane!
            </h1>

            <div className="grid gap-8 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-8">
                <section id="schedule">
                  <ClassSchedule />
                </section>
                <section id="reservations">
                  <ReservationManagement />
                </section>
              </div>
              <div className="lg:col-span-1 space-y-8">
                <section id="membership">
                  <MembershipDetails />
                </section>
                <section id="announcements">
                  <AnnouncementFeed />
                </section>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
