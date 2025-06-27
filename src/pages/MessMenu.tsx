
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Utensils, ArrowLeft, Calendar } from 'lucide-react';

interface MenuData {
  [key: string]: {
    [mealType: string]: string;
  };
}

const MessMenu = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { profile } = useAuth();
  const [activeDay, setActiveDay] = useState('monday');
  const [menuData, setMenuData] = useState<MenuData>({});
  const [loading, setLoading] = useState(true);

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  // Define the meal order
  const mealOrder = ['breakfast', 'lunch', 'snacks', 'dinner'];

  useEffect(() => {
    if (profile?.university_id) {
      fetchMenuData();
    }
  }, [profile?.university_id]);

  const fetchMenuData = async () => {
    if (!profile?.university_id) {
      console.log('No university_id available');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // Get current week's Monday
      const today = new Date();
      const monday = new Date(today);
      monday.setDate(today.getDate() - today.getDay() + 1);
      const weekStart = monday.toISOString().split('T')[0];

      console.log('Fetching menu data for university:', profile.university_id);
      console.log('Week start:', weekStart);

      const { data, error } = await supabase
        .from('mess_menus')
        .select('day_of_week, meal_type, items')
        .eq('week_start_date', weekStart)
        .eq('university_id', profile.university_id)
        .order('day_of_week')
        .order('meal_type');

      if (error) {
        console.error('Error fetching menu data:', error);
        toast({
          title: "Error",
          description: "Failed to fetch mess menu data",
          variant: "destructive"
        });
        return;
      }

      console.log('Fetched menu data:', data);

      // Transform the data to match our component structure
      const transformedData: MenuData = {};
      data?.forEach(item => {
        const dayName = getDayName(item.day_of_week);
        if (!transformedData[dayName]) {
          transformedData[dayName] = {};
        }
        transformedData[dayName][item.meal_type.toLowerCase()] = item.items;
      });

      console.log('Transformed menu data:', transformedData);
      setMenuData(transformedData);
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getDayName = (dayNumber: number): string => {
    const dayMap = {
      0: 'sunday',
      1: 'monday',
      2: 'tuesday',
      3: 'wednesday',
      4: 'thursday',
      5: 'friday',
      6: 'saturday'
    };
    return dayMap[dayNumber as keyof typeof dayMap] || 'monday';
  };

  const switchDay = (dayId: string) => {
    setActiveDay(dayId);
  };

  const getMealIcon = (mealType: string) => {
    switch (mealType) {
      case 'breakfast':
        return '🍳';
      case 'lunch':
        return '🍛';
      case 'snacks':
        return '☕';
      case 'dinner':
        return '🍲';
      default:
        return '🍽️';
    }
  };

  const getSortedMeals = (dayMenu: { [mealType: string]: string }) => {
    return mealOrder
      .filter(mealType => dayMenu[mealType]) // Only include meals that exist
      .map(mealType => [mealType, dayMenu[mealType]]);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading mess menu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-lg mx-auto">
        <header className="text-center mb-6">
          <button
            onClick={() => navigate('/uconnect')}
            className="mb-4 flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to U Connect
          </button>
          
          <div className="flex items-center justify-center gap-2 mb-2">
            <Utensils className="text-red-600" size={28} />
            <h2 className="text-2xl font-semibold text-foreground">Mess Menu</h2>
          </div>
          <p className="text-muted-foreground flex items-center justify-center gap-1">
            <Calendar size={16} />
            Check your weekly meal plan
          </p>
        </header>

        <div className="flex justify-between mb-6 overflow-x-auto gap-2 pb-2">
          {days.map((day, index) => (
            <button
              key={day}
              className={`px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                activeDay === day
                  ? 'bg-red-600 text-white shadow-lg'
                  : 'bg-muted text-muted-foreground hover:bg-accent'
              }`}
              onClick={() => switchDay(day)}
            >
              {dayLabels[index]}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {menuData[activeDay] ? (
            getSortedMeals(menuData[activeDay]).map(([meal, items]) => (
              <div
                key={meal}
                className="bg-card rounded-xl p-4 shadow-sm border border-border hover:shadow-md transition-shadow"
              >
                <h3 className="font-semibold text-red-600 mb-2 capitalize flex items-center gap-2">
                  <span className="text-lg">{getMealIcon(meal)}</span>
                  {meal}
                </h3>
                <p className="text-card-foreground leading-relaxed">{items}</p>
              </div>
            ))
          ) : (
            <div className="bg-card rounded-xl p-8 shadow-sm text-center border border-border">
              <div className="text-4xl mb-3">🍽️</div>
              <h3 className="text-lg font-medium text-card-foreground mb-2">No Menu Available</h3>
              <p className="text-muted-foreground">Menu for {activeDay} will be updated soon!</p>
            </div>
          )}
        </div>

        <div className="mt-8 text-center">
          
        </div>

        {profile?.role === 'admin' && (
          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/mess-menu-admin')}
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              Manage Mess Menu
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessMenu;
