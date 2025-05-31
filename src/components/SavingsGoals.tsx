
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useExpenses } from '@/contexts/ExpenseContext';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Target, TrendingUp, Award } from 'lucide-react';
import { format } from 'date-fns';

const SavingsGoals: React.FC = () => {
  const { savingsGoals, addSavingsGoal, updateSavingsGoal, deleteSavingsGoal } = useExpenses();
  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [newGoal, setNewGoal] = useState({
    name: '',
    targetAmount: '',
    currentAmount: '',
    deadline: new Date()
  });

  const handleAddGoal = () => {
    if (newGoal.name && newGoal.targetAmount) {
      addSavingsGoal({
        name: newGoal.name,
        targetAmount: parseFloat(newGoal.targetAmount),
        currentAmount: parseFloat(newGoal.currentAmount) || 0,
        deadline: newGoal.deadline
      });
      setNewGoal({ name: '', targetAmount: '', currentAmount: '', deadline: new Date() });
      setIsAddingGoal(false);
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 100) return 'text-green-600';
    if (progress >= 75) return 'text-sage';
    if (progress >= 50) return 'text-bloom-coral';
    return 'text-gray-500';
  };

  const getProgressStatus = (progress: number) => {
    if (progress >= 100) return 'Completed! 🎉';
    if (progress >= 75) return 'Almost there! 🌱';
    if (progress >= 50) return 'Making progress 📈';
    return 'Just getting started 🌱';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-heading font-bold text-sage-dark">Savings Goals</h2>
          <p className="text-gray-600">Track your financial milestones and celebrate progress</p>
        </div>
        
        <Dialog open={isAddingGoal} onOpenChange={setIsAddingGoal}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-sage to-sage-light text-white hover:shadow-lift transition-all duration-200">
              <Target className="w-4 h-4 mr-2" />
              New Goal
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-sage-dark font-heading">Create New Savings Goal</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Goal Name</label>
                <Input
                  placeholder="e.g., Emergency Fund, Vacation, New Laptop"
                  value={newGoal.name}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, name: e.target.value }))}
                  className="border-sage/20 focus:border-sage"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Target Amount</label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={newGoal.targetAmount}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, targetAmount: e.target.value }))}
                  className="border-sage/20 focus:border-sage font-mono"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Amount (Optional)</label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={newGoal.currentAmount}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, currentAmount: e.target.value }))}
                  className="border-sage/20 focus:border-sage font-mono"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Target Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left border-sage/20">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(newGoal.deadline, "PPP")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={newGoal.deadline}
                      onSelect={(date) => date && setNewGoal(prev => ({ ...prev, deadline: date }))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsAddingGoal(false)} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={handleAddGoal} className="flex-1 bg-sage hover:bg-sage-dark">
                  Create Goal
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {savingsGoals.map((goal) => {
          const progress = (goal.currentAmount / goal.targetAmount) * 100;
          const remaining = goal.targetAmount - goal.currentAmount;
          
          return (
            <Card key={goal.id} className="shadow-soft border-0 hover:shadow-lift transition-all duration-200">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-heading text-sage-dark truncate">
                    {goal.name}
                  </CardTitle>
                  {progress >= 100 && (
                    <Award className="w-5 h-5 text-bloom-coral" />
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Progress Ring Visual */}
                <div className="relative w-24 h-24 mx-auto">
                  <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="#E5E7EB"
                      strokeWidth="8"
                      fill="none"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="url(#progress-gradient)"
                      strokeWidth="8"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={`${Math.min(progress * 2.51, 251)} 251`}
                      className="transition-all duration-500"
                      style={{ filter: 'drop-shadow(0 2px 4px rgba(135, 169, 107, 0.3))' }}
                    />
                    <defs>
                      <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#87A96B" />
                        <stop offset="100%" stopColor="#A8C488" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className={`text-lg font-bold ${getProgressColor(progress)}`}>
                      {Math.round(progress)}%
                    </span>
                  </div>
                </div>
                
                {/* Progress Details */}
                <div className="text-center space-y-2">
                  <p className="text-sm text-gray-600">{getProgressStatus(progress)}</p>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Current:</span>
                      <span className="font-mono font-semibold text-sage-dark">
                        ${goal.currentAmount.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Target:</span>
                      <span className="font-mono font-semibold text-sage-dark">
                        ${goal.targetAmount.toFixed(2)}
                      </span>
                    </div>
                    {remaining > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Remaining:</span>
                        <span className="font-mono font-semibold text-bloom-coral">
                          ${remaining.toFixed(2)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Linear Progress Bar */}
                <div className="space-y-2">
                  <Progress 
                    value={Math.min(progress, 100)} 
                    className="h-2 bg-gray-100"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>0%</span>
                    <span>100%</span>
                  </div>
                </div>
                
                {/* Deadline */}
                <div className="text-center text-xs text-gray-500">
                  Target: {format(goal.deadline, 'MMM dd, yyyy')}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {savingsGoals.length === 0 && (
        <Card className="shadow-soft border-0 text-center py-12">
          <CardContent>
            <Target className="w-16 h-16 text-sage-light mx-auto mb-4" />
            <h3 className="text-lg font-heading font-semibold text-sage-dark mb-2">
              No savings goals yet
            </h3>
            <p className="text-gray-600 mb-6">
              Create your first savings goal and start your journey to financial growth!
            </p>
            <Button 
              onClick={() => setIsAddingGoal(true)}
              className="bg-gradient-to-r from-sage to-sage-light text-white hover:shadow-lift transition-all duration-200"
            >
              <Target className="w-4 h-4 mr-2" />
              Create Your First Goal
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SavingsGoals;
