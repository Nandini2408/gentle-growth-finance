
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Expense {
  id: string;
  amount: number;
  category: 'food' | 'transport' | 'entertainment' | 'shopping' | 'health' | 'other';
  description: string;
  date: Date;
  note?: string;
}

interface ExpenseContextType {
  expenses: Expense[];
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  updateExpense: (id: string, expense: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
  getExpensesByCategory: (category?: string) => Expense[];
  getTotalExpenses: () => number;
  filterExpenses: (category?: string, startDate?: Date, endDate?: Date) => Expense[];
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

  useEffect(() => {
    // Load expenses from localStorage
    const storedExpenses = localStorage.getItem('budgetbloom_expenses');
    if (storedExpenses) {
      const parsed = JSON.parse(storedExpenses);
      // Convert date strings back to Date objects
      const expensesWithDates = parsed.map((expense: any) => ({
        ...expense,
        date: new Date(expense.date)
      }));
      setExpenses(expensesWithDates);
    }
  }, []);

  useEffect(() => {
    // Save expenses to localStorage whenever expenses change
    localStorage.setItem('budgetbloom_expenses', JSON.stringify(expenses));
  }, [expenses]);

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

  return (
    <ExpenseContext.Provider value={{
      expenses,
      addExpense,
      updateExpense,
      deleteExpense,
      getExpensesByCategory,
      getTotalExpenses,
      filterExpenses
    }}>
      {children}
    </ExpenseContext.Provider>
  );
};
