
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useExpenses } from '@/contexts/ExpenseContext';
import CategoryIcon, { getCategoryConfig } from '@/components/CategoryIcon';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth } from 'date-fns';

const ExpenseCalendar: React.FC = () => {
  const { expenses } = useExpenses();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Calculate the calendar days
  const calendarDays = useMemo(() => {
    const start = startOfMonth(currentDate);
    const end = endOfMonth(currentDate);
    
    // Get all days in the month
    const daysInMonth = eachDayOfInterval({ start, end });
    
    // Add padding days from previous month
    const startPadding = start.getDay();
    const paddingStart = new Date(start);
    paddingStart.setDate(start.getDate() - startPadding);
    
    const paddingDays = eachDayOfInterval({
      start: paddingStart,
      end: new Date(start.getTime() - 24 * 60 * 60 * 1000)
    });
    
    // Add padding days from next month
    const endPadding = 6 - end.getDay();
    const paddingEnd = new Date(end);
    paddingEnd.setDate(end.getDate() + endPadding);
    
    const paddingEndDays = eachDayOfInterval({
      start: new Date(end.getTime() + 24 * 60 * 60 * 1000),
      end: paddingEnd
    });
    
    return [...paddingDays, ...daysInMonth, ...paddingEndDays];
  }, [currentDate]);

  // Get expenses for a specific date
  const getExpensesForDate = (date: Date) => {
    return expenses.filter(expense => isSameDay(expense.date, date));
  };

  // Get total spending for a date
  const getTotalForDate = (date: Date) => {
    return getExpensesForDate(date).reduce((total, expense) => total + expense.amount, 0);
  };

  // Get intensity color based on spending amount
  const getIntensityColor = (amount: number) => {
    if (amount === 0) return 'bg-gray-50';
    if (amount < 20) return 'bg-sage-light/20';
    if (amount < 50) return 'bg-sage-light/40';
    if (amount < 100) return 'bg-sage-light/60';
    if (amount < 200) return 'bg-sage/60';
    return 'bg-sage-dark/80';
  };

  const selectedDateExpenses = selectedDate ? getExpensesForDate(selectedDate) : [];
  const selectedDateTotal = selectedDate ? getTotalForDate(selectedDate) : 0;

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-bold text-sage-dark">Expense Calendar</h2>
        <p className="text-gray-600">Visualize your daily spending patterns</p>
      </div>

      <Card className="shadow-soft border-0">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="font-heading text-sage-dark">
              {format(currentDate, 'MMMM yyyy')}
            </CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateMonth('prev')}
                className="border-sage/20 hover:bg-sage/10"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateMonth('next')}
                className="border-sage/20 hover:bg-sage/10"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {/* Calendar Header */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                {day}
              </div>
            ))}
          </div>
          
          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, index) => {
              const dayExpenses = getExpensesForDate(day);
              const totalAmount = getTotalForDate(day);
              const isCurrentMonth = isSameMonth(day, currentDate);
              const isToday = isSameDay(day, new Date());
              
              return (
                <button
                  key={index}
                  onClick={() => handleDateClick(day)}
                  className={`
                    p-2 min-h-[60px] rounded-lg border transition-all duration-200 hover:shadow-md
                    ${getIntensityColor(totalAmount)}
                    ${isCurrentMonth ? 'border-sage/10' : 'border-gray-100 opacity-40'}
                    ${isToday ? 'ring-2 ring-sage ring-opacity-50' : ''}
                    hover:scale-105
                  `}
                >
                  <div className="text-left">
                    <div className={`text-sm font-medium ${isCurrentMonth ? 'text-gray-700' : 'text-gray-400'}`}>
                      {format(day, 'd')}
                    </div>
                    {totalAmount > 0 && isCurrentMonth && (
                      <div className="text-xs font-mono text-sage-dark mt-1">
                        ${totalAmount.toFixed(0)}
                      </div>
                    )}
                    {dayExpenses.length > 0 && isCurrentMonth && (
                      <div className="flex gap-1 mt-1 flex-wrap">
                        {dayExpenses.slice(0, 3).map((expense, expenseIndex) => (
                          <div key={expenseIndex} className="w-2 h-2 rounded-full" style={{
                            backgroundColor: getCategoryConfig(expense.category).color.includes('food') ? '#FF6B6B' :
                                           getCategoryConfig(expense.category).color.includes('transport') ? '#4ECDC4' :
                                           getCategoryConfig(expense.category).color.includes('entertainment') ? '#45B7D1' :
                                           getCategoryConfig(expense.category).color.includes('shopping') ? '#96CEB4' :
                                           getCategoryConfig(expense.category).color.includes('health') ? '#FFEAA7' :
                                           '#DDA0DD'
                          }} />
                        ))}
                        {dayExpenses.length > 3 && (
                          <div className="text-xs text-gray-500">+{dayExpenses.length - 3}</div>
                        )}
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
          
          {/* Legend */}
          <div className="mt-6 flex items-center justify-center gap-4 text-xs text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-50 rounded"></div>
              <span>No spending</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-sage-light/40 rounded"></div>
              <span>Low</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-sage/60 rounded"></div>
              <span>Medium</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-sage-dark/80 rounded"></div>
              <span>High</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Daily Breakdown Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-heading text-sage-dark">
              {selectedDate && format(selectedDate, 'EEEE, MMMM d, yyyy')}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Daily Total */}
            <div className="text-center p-4 bg-sage/5 rounded-lg">
              <p className="text-sm text-gray-600">Total Spending</p>
              <p className="text-3xl font-mono font-bold text-sage-dark">
                ${selectedDateTotal.toFixed(2)}
              </p>
            </div>
            
            {/* Expense List */}
            {selectedDateExpenses.length > 0 ? (
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {selectedDateExpenses.map((expense) => {
                  const config = getCategoryConfig(expense.category);
                  return (
                    <div key={expense.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className={`p-2 rounded-lg ${config.bgColor}/20`}>
                        <CategoryIcon category={expense.category} size={16} />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">{expense.description}</p>
                        <p className="text-sm text-gray-600">{config.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-mono font-semibold text-sage-dark">
                          ${expense.amount.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No expenses recorded for this day</p>
                <Button 
                  size="sm" 
                  className="mt-3 bg-sage hover:bg-sage-dark"
                  onClick={() => setIsModalOpen(false)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Expense
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ExpenseCalendar;
