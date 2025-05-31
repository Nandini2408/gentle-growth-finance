import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';
import { useExpenses } from './ExpenseContext';

export interface Notification {
  id: string;
  type: 'achievement' | 'warning' | 'nudge' | 'weekly_report';
  title: string;
  message: string;
  created_at: Date;
  is_read: boolean;
  icon?: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'created_at' | 'is_read'>) => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  clearNotification: (id: string) => Promise<void>;
  clearAllNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: React.ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const { expenses, savingsGoals } = useExpenses();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Fetch notifications from Supabase
  const fetchNotifications = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching notifications:', error);
    } else {
      const formattedNotifications = data.map(notification => ({
        ...notification,
        created_at: new Date(notification.created_at)
      }));
      setNotifications(formattedNotifications);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();
    } else {
      setNotifications([]);
    }
  }, [user]);

  const addNotification = useCallback(async (notification: Omit<Notification, 'id' | 'created_at' | 'is_read'>) => {
    if (!user) return;

    const { data, error } = await supabase
      .from('notifications')
      .insert([
        {
          user_id: user.id,
          type: notification.type,
          title: notification.title,
          message: notification.message,
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Error adding notification:', error);
    } else {
      const newNotification = {
        ...data,
        created_at: new Date(data.created_at),
        icon: notification.icon
      };
      setNotifications(prev => [newNotification, ...prev]);
    }
  }, [user]);

  const markAsRead = useCallback(async (id: string) => {
    if (!user) return;

    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', id);

    if (error) {
      console.error('Error marking notification as read:', error);
    } else {
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === id ? { ...notification, is_read: true } : notification
        )
      );
    }
  }, [user]);

  const markAllAsRead = useCallback(async () => {
    if (!user) return;

    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', user.id)
      .eq('is_read', false);

    if (error) {
      console.error('Error marking all notifications as read:', error);
    } else {
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, is_read: true }))
      );
    }
  }, [user]);

  const clearNotification = useCallback(async (id: string) => {
    if (!user) return;

    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error clearing notification:', error);
    } else {
      setNotifications(prev => prev.filter(notification => notification.id !== id));
    }
  }, [user]);

  const clearAllNotifications = useCallback(async () => {
    if (!user) return;

    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('user_id', user.id);

    if (error) {
      console.error('Error clearing all notifications:', error);
    } else {
      setNotifications([]);
    }
  }, [user]);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  // Smart notification triggers (keep existing logic but simplified)
  useEffect(() => {
    if (!user) return;

    // Check for savings goal milestones
    savingsGoals.forEach(goal => {
      const progress = (goal.current_amount / goal.target_amount) * 100;
      
      if (progress >= 50 && progress < 55 && goal.current_amount > 0) {
        addNotification({
          type: 'achievement',
          title: 'Halfway There! 🎉',
          message: `You're 50% of the way to your "${goal.name}" goal! Keep up the great work!`,
          icon: '🎯'
        });
      }
      
      if (progress >= 100) {
        addNotification({
          type: 'achievement',
          title: 'Goal Achieved! 🏆',
          message: `Congratulations! You've reached your "${goal.name}" goal of $${goal.target_amount.toFixed(2)}!`,
          icon: '🏆'
        });
      }
    });
  }, [savingsGoals, addNotification, user]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        clearNotification,
        clearAllNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
