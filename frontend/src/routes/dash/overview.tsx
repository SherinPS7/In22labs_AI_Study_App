
import Footer from "@/components/footer/footer"
import StudyStreaks from "@/components/overview/StudyPlan"
import { Planner } from "@/routes/dash/planner"
import ContinueLearning from "../../../src/routes/dash/continue-reading"
import StartLearning from "../../../src/routes/dash/start-learning"
import Categories from "../../../src/routes/dash/categories"
import SearchBar from "./Overview/searchbar"
import { useState } from "react";


const Overview = () => {
  const [searchResults, setSearchResults] = useState([]);

  return (
    <div className="w-full p-4">
      {/* Header */}
      <main className="flex items-center gap-4 w-full">
  {/* Left Section */}
    {/* Header */}
<div className="mb-6">
  <h1 className="text-3xl font-semibold tracking-tight ">
    Welcome Back, ABC!
  </h1>
  <p className="text-muted-foreground text-sm font-light tracking-tight leading-tight whitespace-normal">
    Continue your journey with our curator
  </p>
</div>

{/* Search */}
<div >
  <SearchBar/>
</div>

</main>


      {/* Main Content */}
      <main className="flex-1 py-6 px-4 md:px-6">
        <div className="flex flex-col space-y-6">
          <div className="w-full">
            <div className="pr-4">
              <StudyStreaks />
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
