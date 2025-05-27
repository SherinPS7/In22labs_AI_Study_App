// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Bell, Play } from 'lucide-react'
// import { MetricCards } from "@/components/overview/metric-cards"
// import { PerformanceGraph } from "@/components/overview/performance-graph"
// import { TaskComparisonChart } from "@/components/overview/task-comparsion"
// import { SkillRadarChart } from "@/components/overview/skill-radar"
// import { ProgressTracker } from "@/components/overview/progress-tracker"
// import { ActivityTable } from "@/components/overview/activity-table"
// import { NotificationsPanel } from "@/components/overview/notifications-panel"
// import { CommunityEngagement } from "@/components/overview/community-engagement"
// import { useState } from "react"
import Footer from "@/components/footer/footer"
import StudyStreaksWithOverlay from "@/components/overview/streaksnew"
import { Planner } from "@/routes/dash/planner"
import ContinueLearning from "../../../src/routes/dash/continue-reading"
import StartLearning from "../../../src/routes/dash/start-learning"
import Categories from "../../../src/routes/dash/categories"
// import LearnerLevelQuiz from "./learner-level-quiz"

const Overview = () => {
  return (
    <div className="w-full p-4">
      {/* Header */}
      <main className="flex justify-between items-center flex-wrap gap-4">
        {/* Left Section */}
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            Welcome Back, ABC!
          </h1>
          <p className="text-muted-foreground text-sm font-light tracking-tight leading-tight whitespace-normal">
            Continue your journey with our curator
          </p>
        </div>

        {/* Search Bar */}
        <div className="w-auto">
          <input
            type="text"
            placeholder="Search..."
            className="px-3 py-2 text-sm border rounded-md bg-background border-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </main>

      {/* Main Content */}
      <main className="flex-1 py-6 px-4 md:px-6">
        <div className="flex flex-col space-y-6">
          <div className="w-full">
            <div className="pr-4">
              <StudyStreaksWithOverlay />
            </div>
          </div>

          {/* Uncomment to enable metric cards */}
          {/* <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            <MetricCards />
          </div> */}
        </div>

        <div className="mt-6">
          <Planner />
        </div>

        <div className="mt-6">
          <StartLearning />
        </div>

        <div className="mt-6">
          <ContinueLearning />
        </div>

        <div className="mt-4 grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
          {/* Uncomment for performance & task comparison charts */}
          {/* <Card className="col-span-1 md:col-span-4">
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
          </Card> */}
        </div>

        {/* <div>
          <LearnerLevelQuiz />
        </div> */}

        <div>
          <Categories />
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default Overview
