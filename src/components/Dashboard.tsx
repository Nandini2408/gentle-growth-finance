
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useExpenses } from '@/contexts/ExpenseContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useNotifications } from '@/contexts/NotificationContext';
import AddExpenseForm from './AddExpenseForm';
import ExpenseList from './ExpenseList';
import SavingsGoals from './SavingsGoals';
import AnalyticsDashboard from './AnalyticsDashboard';
import ExpenseCalendar from './ExpenseCalendar';
import Settings from './Settings';
import NotificationPanel from './NotificationPanel';
import { format } from 'date-fns';
import { Home, Target, BarChart3, Calendar as CalendarIcon, Settings as SettingsIcon, Bell, Moon, Sun } from 'lucide-react';

type TabType = 'overview' | 'goals' | 'analytics' | 'calendar' | 'settings';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { expenses, getTotalExpenses } = useExpenses();
  const { theme, toggleTheme } = useTheme();
  const { unreadCount } = useNotifications();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [showNotifications, setShowNotifications] = useState(false);

  const currentMonth = format(new Date(), 'MMMM yyyy');
  const thisMonthExpenses = expenses.filter(expense => 
    format(expense.date, 'MMMM yyyy') === currentMonth
  );
  const thisMonthTotal = thisMonthExpenses.reduce((total, expense) => total + expense.amount, 0);

  const recentExpenses = expenses.slice(0, 3);

  const tabs = [
    { id: 'overview' as TabType, label: 'Overview', icon: Home },
    { id: 'goals' as TabType, label: 'Savings Goals', icon: Target },
    { id: 'analytics' as TabType, label: 'Analytics', icon: BarChart3 },
    { id: 'calendar' as TabType, label: 'Calendar', icon: CalendarIcon },
    { id: 'settings' as TabType, label: 'Settings', icon: SettingsIcon },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'goals':
        return <SavingsGoals />;
      case 'analytics':
        return <AnalyticsDashboard />;
      case 'calendar':
        return <ExpenseCalendar />;
      case 'settings':
        return <Settings />;
      default:
        return (
          <div className="space-y-8">
            {/* Welcome Section */}
            <div className="mb-8">
              <h2 className="text-3xl font-heading font-bold text-sage-dark dark:text-sage-light mb-2">
                Welcome back, {user?.name}! 🌱
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Let's continue growing your financial future together.
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="shadow-soft dark:shadow-dark border-0 bg-gradient-to-r from-sage to-sage-light text-white theme-transition">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">Total Expenses</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-mono font-bold">${getTotalExpenses().toFixed(2)}</p>
                  <p className="text-sage-light mt-1 text-sm">{expenses.length} transactions</p>
                </CardContent>
              </Card>
              
              <Card className="shadow-soft dark:shadow-dark border-0 bg-gradient-to-r from-bloom-coral to-bloom-yellow text-white theme-transition">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">This Month</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-mono font-bold">${thisMonthTotal.toFixed(2)}</p>
                  <p className="text-white/80 mt-1 text-sm">{currentMonth}</p>
                </CardContent>
              </Card>
              
              <Card className="shadow-soft dark:shadow-dark border-0 bg-gradient-to-r from-bloom-pink to-category-other text-white theme-transition">
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
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-light/20 via-white to-bloom-pink/10 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 theme-transition">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-soft dark:shadow-dark border-b border-sage/10 dark:border-gray-700 theme-transition">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-sage to-sage-light rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">B</span>
              </div>
              <div>
                <h1 className="text-xl font-heading font-bold text-sage-dark dark:text-sage-light">BudgetBloom</h1>
                <p className="text-xs text-gray-600 dark:text-gray-400">Financial Growth Made Beautiful</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="text-sage hover:bg-sage/10 dark:text-sage-light dark:hover:bg-sage/20"
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
              </Button>

              {/* Notifications */}
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="text-sage hover:bg-sage/10 dark:text-sage-light dark:hover:bg-sage/20"
                >
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-bloom-coral text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-bounce-in">
                      {unreadCount}
                    </span>
                  )}
                </Button>
              </div>

              <div className="text-right hidden sm:block">
                <p className="text-sm text-gray-600 dark:text-gray-400">Welcome back,</p>
                <p className="font-medium text-sage-dark dark:text-sage-light">{user?.name}</p>
              </div>
              <Button
                variant="outline"
                onClick={logout}
                className="text-sage border-sage hover:bg-sage hover:text-white dark:text-sage-light dark:border-sage-light dark:hover:bg-sage-light dark:hover:text-sage-dark transition-colors duration-200 theme-transition"
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white dark:bg-gray-900 border-b border-sage/10 dark:border-gray-700 theme-transition">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 theme-transition
                    ${activeTab === tab.id 
                      ? 'border-sage text-sage dark:border-sage-light dark:text-sage-light' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-600'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderTabContent()}
      </main>

      {/* Notification Panel */}
      {showNotifications && (
        <NotificationPanel onClose={() => setShowNotifications(false)} />
      )}
    </div>
  );
};

export default Dashboard;
