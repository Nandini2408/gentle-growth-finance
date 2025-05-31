
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useExpenses, Expense } from '@/contexts/ExpenseContext';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Trash2, Filter } from 'lucide-react';
import CategoryIcon, { getCategoryConfig } from './CategoryIcon';

const ExpenseList: React.FC = () => {
  const { expenses, deleteExpense, getTotalExpenses } = useExpenses();
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'category'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'food', label: 'Food & Dining' },
    { value: 'transport', label: 'Transportation' },
    { value: 'entertainment', label: 'Entertainment' },
    { value: 'shopping', label: 'Shopping' },
    { value: 'health', label: 'Health & Wellness' },
    { value: 'other', label: 'Other' }
  ];

  const sortOptions = [
    { value: 'date', label: 'Date' },
    { value: 'amount', label: 'Amount' },
    { value: 'category', label: 'Category' }
  ];

  const filteredAndSortedExpenses = React.useMemo(() => {
    let filtered = expenses;

    // Filter by category
    if (filterCategory !== 'all') {
      filtered = filtered.filter(expense => expense.category === filterCategory);
    }

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'date':
          comparison = a.date.getTime() - b.date.getTime();
          break;
        case 'amount':
          comparison = a.amount - b.amount;
          break;
        case 'category':
          comparison = a.category.localeCompare(b.category);
          break;
      }

      return sortOrder === 'desc' ? -comparison : comparison;
    });

    return filtered;
  }, [expenses, filterCategory, sortBy, sortOrder]);

  const handleDeleteExpense = async (id: string, description: string, amount: number) => {
    if (window.confirm(`Are you sure you want to delete "${description}" ($${amount.toFixed(2)})?`)) {
      deleteExpense(id);
      toast({
        title: "Expense deleted",
        description: `"${description}" has been removed from your expenses.`,
      });
    }
  };

  const EmptyState = () => (
    <div className="text-center py-12">
      <div className="w-16 h-16 bg-gradient-to-r from-sage-light to-sage rounded-full flex items-center justify-center mx-auto mb-4">
        <span className="text-white text-2xl">💸</span>
      </div>
      <h3 className="text-lg font-heading text-sage-dark mb-2">No expenses yet</h3>
      <p className="text-gray-600 mb-4">
        {filterCategory !== 'all' 
          ? `No expenses found in ${categories.find(c => c.value === filterCategory)?.label}`
          : 'Start tracking your expenses to see them here'
        }
      </p>
      {filterCategory !== 'all' && (
        <Button
          variant="outline"
          onClick={() => setFilterCategory('all')}
          className="text-sage border-sage hover:bg-sage hover:text-white"
        >
          View All Expenses
        </Button>
      )}
    </div>
  );

  return (
    <Card className="shadow-soft border-0 bg-white">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle className="text-xl font-heading text-sage-dark flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-sage to-sage-light rounded-lg flex items-center justify-center">
              <span className="text-white text-sm">📋</span>
            </div>
            Expense History
            {expenses.length > 0 && (
              <Badge variant="secondary" className="bg-sage/10 text-sage border-sage/20">
                {filteredAndSortedExpenses.length} of {expenses.length}
              </Badge>
            )}
          </CardTitle>
          
          {expenses.length > 0 && (
            <div className="text-right">
              <p className="text-sm text-gray-600">Total Expenses</p>
              <p className="text-2xl font-mono font-bold text-sage-dark">
                ${getTotalExpenses().toFixed(2)}
              </p>
            </div>
          )}
        </div>
      </CardHeader>
      
      {expenses.length > 0 && (
        <CardContent className="pt-0">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 flex-1">
              <Filter size={16} className="text-sage" />
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="border-gray-200 focus:border-sage">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-2 border-gray-100 shadow-soft rounded-lg">
                  {categories.map((cat) => (
                    <SelectItem 
                      key={cat.value} 
                      value={cat.value}
                      className="cursor-pointer hover:bg-sage/5"
                    >
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex gap-2">
              <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                <SelectTrigger className="w-32 border-gray-200 focus:border-sage">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-2 border-gray-100 shadow-soft rounded-lg">
                  {sortOptions.map((option) => (
                    <SelectItem 
                      key={option.value} 
                      value={option.value}
                      className="cursor-pointer hover:bg-sage/5"
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="border-gray-200 hover:border-sage hover:bg-sage hover:text-white"
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </Button>
            </div>
          </div>

          {/* Expense List */}
          {filteredAndSortedExpenses.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="space-y-3">
              {filteredAndSortedExpenses.map((expense) => {
                const categoryConfig = getCategoryConfig(expense.category);
                
                return (
                  <div
                    key={expense.id}
                    className="flex items-center gap-4 p-4 bg-white border-l-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 group"
                    style={{ borderLeftColor: categoryConfig.color.replace('text-', '#') === categoryConfig.color ? '#87A96B' : 
                      expense.category === 'food' ? '#FF6B6B' :
                      expense.category === 'transport' ? '#4ECDC4' :
                      expense.category === 'entertainment' ? '#45B7D1' :
                      expense.category === 'shopping' ? '#96CEB4' :
                      expense.category === 'health' ? '#FFEAA7' : '#DDA0DD'
                    }}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center" 
                           style={{ backgroundColor: 
                             expense.category === 'food' ? '#FF6B6B20' :
                             expense.category === 'transport' ? '#4ECDC420' :
                             expense.category === 'entertainment' ? '#45B7D120' :
                             expense.category === 'shopping' ? '#96CEB420' :
                             expense.category === 'health' ? '#FFEAA720' : '#DDA0DD20'
                           }}>
                        <CategoryIcon category={expense.category} size={20} />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-gray-900 truncate">
                            {expense.description}
                          </h4>
                          <Badge 
                            variant="outline" 
                            className="text-xs"
                            style={{ color: 
                              expense.category === 'food' ? '#FF6B6B' :
                              expense.category === 'transport' ? '#4ECDC4' :
                              expense.category === 'entertainment' ? '#45B7D1' :
                              expense.category === 'shopping' ? '#96CEB4' :
                              expense.category === 'health' ? '#FFEAA7' : '#DDA0DD'
                            }}
                          >
                            {categoryConfig.name}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                          <span>{format(expense.date, 'MMM dd, yyyy')}</span>
                          {expense.note && (
                            <span className="text-xs bg-gray-100 px-2 py-1 rounded truncate max-w-40">
                              {expense.note}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-lg text-gray-900">
                        ${expense.amount.toFixed(2)}
                      </span>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteExpense(expense.id, expense.description, expense.amount)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-gray-400 hover:text-bloom-coral hover:bg-bloom-coral/10"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      )}
      
      {expenses.length === 0 && <EmptyState />}
    </Card>
  );
};

export default ExpenseList;
