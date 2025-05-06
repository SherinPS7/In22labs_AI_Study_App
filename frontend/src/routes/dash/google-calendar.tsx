import { GoogleCalendarIcon } from "@/components/dashboard/google-calendar-icon";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const GoogleCalendar = () => {

  return (
    <div className="p-4 w-full">
      <main className="flex justify-start md:justify-between items-start md:items-center flex-col md:flex-row gap-4 flex-wrap">
        <main className="flex flex-col gap-1">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">
                Integrations - Google Calendar
            </h1>
            <p className="text-sm font-light tracking-tighter leading-tight text-muted-foreground">
                Boost your performance by connecting with google calendar to manage your tasks and events
            </p>
        </main>

        <main className="flex flex-row items-center gap-2">
            <Button
                size={"sm"}
                variant={"default"}
                asChild
            >
              <Link to={"/pricing"}>
              <GoogleCalendarIcon className="mr-1 h-4 w-4" />
                Connect
              </Link>
            </Button>
        </main>
      </main>
      <main className="my-4 grid grid-col gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      </main>
    </div>
  );
};

export default GoogleCalendar;
