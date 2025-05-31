
import React, { createContext, useContext, useState, useEffect } from 'react';

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
  targetAmount: number;
  currentAmount: number;
  deadline: Date;
  createdAt: Date;
  color?: string;
}

interface ExpenseContextType {
  expenses: Expense[];
  savingsGoals: SavingsGoal[];
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  updateExpense: (id: string, expense: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
  addSavingsGoal: (goal: Omit<SavingsGoal, 'id' | 'createdAt'>) => void;
  updateSavingsGoal: (id: string, goal: Partial<SavingsGoal>) => void;
  deleteSavingsGoal: (id: string) => void;
  getExpensesByCategory: (category?: string) => Expense[];
  getTotalExpenses: () => number;
  filterExpenses: (category?: string, startDate?: Date, endDate?: Date) => Expense[];
  getMonthlyExpenses: (month: number, year: number) => Expense[];
  getCategoryTotals: () => { [key: string]: number };
  getAverageDailySpending: () => number;
  getTopCategory: () => string;
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
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([]);

  useEffect(() => {
    // Load expenses from localStorage
    const storedExpenses = localStorage.getItem('budgetbloom_expenses');
    if (storedExpenses) {
      const parsed = JSON.parse(storedExpenses);
      const expensesWithDates = parsed.map((expense: any) => ({
        ...expense,
        date: new Date(expense.date)
      }));
      setExpenses(expensesWithDates);
    }

    // Load savings goals from localStorage
    const storedGoals = localStorage.getItem('budgetbloom_savings_goals');
    if (storedGoals) {
      const parsed = JSON.parse(storedGoals);
      const goalsWithDates = parsed.map((goal: any) => ({
        ...goal,
        deadline: new Date(goal.deadline),
        createdAt: new Date(goal.createdAt)
      }));
      setSavingsGoals(goalsWithDates);
    }
  }, []);

  useEffect(() => {
    // Save expenses to localStorage whenever expenses change
    localStorage.setItem('budgetbloom_expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    // Save savings goals to localStorage whenever goals change
    localStorage.setItem('budgetbloom_savings_goals', JSON.stringify(savingsGoals));
  }, [savingsGoals]);

  const addExpense = (expenseData: Omit<Expense, 'id'>) => {
    const newExpense: Expense = {
      ...expenseData,
      id: Date.now().toString()
    };
    setExpenses(prev => [newExpense, ...prev]);
  };

  const updateExpense = (id: string, expenseData: Partial<Expense>) => {
    setExpenses(prev => 
      prev.map(expense => 
        expense.id === id ? { ...expense, ...expenseData } : expense
      )
    );
  };

  const deleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(expense => expense.id !== id));
  };

  const addSavingsGoal = (goalData: Omit<SavingsGoal, 'id' | 'createdAt'>) => {
    const newGoal: SavingsGoal = {
      ...goalData,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    setSavingsGoals(prev => [...prev, newGoal]);
  };

  const updateSavingsGoal = (id: string, goalData: Partial<SavingsGoal>) => {
    setSavingsGoals(prev => 
      prev.map(goal => 
        goal.id === id ? { ...goal, ...goalData } : goal
      )
    );
  };

  const deleteSavingsGoal = (id: string) => {
    setSavingsGoals(prev => prev.filter(goal => goal.id !== id));
  };

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
      getTopCategory
    }}>
      {children}
    </ExpenseContext.Provider>
  );
};
