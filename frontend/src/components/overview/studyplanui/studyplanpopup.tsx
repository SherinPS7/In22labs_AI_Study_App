// StudyPlanPopup.tsx
import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface StudyPlan {
  id: number;
  plan_name: string;
  user_id: number;
  start_date: string;
  end_date: string;
  weekdays: string[];
  study_time: number;
}

interface Course {
  id: number;
  course_name: string;
  description?: string;
  duration_weeks?: number;
  createdAt?: string;
}

interface CourseSettings {
  daily_hours: number;
  study_days: string[];
  notes: string;
}

interface StudyPlanData {
  plan_name: string;
  start_date: string;
  end_date: string;
  course_ids: number[];
  course_settings: Record<string, CourseSettings>;
}

interface StudyPlanPopupProps {
  isOpen: boolean;
  onClose: () => void;
  userId: number;
  editingPlan?: StudyPlan | null;
  setSuccess: (message: string) => void;
  setError: (message: string) => void;
  onPlanUpdate: () => void;
}

const StudyPlanPopup: React.FC<StudyPlanPopupProps> = ({
  isOpen,
  onClose,
  userId,
  editingPlan,
  setSuccess,
  setError,
  onPlanUpdate
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCourses, setSelectedCourses] = useState<Course[]>([]);
  const [studyPlanData, setStudyPlanData] = useState<StudyPlanData>({
    plan_name: '',
    start_date: '',
    end_date: '',
    course_ids: [],
    course_settings: {}
  });

  const steps = [
    { id: 1, title: 'Select Courses' },
    { id: 2, title: 'Set Schedule' },
    { id: 3, title: 'Review & Save' }
  ];

  const handleNext = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const handlePrevious = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSave = async () => {
    try {
      // Convert course settings to match your existing API format
      const selectedWeekdays = Array.from(
        new Set(
          Object.values(studyPlanData.course_settings)
            .flatMap(setting => setting.study_days)
        )
      );

      const totalStudyTime = Object.values(studyPlanData.course_settings)
        .reduce((sum, setting) => sum + setting.daily_hours, 0) * 60; // Convert to minutes

      const planData = {
        plan_name: studyPlanData.plan_name.trim(),
        user_id: userId,
        start_date: studyPlanData.start_date,
        end_date: studyPlanData.end_date,
        weekdays: selectedWeekdays,
        study_time: totalStudyTime,
        course_ids: studyPlanData.course_ids,
        course_settings: studyPlanData.course_settings
      };

      console.log('Submitting plan data:', planData);

      // Use your existing API calls
      const { createStudyPlan, updateStudyPlan } = await import('@/api/studyplan');
      
      let result;
      if (editingPlan) {
        result = await updateStudyPlan(editingPlan.id, planData);
      } else {
        result = await createStudyPlan(planData);
      }

      setSuccess(editingPlan ? 'Plan updated successfully!' : 'Plan created successfully!');
      
      // Reset and close
      resetForm();
      onClose();
      
      setTimeout(() => {
        onPlanUpdate();
      }, 100);
      
    } catch (err: any) {
      console.error('Submit error:', err);
      setError(err.message || 'An error occurred while saving the plan');
    }
  };

  const resetForm = () => {
    setCurrentStep(1);
    setSelectedCourses([]);
    setStudyPlanData({
      plan_name: '',
      start_date: '',
      end_date: '',
      course_ids: [],
      course_settings: {}
    });
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <CourseSelectionStep
            userId={userId}
            selectedCourses={selectedCourses}
            setSelectedCourses={setSelectedCourses}
            studyPlanData={studyPlanData}
            setStudyPlanData={setStudyPlanData}
            onNext={handleNext}
          />
        );
      case 2:
        return (
          <CourseScheduleStep
            selectedCourses={selectedCourses}
            studyPlanData={studyPlanData}
            setStudyPlanData={setStudyPlanData}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );
      case 3:
        return (
          <ReviewStep
            studyPlanData={studyPlanData}
            setStudyPlanData={setStudyPlanData}
            selectedCourses={selectedCourses}
            onSave={handleSave}
            onPrevious={handlePrevious}
          />
        );
      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="bg-black w-full max-w-4xl max-h-[90vh] overflow-y-auto m-4">
        <CardHeader className="relative">
          <CardTitle className="text-xl font-bold">
            {editingPlan ? 'Edit Study Plan' : 'Create New Study Plan'}
          </CardTitle>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </CardHeader>
        
        <CardContent>
          {/* Progress indicator */}
          <div className="mb-6">
            <div className="flex justify-between items-center">
              {steps.map((step, index) => (
                <div key={step.id} className={`flex items-center ${index < steps.length - 1 ? 'flex-1' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep >= step.id 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {step.id}
                  </div>
                  <span className="ml-2 text-sm font-medium text-gray-700">{step.title}</span>
                  {index < steps.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-4 ${
                      currentStep > step.id ? 'bg-blue-600' : 'bg-gray-200'
                    }`}></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Step content */}
          {renderStep()}
        </CardContent>
      </Card>
    </div>
  );
};

// CourseSelectionStep Component
interface CourseSelectionStepProps {
  userId: number;
  selectedCourses: Course[];
  setSelectedCourses: (courses: Course[]) => void;
  studyPlanData: any;
  setStudyPlanData: (data: any) => void;
  onNext: () => void;
}

const CourseSelectionStep: React.FC<CourseSelectionStepProps> = ({
  userId,
  selectedCourses,
  setSelectedCourses,
  studyPlanData,
  setStudyPlanData,
  onNext
}) => {
  const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRegisteredCourses();
  }, [userId]);

  const fetchRegisteredCourses = async () => {
    try {
      const url = `http://localhost:4000/api/studyplan/registered-courses?userId=${userId}`;
      console.log('Fetching from URL:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      // Log response details for debugging
      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const responseText = await response.text();
        console.error('Non-JSON response received:', responseText);
        throw new Error('Server returned non-JSON response');
      }
      
      const data = await response.json();
      console.log('Raw response data:', data);
      
      // Extract the courses array from the response
      const courses = data.courses || data; // Handle both {courses: [...]} and [...] formats
      console.log('Extracted courses:', courses);
      
      // Validate that courses is an array
      if (!Array.isArray(courses)) {
        console.error('Courses is not an array:', courses);
        throw new Error('Invalid response format: courses data is not an array');
      }
      
      setAvailableCourses(courses);
      
    } catch (error) {
      console.error('Error fetching courses:', error);
      
      // More specific error messages
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        setError('Network error. Please check your connection and CORS configuration.');
      } else if (error.message.includes('Unexpected token')) {
        setError('Server returned invalid data. Please contact support.');
      } else {
        setError(error.message || 'Failed to load courses. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCourseSelect = (course: Course) => {
    if (selectedCourses.some(c => c.id === course.id)) {
      // Remove course
      const newSelectedCourses = selectedCourses.filter(c => c.id !== course.id);
      setSelectedCourses(newSelectedCourses);
      
      // Update study plan data
      const newCourseIds = newSelectedCourses.map(c => c.id);
      setStudyPlanData(prev => ({
        ...prev,
        course_ids: newCourseIds
      }));
    } else if (selectedCourses.length < 5) {
      // Add course
      const newSelectedCourses = [...selectedCourses, course];
      setSelectedCourses(newSelectedCourses);
      
      // Update study plan data
      const newCourseIds = newSelectedCourses.map(c => c.id);
      setStudyPlanData(prev => ({
        ...prev,
        course_ids: newCourseIds
      }));
    }
  };

  const canProceed = selectedCourses.length > 0;

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-gray-600">Loading courses...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 mb-4">{error}</div>
        <button
          onClick={fetchRegisteredCourses}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Select Courses for Your Study Plan</h3>
      <p className="text-green-600 mb-4">Choose up to 5 courses from your registered courses</p>
      
      {availableCourses.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-600">No registered courses found.</div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {availableCourses.map(course => (
              <Card
                key={course.id}
                className={`cursor-pointer transition-all ${
                  selectedCourses.some(c => c.id === course.id)
                    ? 'border-white-500 bg-black-50'
                    : 'border-gray-200 hover:border-gray-300'
                } ${selectedCourses.length >= 5 && !selectedCourses.some(c => c.id === course.id) ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => handleCourseSelect(course)}
              >
                <CardContent className="p-4">
                  <h4 className="font-semibold text-white-900">{course.course_name}</h4>
                  {course.description && (
                    <p className="text-sm text-white-600 mt-1">{course.description}</p>
                  )}
                  {course.duration_weeks && (
                    <p className="text-sm text-white-500 mt-2">Duration: {course.duration_weeks} weeks</p>
                  )}
                  {course.createdAt && (
                    <p className="text-sm text-white-500 mt-1">
                      Created: {new Date(course.createdAt).toLocaleDateString()}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex justify-between items-center">
            <div className="text-sm text-white-600">
              Selected: {selectedCourses.length}/5 courses
              {selectedCourses.length >= 5 && (
                <span className="text-orange-600 ml-2">(Maximum reached)</span>
              )}
            </div>
            <button
          onClick={onNext}
          disabled={!canProceed}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            canProceed
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Next: Set Schedule
        </button>
          </div>
        </>
      )}
    </div>
  );
};

// CourseScheduleStep Component
interface CourseScheduleStepProps {
  selectedCourses: Course[];
  studyPlanData: any;
  setStudyPlanData: (data: any) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const CourseScheduleStep: React.FC<CourseScheduleStepProps> = ({
  selectedCourses,
  studyPlanData,
  setStudyPlanData,
  onNext,
  onPrevious
}) => {
  const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const updateCourseSettings = (courseId: number, settings: Partial<CourseSettings>) => {
    setStudyPlanData(prev => ({
      ...prev,
      course_settings: {
        ...prev.course_settings,
        [courseId]: {
          daily_hours: 1,
          study_days: [],
          notes: '',
          ...prev.course_settings[courseId],
          ...settings
        }
      }
    }));
  };

  const handleDayToggle = (courseId: number, day: string) => {
    const currentSettings = studyPlanData.course_settings[courseId] || { daily_hours: 1, study_days: [], notes: '' };
    const newStudyDays = currentSettings.study_days.includes(day)
      ? currentSettings.study_days.filter(d => d !== day)
      : [...currentSettings.study_days, day];
    
    updateCourseSettings(courseId, { study_days: newStudyDays });
  };

  const canProceed = selectedCourses.every(course => {
    const settings = studyPlanData.course_settings[course.id];
    return settings && settings.study_days.length > 0 && settings.daily_hours > 0;
  });

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Set Schedule for Each Course</h3>
      <p className="text-green-600 mb-4">Configure study time and days for each selected course</p>
      
      <div className="space-y-4 mb-6">
        {selectedCourses.map(course => {
          const settings = studyPlanData.course_settings[course.id] || { daily_hours: 1, study_days: [], notes: '' };
          
          return (
            <Card key={course.id} className="border-gray-200">
              <CardContent className="p-4">
                <h4 className="font-semibold text-white-900 mb-3">{course.course_name.toUpperCase()}</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-blue-700 mb-1">
                      Daily Study Hours
                    </label>
                    <input
                      type="number"
                      min="0.5"
                      max="8"
                      step="0.5"
                      value={settings.daily_hours}
                      onChange={(e) => updateCourseSettings(course.id, { daily_hours: parseFloat(e.target.value) })}
                      className="w-full border rounded-md p-2"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-blue-700 mb-1">
                      Study Days
                    </label>
                    <div className="grid grid-cols-2 gap-1">
                      {weekdays.map(day => (
                        <label key={day} className="flex items-center text-sm">
                          <input
                            type="checkbox"
                            checked={settings.study_days.includes(day)}
                            onChange={() => handleDayToggle(course.id, day)}
                            className="h-4 w-4 text-blue-600 mr-2"
                          />
                          {day.slice(0, 3)}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="mt-3">
                  <label className="block text-sm font-medium text-blue-700 mb-1">
                    Notes (optional)
                  </label>
                  <textarea
                    value={settings.notes}
                    onChange={(e) => updateCourseSettings(course.id, { notes: e.target.value })}
                    className="w-full border rounded-md p-2 h-20"
                    placeholder="Add any specific notes for this course..."
                  />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="flex justify-between items-center">
        <button
          onClick={onPrevious}
          className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
        >
          Previous
        </button>
        <button
          onClick={onNext}
          disabled={!canProceed}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            canProceed
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Next: Review & Save
        </button>
      </div>
    </div>
  );
};

// ReviewStep Component
interface ReviewStepProps {
  studyPlanData: any;
  setStudyPlanData: (data: any) => void;
  selectedCourses: Course[];
  onSave: () => void;
  onPrevious: () => void;
}

const ReviewStep: React.FC<ReviewStepProps> = ({
  studyPlanData,
  setStudyPlanData,
  selectedCourses,
  onSave,
  onPrevious
}) => {
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      await onSave();
    } finally {
      setLoading(false);
    }
  };

  const totalDailyHours = Object.values(studyPlanData.course_settings).reduce(
    (sum: number, settings: any) => sum + settings.daily_hours, 0
  );

  const allStudyDays = Array.from(
    new Set(
      Object.values(studyPlanData.course_settings)
        .flatMap((settings: any) => settings.study_days)
    )
  );

  const canSave = studyPlanData.plan_name.trim() && studyPlanData.start_date && studyPlanData.end_date;

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Review Your Study Plan</h3>
      <p className="text-green-600 mb-4">Review and finalize your study plan details</p>
      
      {/* Plan Basic Info */}
      <Card className="mb-4">
        <CardContent className="p-4">
          <h4 className="font-semibold text-white-900 mb-3">Plan Details</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-blue-700 mb-1">
                Plan Name *
              </label>
              <input
                type="text"
                value={studyPlanData.plan_name}
                onChange={(e) => setStudyPlanData(prev => ({ ...prev, plan_name: e.target.value }))}
                className="w-full border rounded-md p-2"
                placeholder="e.g., Multi-Course Study Plan"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-700 mb-1">
                Total Daily Study Time
              </label>
              <div className="w-full border rounded-md p-2">
                {totalDailyHours} hours
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-blue-700 mb-1">
                Start Date *
              </label>
              <input
                type="date"
                value={studyPlanData.start_date}
                onChange={(e) => setStudyPlanData(prev => ({ ...prev, start_date: e.target.value }))}
                className="w-full border rounded-md p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date *
              </label>
              <input
                type="date"
                value={studyPlanData.end_date}
                onChange={(e) => setStudyPlanData(prev => ({ ...prev, end_date: e.target.value }))}
                className="w-full border rounded-md p-2"
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Selected Courses Summary */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <h4 className="font-semibold text-white-900 mb-3">Selected Courses ({selectedCourses.length})</h4>
          
          <div className="space-y-3">
            {selectedCourses.map(course => {
              const settings = studyPlanData.course_settings[course.id];
              
              return (
                <div key={course.id} className="border rounded-md p-3 bg-black-50">
                  <div className="flex justify-between items-start mb-2">
                    <h5 className="font-medium text-white-900">{course.course_name.toUpperCase()}</h5>
                    <span className="text-sm text-blue-600 font-medium">
                      {settings.daily_hours} hours/day
                    </span>
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    <strong>Study Days:</strong> {settings.study_days.join(', ')}
                  </div>
                  
                  {settings.notes && (
                    <div className="text-sm text-white-600 mt-1">
                      <strong>Notes:</strong> {settings.notes}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          <div className="mt-4 p-4 bg-black-900 rounded-lg border">
            <div className="text-sm text-white mb-2">
                <strong className="text-green-600">Summary:</strong> 
                <span className="font-semibold text-white ml-1">
                {totalDailyHours} total hours/day across {allStudyDays.length} study days
                </span>
            </div>
            <div className="text-sm text-gray-200">
                <strong className="text-green-600">Study Days:</strong> 
                <span className="font-semibold text-white ml-1">
                {allStudyDays.join(', ')}
                </span>
            </div>
            </div>
        </CardContent>
      </Card>

      <div className="flex justify-between items-center">
        <button
          onClick={onPrevious}
          className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
        >
          Previous
        </button>
        <button
          onClick={handleSave}
          disabled={!canSave || loading}
          className={`flex items-center px-6 py-2 rounded-lg font-medium transition-colors ${
            canSave && !loading
              ? 'bg-green-600 text-white hover:bg-green-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          <Save className="w-4 h-4 mr-2" />
          {loading ? 'Saving...' : 'Save Study Plan'}
        </button>
      </div>
    </div>
  );
};

export default StudyPlanPopup;