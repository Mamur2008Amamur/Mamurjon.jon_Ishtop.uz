import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const ActivityTracker = () => {
  const location = useLocation();

  useEffect(() => {
    const logActivity = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        await supabase.from('user_activity').insert([
          {
            user_id: user?.id || null,
            action: 'page_view',
            page: location.pathname,
            details: { 
              timestamp: new Date().toISOString(),
              userAgent: navigator.userAgent 
            }
          }
        ]);
      } catch (error) {
        // Silently fail if table doesn't exist yet
        console.warn('Activity logging failed. Make sure user_activity table exists.');
      }
    };

    logActivity();
  }, [location]);

  return null;
};

export default ActivityTracker;
