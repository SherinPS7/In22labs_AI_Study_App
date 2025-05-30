import React from 'react';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';
const PythonCard = "/course-thumbnails/intro-to-python.jpeg";
const UIUXCard = "/course-thumbnails/ui-ux-guide.jpeg";
const FrontendCard = "/course-thumbnails/frontend.jpeg";


const StartLearning = () => {
  return (
    <section className="mt-6">
  <h2 className="text-2xl font-semibold text-foreground mb-4">Start Learning</h2>
  
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {/* Python Course Card */}
    <div className="bg-card rounded-2xl shadow-md overflow-hidden">
      <div className="relative h-48">
      <img src={PythonCard} className="w-full h-full object-cover" alt="Introduction to Python" />
        <div className="absolute inset-0 flex items-center justify-center">
          <a href="https://youtu.be/ix9cRaBkVe0?si=pUDTvdmchIYJziIQ" target="_blank" rel="noopener noreferrer">
          <Button variant="ghost" size="icon" className="bg-background/30 backdrop-blur-sm hover:bg-background/50 rounded-full">
            <Play className="w-6 h-6" />
          </Button>
          </a>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-medium">Introduction to Python</h3>
        <p className="text-sm text-muted-foreground">Learn Python fundamentals, data structures, and build your first application</p>
      </div>
    </div>
    
    {/* UI/UX Course Card */}
    <div className="bg-card rounded-2xl shadow-md overflow-hidden">
      <div className="relative h-48">
        <img src={UIUXCard} className="w-full h-full object-cover" />
        <div className="absolute inset-0 flex items-center justify-center">
          <a href="https://youtu.be/cKZEgtQUxlU?si=uMQGYO7wuWprWPkK" target="blank" rel="noopener referrer">
          <Button variant="ghost" size="icon" className="bg-background/30 backdrop-blur-sm hover:bg-background/50 rounded-full">
            <Play className="w-6 h-6" />
          </Button>
          </a>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-medium">Ultimate Guide to UI/UX</h3>
        <p className="text-sm text-muted-foreground">Master user interface design principles and create engaging user experiences</p>
      </div>
    </div>
    
    {/* Frontend Course Card */}
    <div className="bg-card rounded-2xl shadow-md overflow-hidden">
      <div className="relative h-48">
        <img src={FrontendCard} className="w-full h-full object-cover" />
        <div className="absolute inset-0 flex items-center justify-center">
          <a href = "https://youtu.be/zJSY8tbf_ys?si=1IMfdkbEQ9ojcbvK" target="blank" rel="noopener referrer">
          <Button variant="ghost" size="icon" className="bg-background/30 backdrop-blur-sm hover:bg-background/50 rounded-full">
            <Play className="w-6 h-6" />
          </Button>
          </a>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-medium">Learn Frontend - Full Roadmap</h3>
        <p className="text-sm text-muted-foreground">From HTML basics to advanced React frameworks - complete path to frontend mastery</p>
      </div>
    </div>
  </div>
</section>
);
};

export default StartLearning;