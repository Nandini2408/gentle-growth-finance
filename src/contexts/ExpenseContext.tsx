import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';

export interface Expense {
  id: string;
  amount: number;
  category: 'food' | 'transport' | 'entertainment' | 'shopping' | 'health' | 'other';
  description: string;
  date: Date;
  note?: string;
}

export interface SavingsGoal {
  id: string;
  name: string;
  target_amount: number;
  current_amount: number;
  deadline: Date;
  created_at: Date;
  color?: string;
}

interface ExpenseContextType {
  expenses: Expense[];
  savingsGoals: SavingsGoal[];
  addExpense: (expense: Omit<Expense, 'id'>) => Promise<void>;
  updateExpense: (id: string, expense: Partial<Expense>) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  addSavingsGoal: (goal: Omit<SavingsGoal, 'id' | 'created_at'>) => Promise<void>;
  updateSavingsGoal: (id: string, goal: Partial<SavingsGoal>) => Promise<void>;
  deleteSavingsGoal: (id: string) => Promise<void>;
  getExpensesByCategory: (category?: string) => Expense[];
  getTotalExpenses: () => number;
  filterExpenses: (category?: string, startDate?: Date, endDate?: Date) => Expense[];
  getMonthlyExpenses: (month: number, year: number) => Expense[];
  getCategoryTotals: () => { [key: string]: number };
  getAverageDailySpending: () => number;
  getTopCategory: () => string;
  isLoading: boolean;
}

const ExpenseContext = createContext<ExpenseContextType | null>(null);

export const useExpenses = () => {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error('useExpenses must be used within an ExpenseProvider');
  }
  return context;
};

