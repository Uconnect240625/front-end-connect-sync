
import React, { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Utensils, Save, Calendar } from 'lucide-react';

const MessMenuAdmin = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [day, setDay] = useState('Monday');
  const [meal, setMeal] = useState('Breakfast');
  const [items, setItems] = useState('');
  const [loading, setLoading] = useState(false);

  // Check if user is admin
  useEffect(() => {
    if (user) {
      checkAdminStatus();
    }
  }, [user]);

  const checkAdminStatus = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user?.id)
        .single();

      if (error || data?.role !== 'admin') {
        toast({
          title: "Access Denied",
          description: "You need admin privileges to access this page",
          variant: "destructive",
        });
        // Redirect to main page
        window.location.href = '/uconnect';
      }
    } catch (error) {
      console.error('Error checking admin status:', error);
    }
  };

  const getDayNumber = (dayName: string): number => {
    const dayMap: { [key: string]: number } = {
      'Sunday': 0,
      'Monday': 1,
      'Tuesday': 2,
      'Wednesday': 3,
      'Thursday': 4,
      'Friday': 5,
      'Saturday': 6
    };
    return dayMap[dayName] || 1;
  };

  const saveMenu = async () => {
    if (!items.trim()) {
      toast({
        title: "Error",
        description: "Please enter menu items",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Get current week's Monday
      const today = new Date();
      const monday = new Date(today);
      monday.setDate(today.getDate() - today.getDay() + 1);
      const weekStart = monday.toISOString().split('T')[0];

      const dayNumber = getDayNumber(day);

      // Check if menu already exists for this day/meal/week
      const { data: existingMenu, error: fetchError } = await supabase
        .from('mess_menus')
        .select('id')
        .eq('day_of_week', dayNumber)
        .eq('meal_type', meal)
        .eq('week_start_date', weekStart)
        .maybeSingle();

      if (fetchError) {
        throw fetchError;
      }

      let error;
      if (existingMenu) {
        // Update existing menu
        const { error: updateError } = await supabase
          .from('mess_menus')
          .update({ 
            items: items.trim(),
            updated_at: new Date().toISOString()
          })
          .eq('id', existingMenu.id);
        error = updateError;
      } else {
        // Insert new menu
        const { error: insertError } = await supabase
          .from('mess_menus')
          .insert({
            day_of_week: dayNumber,
            meal_type: meal,
            items: items.trim(),
            week_start_date: weekStart
          });
        error = insertError;
      }

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: `Menu updated for ${day} - ${meal}`,
      });

      // Clear the form
      setItems('');
    } catch (error) {
      console.error('Error saving menu:', error);
      toast({
        title: "Error",
        description: "Failed to save menu. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-md mx-auto pt-20 px-4">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Utensils className="text-red-600" size={28} />
            <h2 className="text-2xl font-bold text-red-600">Mess Menu Admin</h2>
          </div>
          <p className="text-gray-600 flex items-center justify-center gap-1">
            <Calendar size={16} />
            Manage weekly mess menu
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
          <div className="mb-4">
            <label htmlFor="day" className="block font-medium mb-2 text-gray-700">
              Select Day
            </label>
            <select 
              id="day" 
              value={day} 
              onChange={(e) => setDay(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
            >
              <option>Monday</option>
              <option>Tuesday</option>
              <option>Wednesday</option>
              <option>Thursday</option>
              <option>Friday</option>
              <option>Saturday</option>
              <option>Sunday</option>
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="meal" className="block font-medium mb-2 text-gray-700">
              Select Meal
            </label>
            <select 
              id="meal" 
              value={meal} 
              onChange={(e) => setMeal(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
            >
              <option>Breakfast</option>
              <option>Lunch</option>
              <option>Snacks</option>
              <option>Dinner</option>
            </select>
          </div>

          <div className="mb-6">
            <label htmlFor="items" className="block font-medium mb-2 text-gray-700">
              Enter Menu Items
            </label>
            <textarea 
              id="items" 
              value={items}
              onChange={(e) => setItems(e.target.value)}
              placeholder="e.g., Chole Bhature, Salad, Rice, Pickle"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors resize-none"
              rows={3}
            />
          </div>

          <button 
            onClick={saveMenu}
            disabled={loading}
            className="w-full bg-red-600 text-white py-3 rounded-md font-bold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Saving...
              </>
            ) : (
              <>
                <Save size={20} />
                Save Menu
              </>
            )}
          </button>
        </div>

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-medium text-blue-800 mb-2">📝 Quick Tips:</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Separate multiple items with commas</li>
            <li>• Updates are applied to the current week</li>
            <li>• Changes are visible immediately to students</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MessMenuAdmin;
