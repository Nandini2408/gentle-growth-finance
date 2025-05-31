
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useExpenses } from './ExpenseContext';

export interface Notification {
  id: string;
  type: 'achievement' | 'warning' | 'nudge' | 'success';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  icon?: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotification: (id: string) => void;
  clearAllNotifications: () => void;
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
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { expenses, savingsGoals } = useExpenses();

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false,
    };
    
    setNotifications(prev => [newNotification, ...prev]);
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  }, []);

  const clearNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Smart notification triggers
  useEffect(() => {
    // Check for savings goal milestones
    savingsGoals.forEach(goal => {
      const progress = (goal.currentAmount / goal.targetAmount) * 100;
      
      if (progress >= 50 && progress < 55 && goal.currentAmount > 0) {
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
          message: `Congratulations! You've reached your "${goal.name}" goal of $${goal.targetAmount.toFixed(2)}!`,
          icon: '🏆'
        });
      }
    });
  }, [savingsGoals, addNotification]);

  useEffect(() => {
    // Check spending patterns
    const thisWeek = expenses.filter(expense => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return expense.date >= weekAgo;
    });

    const lastWeek = expenses.filter(expense => {
      const twoWeeksAgo = new Date();
      twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return expense.date >= twoWeeksAgo && expense.date < weekAgo;
    });

    // Group by category
    const thisWeekByCategory: { [key: string]: number } = {};
    const lastWeekByCategory: { [key: string]: number } = {};

    thisWeek.forEach(expense => {
      thisWeekByCategory[expense.category] = (thisWeekByCategory[expense.category] || 0) + expense.amount;
    });

    lastWeek.forEach(expense => {
      lastWeekByCategory[expense.category] = (lastWeekByCategory[expense.category] || 0) + expense.amount;
    });

    // Check for significant increases
    Object.keys(thisWeekByCategory).forEach(category => {
      const thisWeekAmount = thisWeekByCategory[category];
      const lastWeekAmount = lastWeekByCategory[category] || 0;
      
      if (lastWeekAmount > 0 && thisWeekAmount > lastWeekAmount * 1.5) {
        addNotification({
          type: 'warning',
          title: 'Spending Alert 📊',
          message: `Your ${category} spending has increased by ${Math.round(((thisWeekAmount - lastWeekAmount) / lastWeekAmount) * 100)}% this week. Consider a mindful spending day!`,
          icon: '⚠️'
        });
      }
    });

    // Positive nudges
    if (thisWeek.length === 0 && lastWeek.length > 0) {
      addNotification({
        type: 'nudge',
        title: 'Great Self-Control! 💪',
        message: "You haven't logged any expenses this week. If you've been mindful with spending, that's amazing!",
        icon: '🌟'
      });
    }
  }, [expenses, addNotification]);

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
