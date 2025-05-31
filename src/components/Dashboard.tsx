
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useExpenses } from '@/contexts/ExpenseContext';
import AddExpenseForm from './AddExpenseForm';
import ExpenseList from './ExpenseList';
import { format } from 'date-fns';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { expenses, getTotalExpenses } = useExpenses();

  const currentMonth = format(new Date(), 'MMMM yyyy');
  const thisMonthExpenses = expenses.filter(expense => 
    format(expense.date, 'MMMM yyyy') === currentMonth
  );
  const thisMonthTotal = thisMonthExpenses.reduce((total, expense) => total + expense.amount, 0);

  const recentExpenses = expenses.slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-light/20 via-white to-bloom-pink/10">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-soft border-b border-sage/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-sage to-sage-light rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">B</span>
              </div>
              <div>
                <h1 className="text-xl font-heading font-bold text-sage-dark">BudgetBloom</h1>
                <p className="text-xs text-gray-600">Financial Growth Made Beautiful</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm text-gray-600">Welcome back,</p>
                <p className="font-medium text-sage-dark">{user?.name}</p>
              </div>
              <Button
                variant="outline"
                onClick={logout}
                className="text-sage border-sage hover:bg-sage hover:text-white transition-colors duration-200"
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-heading font-bold text-sage-dark mb-2">
            Welcome back, {user?.name}! 🌱
          </h2>
          <p className="text-gray-600">
            Let's continue growing your financial future together.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="shadow-soft border-0 bg-gradient-to-r from-sage to-sage-light text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Total Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-mono font-bold">${getTotalExpenses().toFixed(2)}</p>
              <p className="text-sage-light mt-1 text-sm">{expenses.length} transactions</p>
            </CardContent>
          </Card>
          
          <Card className="shadow-soft border-0 bg-gradient-to-r from-bloom-coral to-bloom-yellow text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">This Month</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-mono font-bold">${thisMonthTotal.toFixed(2)}</p>
              <p className="text-white/80 mt-1 text-sm">{currentMonth}</p>
            </CardContent>
          </Card>
          
          <Card className="shadow-soft border-0 bg-gradient-to-r from-bloom-pink to-category-other text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-mono font-bold">{recentExpenses.length}</p>
              <p className="text-white/80 mt-1 text-sm">
                {recentExpenses.length > 0 
                  ? `Last: ${format(recentExpenses[0].date, 'MMM dd')}`
                  : 'No recent activity'
                }
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Add Expense Form */}
        <div className="mb-8">
          <AddExpenseForm />
        </div>

        {/* Expense List */}
        <ExpenseList />
      </main>
    </div>
  );
};

export default Dashboard;
