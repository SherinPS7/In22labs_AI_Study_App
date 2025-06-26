import { useState, useRef, useEffect } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  addMonths,
  subMonths,
  isSameMonth,
  setMonth,
} from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const views = ["month", "day"] as const;
type View = (typeof views)[number];

type StudyPlan = {
    id: number;
  name: string;
  color: string;
  weekdays: number[]; // 0 = Sun, ...
  studyTime: string; // HH:mm
  startDate: string; // ISO string
  endDate: string;
};

const weekdayMap: { [key: string]: number } = {
  Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6,
};

const getRandomColor = () => {
  const colors = [
    "bg-purple-600",
    "bg-green-600",
    "bg-yellow-500",
    "bg-pink-600",
    "bg-blue-500",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};


export default function CalendarView() {
  const [view, setView] = useState<View>("month");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [open, setOpen] = useState(false);
  const [studyPlans, setStudyPlans] = useState<StudyPlan[]>([]);
  const [activePlans, setActivePlans] = useState<StudyPlan[]>([]);
  const timelineRef = useRef<HTMLDivElement>(null);

  const start = startOfWeek(startOfMonth(selectedDate), { weekStartsOn: 0 });
  const end = endOfWeek(endOfMonth(selectedDate), { weekStartsOn: 0 });
  const days = eachDayOfInterval({ start, end });

 const handleDayClick = (date: Date) => {
  const weekday = date.getDay();
  console.log("Day clicked:", date, "→ Weekday index:", weekday);

  const matchingPlans = studyPlans.filter(plan => {
    const planStart = new Date(plan.startDate);
    const planEnd = new Date(plan.endDate);
    return (
      plan.weekdays.includes(weekday) &&
      date >= planStart &&
      date <= planEnd
    );
  });

  console.log("Matching plans for the day:", matchingPlans);
  setActivePlans(matchingPlans);
  setSelectedDate(date);
  setOpen(true);
};


  const handleMonthClick = (monthIndex: number) => {
    const newDate = setMonth(new Date(selectedDate), monthIndex);
    console.log("Month clicked:", monthIndex, "→ Date set to:", newDate);
    setView("day");
    setSelectedDate(newDate);
  };

  const prevMonth = () => setSelectedDate(subMonths(selectedDate, 1));
  const nextMonth = () => setSelectedDate(addMonths(selectedDate, 1));

 const transformPlans = (apiData: any[]): StudyPlan[] => {
  return apiData.map(plan => {
    const weekdayArray = plan.weekdays
      .split(",")
      .map((day: string) => weekdayMap[day.trim()]);

    return {
      id: plan.id,
      name: plan.plan_name,
      color: getRandomColor(),
      weekdays: weekdayArray,
      studyTime: plan.study_time.slice(0, 5),
      startDate: plan.start_date,
      endDate: plan.end_date,
    };
  });
};


  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/plans/",

          {
             method: "GET",
             credentials: "include"},  // Ensure cookies are sent with the request
        );
        console.log("API Response status:", res.status);
        if (!res.ok) throw new Error("Failed to fetch plans");
        const data = await res.json();
        console.log("Raw API data:", data);
        const transformed = transformPlans(data);
        setStudyPlans(transformed);
      } catch (err) {
        console.error("Error fetching study plans:", err);
      }
    };
    fetchPlans();
  }, []);

  useEffect(() => {
    if (open && activePlans.length > 0 && timelineRef.current) {
      const times = activePlans.map(plan => {
        const [hourStr, minStr] = plan.studyTime.split(":");
        return parseInt(hourStr, 10) + parseInt(minStr, 10) / 60;
      });
      const earliestTime = Math.min(...times);
      const hourHeight = 50;
      timelineRef.current.scrollTop = earliestTime * hourHeight;
    }
  }, [open, activePlans]);

  const monthNames = Array.from({ length: 12 }, (_, i) =>
    format(new Date(2023, i, 1), "MMM")
  );

  return (
    <div className="w-full h-screen p-4 text-white overflow-hidden flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Study Planner</h1>
        <div className="flex gap-2">
          {views.map(v => (
            <Button key={v} variant={view === v ? "default" : "outline"} onClick={() => setView(v)}>
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {view === "month" ? (
        <div className="mx-auto mt-8 w-[75vw] h-[75vh] grid grid-cols-3 grid-rows-4 border border-white rounded-md overflow-hidden">
          {monthNames.map((monthName, i) => (
            <div
              key={monthName}
              className={cn(
                "flex items-center justify-center text-2xl font-semibold cursor-pointer select-none",
                "border border-white",
                i === selectedDate.getMonth()
                  ? "bg-purple-600 text-white"
                  : "bg-transparent text-white hover:bg-purple-700"
              )}
              onClick={() => handleMonthClick(i)}
            >
              {monthName}
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="flex justify-between mb-2">
            <Button variant="ghost" onClick={prevMonth}>← Prev</Button>
            <span className="font-semibold">{format(selectedDate, "MMMM yyyy")}</span>
            <Button variant="ghost" onClick={nextMonth}>Next →</Button>
          </div>

          <div className="grid grid-cols-7 border border-gray-700 h-[calc(100vh-250px)] overflow-auto">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
              <div key={day} className="text-center font-semibold border border-gray-700 bg-gray-900 py-2">{day}</div>
            ))}
            {days.map(day => {
              const inMonth = isSameMonth(day, selectedDate);
const dayPlans = studyPlans.filter(plan => {
  const weekdayMatch = plan.weekdays.includes(day.getDay());

  // Convert strings to Date objects for comparison
  const current = day.getTime();
  const start = new Date(plan.startDate).getTime();
  const end = new Date(plan.endDate).getTime();

  const withinRange = current >= start && current <= end;

  return weekdayMatch && withinRange;
});
              return (
                <div
                  key={day.toString()}
                  className={cn(
                    "border border-gray-800 p-1 cursor-pointer hover:bg-gray-800 text-sm",
                    !inMonth && "bg-gray-900 opacity-50"
                  )}
                  onClick={() => handleDayClick(day)}
                >
                  <div className="font-semibold">{format(day, "d")}</div>
                  <div className="flex flex-col gap-1 mt-1">
                    {dayPlans.map(plan => (
                      <div
                        key={plan.id}
                        className={cn("text-xs px-1 py-0.5 rounded text-white", plan.color, "opacity-90")}
                      >
                        {plan.name}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Plans for {format(selectedDate, "PPP")}</DialogTitle>
          </DialogHeader>
          {activePlans.length > 0 ? (() => {
            const times = activePlans.map(plan => {
              const [hourStr, minStr] = plan.studyTime.split(":");
              return { hour: parseInt(hourStr), min: parseInt(minStr), plan };
            });

            let minHour = Math.max(0, Math.min(...times.map(t => t.hour)) - 6);
            let maxHour = Math.min(23, Math.max(...times.map(t => t.hour)) + 6);
            const hourHeight = 50;

            const timelineHours = [];
            for (let h = minHour; h <= maxHour; h++) {
              timelineHours.push(h);
            }

            const formatHourLabel = (hour: number) => format(new Date(0, 0, 0, hour), "h a");

           return (
  <div
    ref={timelineRef}
    className="relative ml-4 pl-6 border-l-2 border-purple-600 overflow-y-auto"
    style={{ height: "400px" }}
  >
    {/* Hour markers */}
    {timelineHours.map(hour => (
      <div
        key={hour}
        className="relative flex items-center"
        style={{ height: `${hourHeight}px` }}
      >
        <div className="absolute left-0 top-1/2 w-full border-t border-dashed border-gray-600 -z-10" />
        <div className="w-14 text-right text-xs text-gray-400 select-none">
          {formatHourLabel(hour)}
        </div>
      </div>
    ))}

    {/* Study plan events */}
    {times.map(({ hour, min, plan }) => {
      const posY = ((hour + min / 60) - minHour) * hourHeight;
      const timeLabel = format(new Date(0, 0, 0, hour, min), "h:mm a");

      return (
        <div
          key={plan.id}
          className="absolute left-16 flex items-center"
          style={{
            top: `${posY}px`,
            transform: "translateY(-50%)", // centers dot on dashed line
          }}
        >
          <div className={`h-4 w-4 rounded-full border-2 border-white ${plan.color} mr-2`} />
          <div className="bg-gray-800 px-2 py-1 rounded-md shadow text-white max-w-xs">
            <div className="font-semibold text-sm">{plan.name}</div>
            <div className="text-xs text-gray-400">{timeLabel}</div>
          </div>
        </div>
      );
    })}
  </div>
);

          })() : (
            <div className="text-gray-400">No study plans for this day.</div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