export const ExpenseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch expenses from Supabase
  const fetchExpenses = async () => {
    if (!user) return;
    
    setIsLoading(true);
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching expenses:', error);
    } else {
      const formattedExpenses = data.map(expense => ({
        ...expense,
        date: new Date(expense.date)
      }));
      setExpenses(formattedExpenses);
    }
    setIsLoading(false);
  };

  // Fetch savings goals from Supabase
  const fetchSavingsGoals = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('savings_goals')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching savings goals:', error);
    } else {
      const formattedGoals = data.map(goal => ({
        ...goal,
        deadline: new Date(goal.deadline),
        created_at: new Date(goal.created_at)
      }));
      setSavingsGoals(formattedGoals);
    }
  };

  useEffect(() => {
    if (user) {
      fetchExpenses();
      fetchSavingsGoals();
    } else {
      setExpenses([]);
      setSavingsGoals([]);
    }
  }, [user]);

  const addExpense = async (expenseData: Omit<Expense, 'id'>) => {
    if (!user) return;

    const { data, error } = await supabase
      .from('expenses')
      .insert([
        {
          user_id: user.id,
          amount: expenseData.amount,
          category: expenseData.category,
          description: expenseData.description,
          note: expenseData.note,
          date: expenseData.date.toISOString().split('T')[0],
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Error adding expense:', error);
      throw error;
    } else {
      const newExpense = {
        ...data,
        date: new Date(data.date)
      };
      setExpenses(prev => [newExpense, ...prev]);
    }
  };

  const updateExpense = async (id: string, expenseData: Partial<Expense>) => {
    if (!user) return;

    const updateData: any = { ...expenseData };
    if (updateData.date) {
      updateData.date = updateData.date.toISOString().split('T')[0];
    }

    const { error } = await supabase
      .from('expenses')
      .update(updateData)
      .eq('id', id);

    if (error) {
      console.error('Error updating expense:', error);
      throw error;
    } else {
      setExpenses(prev => 
        prev.map(expense => 
          expense.id === id ? { ...expense, ...expenseData } : expense
        )
      );
    }
  };

  const deleteExpense = async (id: string) => {
    if (!user) return;

    const { error } = await supabase
      .from('expenses')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting expense:', error);
      throw error;
    } else {
      setExpenses(prev => prev.filter(expense => expense.id !== id));
    }
  };

  const addSavingsGoal = async (goalData: Omit<SavingsGoal, 'id' | 'created_at'>) => {
    if (!user) return;

    const { data, error } = await supabase
      .from('savings_goals')
      .insert([
        {
          user_id: user.id,
          name: goalData.name,
          target_amount: goalData.target_amount,
          current_amount: goalData.current_amount,
          deadline: goalData.deadline.toISOString().split('T')[0],
          color: goalData.color,
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Error adding savings goal:', error);
      throw error;
    } else {
      const newGoal = {
        ...data,
        deadline: new Date(data.deadline),
        created_at: new Date(data.created_at)
      };
      setSavingsGoals(prev => [...prev, newGoal]);
    }
  };

  const updateSavingsGoal = async (id: string, goalData: Partial<SavingsGoal>) => {
    if (!user) return;

    const updateData: any = { ...goalData };
    if (updateData.deadline) {
      updateData.deadline = updateData.deadline.toISOString().split('T')[0];
    }

    const { error } = await supabase
      .from('savings_goals')
      .update(updateData)
      .eq('id', id);

    if (error) {
      console.error('Error updating savings goal:', error);
      throw error;
    } else {
      setSavingsGoals(prev => 
        prev.map(goal => 
          goal.id === id ? { ...goal, ...goalData } : goal
        )
      );
    }
  };

  const deleteSavingsGoal = async (id: string) => {
    if (!user) return;

    const { error } = await supabase
      .from('savings_goals')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting savings goal:', error);
      throw error;
    } else {
      setSavingsGoals(prev => prev.filter(goal => goal.id !== id));
    }
  };

  // Keep existing helper functions the same
  const getExpensesByCategory = (category?: string) => {
    if (!category) return expenses;
    return expenses.filter(expense => expense.category === category);
  };

  const getTotalExpenses = () => {
    return expenses.reduce((total, expense) => total + expense.amount, 0);
  };

  const filterExpenses = (category?: string, startDate?: Date, endDate?: Date) => {
    return expenses.filter(expense => {
      const categoryMatch = !category || expense.category === category;
      const startDateMatch = !startDate || expense.date >= startDate;
      const endDateMatch = !endDate || expense.date <= endDate;
      return categoryMatch && startDateMatch && endDateMatch;
    });
  };

  const getMonthlyExpenses = (month: number, year: number) => {
    return expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate.getMonth() === month && expenseDate.getFullYear() === year;
    });
  };

  const getCategoryTotals = () => {
    const totals: { [key: string]: number } = {};
    expenses.forEach(expense => {
      totals[expense.category] = (totals[expense.category] || 0) + expense.amount;
    });
    return totals;
  };

  const getAverageDailySpending = () => {
    if (expenses.length === 0) return 0;
    const totalDays = Math.max(1, Math.ceil((Date.now() - new Date(expenses[expenses.length - 1].date).getTime()) / (1000 * 60 * 60 * 24)));
    return getTotalExpenses() / totalDays;
  };

  const getTopCategory = () => {
    const categoryTotals = getCategoryTotals();
    const topCategory = Object.keys(categoryTotals).reduce((a, b) => 
      categoryTotals[a] > categoryTotals[b] ? a : b, 'other'
    );
    return topCategory;
  };

  return (
    <ExpenseContext.Provider value={{
      expenses,
      savingsGoals,
      addExpense,
      updateExpense,
      deleteExpense,
      addSavingsGoal,
      updateSavingsGoal,
      deleteSavingsGoal,
      getExpensesByCategory,
      getTotalExpenses,
      filterExpenses,
      getMonthlyExpenses,
      getCategoryTotals,
      getAverageDailySpending,
      getTopCategory,
      isLoading
    }}>
      {children}
    </ExpenseContext.Provider>
  );
};
