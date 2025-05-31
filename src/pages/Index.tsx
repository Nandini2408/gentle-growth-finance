
import React, { useState } from 'react';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { ExpenseProvider } from '@/contexts/ExpenseContext';
import LoginForm from '@/components/LoginForm';
import RegisterForm from '@/components/RegisterForm';
import Dashboard from '@/components/Dashboard';

const AuthenticatedApp: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sage-light/30 via-white to-bloom-pink/20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-sage to-sage-light rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-white font-bold text-xl">B</span>
          </div>
          <p className="text-sage-dark font-medium">Loading BudgetBloom...</p>
        </div>
      </div>
    );
  }

  if (user) {
    return (
      <ExpenseProvider>
        <Dashboard />
      </ExpenseProvider>
    );
  }

  return <AuthPage />;
};

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-light/30 via-white to-bloom-pink/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Brand */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-sage to-sage-light rounded-full flex items-center justify-center mx-auto mb-4 shadow-soft">
            <span className="text-white font-bold text-2xl">B</span>
          </div>
          <h1 className="text-4xl font-heading font-bold text-sage-dark mb-2">
            BudgetBloom
          </h1>
          <p className="text-gray-600 text-lg">
            Financial Growth Made Beautiful
          </p>
          <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-500">
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
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Made with 💚 for your financial wellness</p>
        </div>
      </div>
    </div>
  );
};

const Index: React.FC = () => {
  return (
    <AuthProvider>
      <AuthenticatedApp />
    </AuthProvider>
  );
};

export default Index;
