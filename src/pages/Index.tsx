
import React, { useState } from 'react';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { ExpenseProvider } from '@/contexts/ExpenseContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import LoginForm from '@/components/LoginForm';
import RegisterForm from '@/components/RegisterForm';
import Dashboard from '@/components/Dashboard';

const AuthenticatedApp: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sage-light/30 via-white to-bloom-pink/20 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center theme-transition">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-sage to-sage-light rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-white font-bold text-xl">B</span>
          </div>
          <p className="text-sage-dark dark:text-sage-light font-medium">Loading BudgetBloom...</p>
        </div>
      </div>
    );
  }

  if (user) {
    return (
      <ExpenseProvider>
        <NotificationProvider>
          <Dashboard />
        </NotificationProvider>
      </ExpenseProvider>
    );
  }

  return <AuthPage />;
};

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-light/30 via-white to-bloom-pink/20 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4 theme-transition">
      <div className="w-full max-w-md">
        {/* Logo and Brand */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-sage to-sage-light rounded-full flex items-center justify-center mx-auto mb-4 shadow-soft dark:shadow-dark">
            <span className="text-white font-bold text-2xl">B</span>
          </div>
          <h1 className="text-4xl font-heading font-bold text-sage-dark dark:text-sage-light mb-2">
            BudgetBloom
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Financial Growth Made Beautiful
          </p>
          <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <span>🌱</span>
            <span>Grow your financial future with every transaction</span>
            <span>💖</span>
          </div>
        </div>

        {/* Auth Forms */}
        <div className="animate-fade-in">
          {isLogin ? (
            <LoginForm onToggleForm={() => setIsLogin(false)} />
          ) : (
            <RegisterForm onToggleForm={() => setIsLogin(true)} />
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>Made with 💚 for your financial wellness</p>
        </div>
      </div>
    </div>
  );
};

const Index: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AuthenticatedApp />
      </AuthProvider>
    </ThemeProvider>
  );
};

export default Index;
