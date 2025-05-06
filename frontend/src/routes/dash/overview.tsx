import { DateRangePicker } from "@/components/ui/date-ranger-picker"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bell } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MetricCards } from "@/components/overview/metric-cards"
import { PerformanceGraph } from "@/components/overview/performance-graph"
import { TaskComparisonChart } from "@/components/overview/task-comparsion"
import { SkillRadarChart } from "@/components/overview/skill-radar"
import { ProgressTracker } from "@/components/overview/progress-tracker"
import { ActivityTable } from "@/components/overview/activity-table"
import { NotificationsPanel } from "@/components/overview/notifications-panel"
import { CommunityEngagement } from "@/components/overview/community-engagement"
import { useState } from "react"
import { DateRange } from "react-day-picker"

const Overview = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(2025, 0, 1),
    to: new Date(2025, 0, 31),
  })
  return (
    <div className="w-full p-4">
        <main className="flex justify-start md:justify-between items-start md:items-center flex-col md:flex-row gap-4 flex-wrap">
            <main className="flex flex-col gap-1">
                <h1 className="text-3xl font-semibold tracking-tight text-foreground">
                    Overview Insights
                </h1>
                <p className="text-muted-foreground text-sm font-light tracking-tight leading-tight whitespace-normal">
                    view your performance, notifications and your overall usage in the app.
                </p>
            </main>
            <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <div className="w-full flex-1 md:w-auto md:flex-none">
              <DateRangePicker date={dateRange} setDate={setDateRange} />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Bell className="h-4 w-4" />
                  <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500" />
                  <span className="sr-only">Notifications</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>New assignment added</DropdownMenuItem>
                <DropdownMenuItem>Test reminder: Math 101</DropdownMenuItem>
                <DropdownMenuItem>Community post: Study tips</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </main>
        

          <main className="flex-1 py-6 px-4 md:px-6">
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          <MetricCards />
        </div>
        <div className="mt-4 grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-1 md:col-span-4">
            <CardHeader>
              <CardTitle>Performance Over Time</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <PerformanceGraph />
            </CardContent>
          </Card>
          <Card className="col-span-1 md:col-span-3">
            <CardHeader>
              <CardTitle>Tasks Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <TaskComparisonChart />
            </CardContent>
          </Card>
        </div>
        <div className="mt-4 grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-1 md:col-span-2">
            <CardHeader>
              <CardTitle>Skill Levels</CardTitle>
            </CardHeader>
            <CardContent>
              <SkillRadarChart />
            </CardContent>
          </Card>
          <Card className="col-span-1 md:col-span-2">
            <CardHeader>
              <CardTitle>Goal Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <ProgressTracker />
            </CardContent>
          </Card>
          <Card className="col-span-1 md:col-span-3">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <ActivityTable />
            </CardContent>
          </Card>
        </div>
        <div className="mt-4 grid gap-4 grid-cols-1 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
            </CardHeader>
            <CardContent>
              <NotificationsPanel />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Community Engagement</CardTitle>
            </CardHeader>
            <CardContent>
              <CommunityEngagement />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

export default Overview