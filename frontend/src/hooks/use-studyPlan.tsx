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
    // Initialize with sample data for demo
    if (studyLogs.length === 0) {
      const sampleLogs = [
        { date: new Date().toISOString().split('T')[0], minutesStudied: 0, completed: false },
        { date: new Date(Date.now() - 24*60*60*1000).toISOString().split('T')[0], minutesStudied: 90, completed: true },
        { date: new Date(Date.now() - 2*24*60*60*1000).toISOString().split('T')[0], minutesStudied: 60, completed: true },
      ];
      setStudyLogs(sampleLogs);
      setTodayStudied(0);
    }
  }, [userId]);

  // Fetch all plans for the user
  const fetchPlans = async () => {
    try {
      setLoading(true);
      console.log('Fetching plans for user:', userId);
      const data = await getAllStudyPlans(userId);
      console.log('API Response:', data);
      
      const plansArray = data.plans || data.studyPlans || data || [];
      console.log('Plans array:', plansArray);
      
      setPlans(plansArray);
      
      const active = plansArray.find(p => new Date(p.end_date) >= new Date()) || plansArray[0];
      setActivePlan(active);
      
      setError('');
    } catch (err) {
      console.error('Error fetching plans:', err);
      setError('Failed to fetch plans: ' + err.message);
    } finally {
      setLoading(false);
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
      
      if (existingLogIndex >= 0) {
        const updatedLogs = [...studyLogs];
        updatedLogs[existingLogIndex] = {
          ...updatedLogs[existingLogIndex],
          minutesStudied: updatedLogs[existingLogIndex].minutesStudied + minutes,
          completed: (updatedLogs[existingLogIndex].minutesStudied + minutes) >= (activePlan?.study_time || 60)
        };
        setStudyLogs(updatedLogs);
      } else {
        setStudyLogs([...studyLogs, newLog]);
      }
      
      setTodayStudied(prev => prev + minutes);
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
    fetchPlans
  };
};