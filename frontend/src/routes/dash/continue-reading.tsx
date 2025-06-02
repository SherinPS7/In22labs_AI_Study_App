import React from 'react';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';
const DSACourse = '/course-thumbnails/DSA-course.jpeg'
const DataScienceCourse = '/course-thumbnails/data-science-course.jpeg'
const CloudComputing = '/course-thumbnails/cloud-computing-course.jpeg'


const ContinueLearning = () => {
  return (
    <section className="mt-6">
      <h2 className="text-2xl font-semibold text-foreground mb-4">Continue Learning</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* DSA Course Card */}
        <div className="bg-card rounded-2xl shadow-md overflow-hidden">
          <div className="relative h-48">
            <img src={DSACourse} className="w-full h-full object-cover" alt="Advanced JavaScript" />
            <div className="absolute inset-0 flex items-center justify-center">
              <a href="https://youtu.be/RBSGKlAvoiM?si=eWlnOqZdDU5YtztR" target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="icon" className="bg-background/30 backdrop-blur-sm hover:bg-background/50 rounded-full">
                  <Play className="w-6 h-6" />
                </Button>
              </a>
            </div>
          </div>
          <div className="p-4">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-medium px-2 py-1 bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-full">Intermediate</span>
              <span className="text-xs text-zinc-500 dark:text-zinc-400">FreeCodeCamp</span>
            </div>
            <div className="flex justify-between items-center mb-1">
              <h3 className="text-lg font-medium">Data Structures - Beginner to Pro</h3>
              <span className="text-sm font-medium text-primary">68%</span>
            </div>
            <p className="text-sm text-muted-foreground mb-2">Learn and master the most common data structures</p>
            <div className="w-full bg-muted rounded-full h-2">
              <div className="bg-primary rounded-full h-2" style={{ width: '68%' }}></div>
            </div>
          </div>
        </div>
        
        {/* Data Science Fundamentals Course Card */}
        <div className="bg-card rounded-2xl shadow-md overflow-hidden">
          <div className="relative h-48">
            <img src={DataScienceCourse} className="w-full h-full object-cover" alt="Data Science Fundamentals" />
            <div className="absolute inset-0 flex items-center justify-center">
              <a href="https://youtu.be/ua-CiDNNj30?si=c3RhkBCtNmP9KlZC" target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="icon" className="bg-background/30 backdrop-blur-sm hover:bg-background/50 rounded-full">
                  <Play className="w-6 h-6" />
                </Button>
              </a>
            </div>
          </div>
          <div className="p-4">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-medium px-2 py-1 bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-full">Hard</span>
              <span className="text-xs text-zinc-500 dark:text-zinc-400">FreeCodeCamp</span>
            </div>
            <div className="flex justify-between items-center mb-1">
              <h3 className="text-lg font-medium">Data Science Fundamentals</h3>
              <span className="text-sm font-medium text-primary">42%</span>
            </div>
            <p className="text-sm text-muted-foreground mb-2">Learn statistical analysis, pandas, and data visualization</p>
            <div className="w-full bg-muted rounded-full h-2">
              <div className="bg-primary rounded-full h-2" style={{ width: '42%' }}></div>
            </div>
          </div>
        </div>
        
        {/* Cloud Computing Course Card */}
        <div className="bg-card rounded-2xl shadow-md overflow-hidden">
          <div className="relative h-48">
            <img src={CloudComputing} className="w-full h-full object-cover" alt="Cloud Computing" />
            <div className="absolute inset-0 flex items-center justify-center">
              <a href="https://youtu.be/2LaAJq1lB1Q?si=ULtDa4TKV4NeTaNk" target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="icon" className="bg-background/30 backdrop-blur-sm hover:bg-background/50 rounded-full">
                  <Play className="w-6 h-6" />
                </Button>
              </a>
            </div>
          </div>
          <div className="p-4">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-medium px-2 py-1 bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-full">Easy</span>
              <span className="text-xs text-zinc-500 dark:text-zinc-400">Edureka</span>
            </div>
            <div className="flex justify-between items-center mb-1">
              <h3 className="text-lg font-medium">Cloud Computing</h3>
              <span className="text-sm font-medium text-primary">23%</span>
            </div>
            <p className="text-sm text-muted-foreground mb-2">Build scalable applications with AWS, Azure and GCP</p>
            <div className="w-full bg-muted rounded-full h-2">
              <div className="bg-primary rounded-full h-2" style={{ width: '23%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContinueLearning;