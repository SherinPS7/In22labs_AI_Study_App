import { useState, useEffect } from 'react';
import {
  getAllStudyPlans,
  createStudyPlan,
  updateStudyPlan,
  deleteStudyPlan
} from '@/api/studyplan';

export const useStudyPlan = (userId = 1) => {
  // Form state for creating/editing plans
  const [planForm, setPlanForm] = useState({
    plan_name: '',
    start_date: '',
    end_date: '',
    study_time: 60,
    weekdays: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].reduce((acc, d) => ({ ...acc, [d]: true }), {})
  });

  const getPlanStatus = (startDate, endDate) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (now < start) return 'upcoming';
    if (now > end) return 'completed';
    return 'active';
  };

  // State management
  const [plans, setPlans] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Current plan tracking
  const [activePlan, setActivePlan] = useState(null);
  const [studyLogs, setStudyLogs] = useState([]);
  const [todayStudied, setTodayStudied] = useState(0);

  useEffect(() => {
    fetchPlans();
    fetchStudyLogs(); 
  }, [userId]);

  useEffect(() => {
    if (plans.length > 0) {
      const active = plans.find(plan => 
        getPlanStatus(plan.start_date, plan.end_date) === 'active'
      );
      setActivePlan(active || null);
    }
  }, [plans]);
  // Fetch all plans for the user
 const fetchPlans = async () => {
  try {
    setLoading(true);
    setError(null);
    console.log('Fetching plans for user:', userId);
    const data = await getAllStudyPlans(userId);
    console.log('API Response:', data);
    
    const plansArray = data.plans || data.studyPlans || data || [];
    console.log('Plans array:', plansArray);
    
    setPlans(plansArray);
    
    // Find and set active plan AFTER plans are loaded
    const active = plansArray.find(plan => 
      getPlanStatus(plan.start_date, plan.end_date) === 'active'
    );
    setActivePlan(active || null);
    
    setError('');
  } catch (err) {
    console.error('Error fetching plans:', err);
    setError('Failed to fetch plans: ' + err.message);
    setActivePlan(null); // Ensure activePlan is null on error
  } finally {
    setLoading(false);
  }
};

const fetchStudyLogs = async () => {
    try {
      // Use localStorage to persist study logs between page refreshes
      const savedLogs = localStorage.getItem(`studyLogs_${userId}`);
      if (savedLogs) {
        const logs = JSON.parse(savedLogs);
        setStudyLogs(logs);
        
        // Calculate today's studied time from actual logs
        const today = new Date().toISOString().split('T')[0];
        const todayLog = logs.find(log => log.date === today);
        setTodayStudied(todayLog ? todayLog.minutesStudied : 0);
      } else {
        // Initialize with empty array if no saved logs
        setStudyLogs([]);
        setTodayStudied(0);
      }
    } catch (err) {
      console.error('Error fetching study logs:', err);
      setStudyLogs([]);
      setTodayStudied(0);
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
  
    try {
      if (!planForm.plan_name.trim()) {
        throw new Error('Plan name is required');
      }
      if (!planForm.start_date || !planForm.end_date) {
        throw new Error('Start and end dates are required');
      }
      if (new Date(planForm.start_date) >= new Date(planForm.end_date)) {
        throw new Error('End date must be after start date');
      }

      const selectedWeekdays = Object.entries(planForm.weekdays)
        .filter(([day, selected]) => selected)
        .map(([day]) => day);
      
      if (selectedWeekdays.length === 0) {
        throw new Error('Please select at least one study day');
      }
  
      const planData = {
        plan_name: planForm.plan_name.trim(),
        user_id: userId,
        start_date: planForm.start_date,
        end_date: planForm.end_date,
        weekdays: selectedWeekdays,
        study_time: planForm.study_time
      };

      console.log('Submitting plan data:', planData);
  
      let result;
      if (editingPlan) {
        result = await updateStudyPlan(editingPlan.id, planData);
        console.log('Update result:', result);
      } else {
        result = await createStudyPlan(planData);
        console.log('Create result:', result);
      }
  
      setSuccess(editingPlan ? 'Plan updated successfully!' : 'Plan created successfully!');
      
      resetForm();
      
      setTimeout(() => {
        fetchPlans();
      }, 100);
      
    } catch (err) {
      console.error('Submit error:', err);
      setError(err.message || 'An error occurred while saving the plan');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (planId) => {
    if (!confirm('Are you sure you want to delete this plan?')) return;

    try {
      setLoading(true);
      console.log('Deleting plan:', planId);
      await deleteStudyPlan(planId);
      setSuccess('Plan deleted successfully!');
      
      setTimeout(() => {
        fetchPlans();
      }, 100);
    } catch (err) {
      console.error('Delete error:', err);
      setError('An error occurred while deleting the plan: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setPlanForm({
      plan_name: '',
      start_date: '',
      end_date: '',
      study_time: 60,
      weekdays: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].reduce((acc, d) => ({ ...acc, [d]: true }), {})
    });
    setShowCreateForm(false);
    setEditingPlan(null);
  };

  const startEdit = (plan) => {
    const weekdaysObj = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].reduce((acc, d) => ({ 
      ...acc, 
      [d]: plan.weekdays.includes(d) 
    }), {});

    setPlanForm({
      plan_name: plan.plan_name,
      start_date: plan.start_date,
      end_date: plan.end_date,
      study_time: plan.study_time,
      weekdays: weekdaysObj
    });
    setEditingPlan(plan);
    setShowCreateForm(true);
  };

  const handleToggleDay = (day) => {
    setPlanForm(prev => ({
      ...prev,
      weekdays: { ...prev.weekdays, [day]: !prev.weekdays[day] }
    }));
  };

  const addStudySession = () => {
    const minutes = parseInt(prompt('How many minutes did you study today?', '0'));
    if (minutes && minutes > 0) {
      const today = new Date().toISOString().split('T')[0];
      const existingLogIndex = studyLogs.findIndex(log => log.date === today);
      
      const newLog = {
        date: today,
        minutesStudied: minutes,
        completed: minutes >= (activePlan?.study_time || 60),
        planId: activePlan?.id
      };
      
      let updatedLogs;
      if (existingLogIndex >= 0) {
        updatedLogs = [...studyLogs];
        updatedLogs[existingLogIndex] = {
          ...updatedLogs[existingLogIndex],
          minutesStudied: updatedLogs[existingLogIndex].minutesStudied + minutes,
          completed: (updatedLogs[existingLogIndex].minutesStudied + minutes) >= (activePlan?.study_time || 60)
        };
      } else {
        updatedLogs = [...studyLogs, newLog];
      }
      
      setStudyLogs(updatedLogs);
      setTodayStudied(prev => prev + minutes);
      
      // IMPORTANT: Save to localStorage to persist data
      localStorage.setItem(`studyLogs_${userId}`, JSON.stringify(updatedLogs));
      
      setSuccess(`Added ${minutes} minutes to today's study log!`);
    }
  };
  
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
    fetchStudyLogs 
  };
};