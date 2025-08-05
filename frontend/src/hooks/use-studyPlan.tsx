// src/hooks/useStudyPlan.ts
import { useState, useEffect, useCallback } from 'react';
import {
  getAllStudyPlans,
  createStudyPlan,
  updateStudyPlan,
  deleteStudyPlan,
} from '@/api/studyplan';

// Types
export interface StudyPlan {
  id: number;
  plan_name: string;
  user_id: number;
  start_date: string;
  end_date: string;
  weekdays: string[];
  study_time: number;
}

export interface StudyLog {
  date: string;
  minutesStudied: number;
  completed: boolean;
  planId: number;
}

interface WeekdaysObj {
  [key: string]: boolean;
}

interface PlanForm {
  plan_name: string;
  start_date: string;
  end_date: string;
  study_time: number;
  weekdays: WeekdaysObj;
}

export const useStudyPlan = (userId: number = 1) => {
  // Form state for creating/editing plans
  const [planForm, setPlanForm] = useState<PlanForm>({
    plan_name: '',
    start_date: '',
    end_date: '',
    study_time: 60,
    weekdays: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']
      .reduce((acc, d) => ({ ...acc, [d]: true }), {} as WeekdaysObj),
  });

  // State management
  const [plans, setPlans] = useState<StudyPlan[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingPlan, setEditingPlan] = useState<StudyPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Current plan tracking
  const [activePlan, setActivePlan] = useState<StudyPlan | null>(null);
  const [studyLogs, setStudyLogs] = useState<StudyLog[]>([]);
  const [todayStudied, setTodayStudied] = useState(0);

  // Utility: determine plan status
  const getPlanStatus = useCallback((startDate: string, endDate: string): 'upcoming' | 'active' | 'completed' => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (now < start) return 'upcoming';
    if (now > end) return 'completed';
    return 'active';
  }, []);

  // Fetch all plans for the user
  const fetchPlans = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getAllStudyPlans(userId);
      const plansArray: StudyPlan[] =
        data.plans || data.studyPlans || data || [];
      setPlans(plansArray);

      // Find and set the active plan
      const active = plansArray.find(plan =>
        getPlanStatus(plan.start_date, plan.end_date) === 'active'
      );
      setActivePlan(active || null);
    } catch (err: any) {
      setError('Failed to fetch plans: ' + (err.message || String(err)));
      setActivePlan(null);
    } finally {
      setLoading(false);
    }
  }, [userId, getPlanStatus]);

  // Fetch study logs from localStorage
  const fetchStudyLogs = useCallback(() => {
    try {
      const savedLogs = localStorage.getItem(`studyLogs_${userId}`);
      if (savedLogs) {
        const logs: StudyLog[] = JSON.parse(savedLogs);
        setStudyLogs(logs);
        const today = new Date().toISOString().split('T')[0];
        const todayLog = logs.find(log => log.date === today);
        setTodayStudied(todayLog ? todayLog.minutesStudied : 0);
      } else {
        setStudyLogs([]);
        setTodayStudied(0);
      }
    } catch {
      setStudyLogs([]);
      setTodayStudied(0);
    }
  }, [userId]);

  // Sync plans/logs on userId change
  useEffect(() => {
    fetchPlans();
    fetchStudyLogs();
  }, [userId, fetchPlans, fetchStudyLogs]);

  // Update active plan when plans change
  useEffect(() => {
    if (plans.length > 0) {
      const active = plans.find(plan =>
        getPlanStatus(plan.start_date, plan.end_date) === 'active'
      );
      setActivePlan(active || null);
    }
  }, [plans, getPlanStatus]);

  // Handle form submit (create or update)
  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      if (e) e.preventDefault();
      setLoading(true);
      setError('');
      setSuccess('');
      try {
        // Validation
        if (!planForm.plan_name.trim()) throw new Error('Plan name is required');
        if (!planForm.start_date || !planForm.end_date)
          throw new Error('Start and end dates are required');
        if (new Date(planForm.start_date) >= new Date(planForm.end_date))
          throw new Error('End date must be after start date');
        const selectedWeekdays = Object.entries(planForm.weekdays)
          .filter(([, selected]) => selected)
          .map(([day]) => day);
        if (selectedWeekdays.length === 0)
          throw new Error('Please select at least one study day');

        const planData = {
          plan_name: planForm.plan_name.trim(),
          user_id: userId,
          start_date: planForm.start_date,
          end_date: planForm.end_date,
          weekdays: selectedWeekdays,
          study_time: planForm.study_time,
        };

        if (editingPlan) {
          await updateStudyPlan(editingPlan.id, planData);
          setSuccess('Plan updated successfully!');
        } else {
          await createStudyPlan(planData);
          setSuccess('Plan created successfully!');
        }

        resetForm();
        await fetchPlans(); // Re-fetch up-to-date plans
      } catch (err: any) {
        setError(err.message || 'An error occurred while saving the plan');
      } finally {
        setLoading(false);
      }
    },
    [planForm, userId, editingPlan, fetchPlans]
  );

  // Delete a plan (UI should ask confirmation before calling this!)
  const handleDelete = useCallback(
    async (planId: number) => {
      setLoading(true);
      setError('');
      setSuccess('');
      try {
        await deleteStudyPlan(planId);
        setSuccess('Plan deleted successfully!');
        await fetchPlans();
      } catch (err: any) {
        setError('An error occurred while deleting the plan: ' + (err.message || String(err)));
      } finally {
        setLoading(false);
      }
    },
    [fetchPlans]
  );

  // Reset the plan form and state
  const resetForm = useCallback(() => {
    setPlanForm({
      plan_name: '',
      start_date: '',
      end_date: '',
      study_time: 60,
      weekdays: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']
        .reduce((acc, d) => ({ ...acc, [d]: true }), {} as WeekdaysObj),
    });
    setShowCreateForm(false);
    setEditingPlan(null);
  }, []);

  // Start editing a plan
  const startEdit = useCallback((plan: StudyPlan) => {
    const weekdaysObj: WeekdaysObj = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].reduce(
      (acc, d) => ({ ...acc, [d]: plan.weekdays.includes(d) }),
      {} as WeekdaysObj
    );
    setPlanForm({
      plan_name: plan.plan_name,
      start_date: plan.start_date,
      end_date: plan.end_date,
      study_time: plan.study_time,
      weekdays: weekdaysObj,
    });
    setEditingPlan(plan);
    setShowCreateForm(true);
  }, []);

  // Toggle day in plan form
  const handleToggleDay = useCallback((day: string) => {
    setPlanForm(prev => ({
      ...prev,
      weekdays: { ...prev.weekdays, [day]: !prev.weekdays[day] },
    }));
  }, []);

  // Add a study session to logs (UI should prompt user for minutes, not this hook)
  const addStudySession = useCallback((minutes: number) => {
    if (!activePlan) return;
    if (!minutes || minutes <= 0) return;
    const today = new Date().toISOString().split('T')[0];
    const existingLogIndex = studyLogs.findIndex(log => log.date === today);

    const newLog: StudyLog = {
      date: today,
      minutesStudied: minutes,
      completed: minutes >= (activePlan.study_time || 60),
      planId: activePlan.id,
    };

    let updatedLogs: StudyLog[];
    if (existingLogIndex >= 0) {
      updatedLogs = [...studyLogs];
      updatedLogs[existingLogIndex] = {
        ...updatedLogs[existingLogIndex],
        minutesStudied:
          updatedLogs[existingLogIndex].minutesStudied + minutes,
        completed:
          (updatedLogs[existingLogIndex].minutesStudied + minutes) >=
          (activePlan.study_time || 60),
      };
    } else {
      updatedLogs = [...studyLogs, newLog];
    }

    setStudyLogs(updatedLogs);
    setTodayStudied(prev => prev + minutes);
    localStorage.setItem(`studyLogs_${userId}`, JSON.stringify(updatedLogs));
    setSuccess(`Added ${minutes} minutes to today's study log!`);
  }, [activePlan, studyLogs, userId]);

  return {
    // State
    planForm,
    plans,
    showCreateForm,
    editingPlan,
    loading,
    error,
    success,
    activePlan,
    studyLogs,
    todayStudied,

    // Actions
    setPlanForm,
    setShowCreateForm,
    setError,
    setSuccess,
    handleSubmit,
    handleDelete,
    resetForm,
    startEdit,
    handleToggleDay,
    addStudySession,
    fetchPlans,
    fetchStudyLogs, // Optional for manual refresh
  };
};
