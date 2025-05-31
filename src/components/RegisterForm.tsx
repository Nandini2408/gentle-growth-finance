
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface RegisterFormProps {
  onToggleForm: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onToggleForm }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{ 
    name?: string; 
    email?: string; 
    password?: string; 
    confirmPassword?: string;
  }>({});
  const { register, isLoading } = useAuth();

  const validateForm = () => {
    const newErrors: { 
      name?: string; 
      email?: string; 
      password?: string; 
      confirmPassword?: string;
    } = {};
    
    if (!name.trim()) {
      newErrors.name = 'Name is required';
    } else if (name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      await register(name.trim(), email, password);
      toast({
        title: "Welcome to BudgetBloom!",
        description: "Your account has been created successfully. Let's start growing your financial future!",
      });
    } catch (error) {
      toast({
        title: "Registration failed",
        description: "Please try again with different credentials.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full max-w-md shadow-soft border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-2xl font-heading text-sage-dark">Join BudgetBloom</CardTitle>
        <CardDescription className="text-gray-600">
          Start your journey to financial growth
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label 
              htmlFor="name" 
              className={`text-sm font-medium transition-colors duration-200 ${
                errors.name ? 'text-bloom-coral' : 'text-gray-700'
              }`}
            >
              Full Name
            </Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors(prev => ({ ...prev, name: undefined }));
              }}
              className={`rounded-lg border-2 transition-all duration-200 focus:ring-2 focus:ring-sage/20 ${
                errors.name 
                  ? 'border-bloom-coral focus:border-bloom-coral' 
                  : 'border-gray-200 focus:border-sage'
              }`}
              placeholder="Enter your full name"
            />
            {errors.name && (
              <p className="text-sm text-bloom-coral animate-fade-in">{errors.name}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label 
              htmlFor="email" 
              className={`text-sm font-medium transition-colors duration-200 ${
                errors.email ? 'text-bloom-coral' : 'text-gray-700'
              }`}
            >
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors(prev => ({ ...prev, email: undefined }));
              }}
              className={`rounded-lg border-2 transition-all duration-200 focus:ring-2 focus:ring-sage/20 ${
                errors.email 
                  ? 'border-bloom-coral focus:border-bloom-coral' 
                  : 'border-gray-200 focus:border-sage'
              }`}
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="text-sm text-bloom-coral animate-fade-in">{errors.email}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label 
              htmlFor="password"
              className={`text-sm font-medium transition-colors duration-200 ${
                errors.password ? 'text-bloom-coral' : 'text-gray-700'
              }`}
            >
              Password
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors(prev => ({ ...prev, password: undefined }));
              }}
              className={`rounded-lg border-2 transition-all duration-200 focus:ring-2 focus:ring-sage/20 ${
                errors.password 
                  ? 'border-bloom-coral focus:border-bloom-coral' 
                  : 'border-gray-200 focus:border-sage'
              }`}
              placeholder="Create a password"
            />
            {errors.password && (
              <p className="text-sm text-bloom-coral animate-fade-in">{errors.password}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label 
              htmlFor="confirmPassword"
              className={`text-sm font-medium transition-colors duration-200 ${
                errors.confirmPassword ? 'text-bloom-coral' : 'text-gray-700'
              }`}
            >
              Confirm Password
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (errors.confirmPassword) setErrors(prev => ({ ...prev, confirmPassword: undefined }));
              }}
              className={`rounded-lg border-2 transition-all duration-200 focus:ring-2 focus:ring-sage/20 ${
                errors.confirmPassword 
                  ? 'border-bloom-coral focus:border-bloom-coral' 
                  : 'border-gray-200 focus:border-sage'
              }`}
              placeholder="Confirm your password"
            />
            {errors.confirmPassword && (
              <p className="text-sm text-bloom-coral animate-fade-in">{errors.confirmPassword}</p>
            )}
          </div>
          
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-sage to-sage-light hover:from-sage-dark hover:to-sage text-white font-medium py-2.5 rounded-lg transition-all duration-200 hover:shadow-lift hover:animate-lift focus:ring-2 focus:ring-sage focus:ring-offset-2"
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <button
              onClick={onToggleForm}
              className="text-sage font-medium hover:text-sage-dark transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-sage focus:ring-offset-2 rounded"
            >
              Sign in
            </button>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default RegisterForm;
