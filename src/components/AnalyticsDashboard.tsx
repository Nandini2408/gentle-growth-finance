
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { useExpenses } from '@/contexts/ExpenseContext';
import { getCategoryConfig } from '@/components/CategoryIcon';
import { TrendingUp, TrendingDown, DollarSign, Calendar } from 'lucide-react';
import { format, subDays, startOfMonth, endOfMonth } from 'date-fns';

const AnalyticsDashboard: React.FC = () => {
  const { 
    expenses, 
    getTotalExpenses, 
    getCategoryTotals, 
    getAverageDailySpending, 
    getTopCategory 
  } = useExpenses();

  // Calculate analytics data
  const categoryTotals = useMemo(() => getCategoryTotals(), [expenses]);
  const totalExpenses = getTotalExpenses();
  const averageDailySpending = getAverageDailySpending();
  const topCategory = getTopCategory();

  // Prepare pie chart data
  const pieChartData = useMemo(() => {
    return Object.entries(categoryTotals).map(([category, amount]) => {
      const config = getCategoryConfig(category);
      return {
        name: config.name,
        value: amount,
        color: config.color.replace('text-', '').replace('category-', ''),
        category
      };
    });
  }, [categoryTotals]);

  // Calculate month-over-month comparison
  const currentMonth = useMemo(() => {
    const now = new Date();
    const start = startOfMonth(now);
    const end = endOfMonth(now);
    return expenses.filter(expense => 
      expense.date >= start && expense.date <= end
    ).reduce((sum, expense) => sum + expense.amount, 0);
  }, [expenses]);

  const lastMonth = useMemo(() => {
    const now = new Date();
    const lastMonthStart = startOfMonth(new Date(now.getFullYear(), now.getMonth() - 1));
    const lastMonthEnd = endOfMonth(new Date(now.getFullYear(), now.getMonth() - 1));
    return expenses.filter(expense => 
      expense.date >= lastMonthStart && expense.date <= lastMonthEnd
    ).reduce((sum, expense) => sum + expense.amount, 0);
  }, [expenses]);

  const monthOverMonthChange = lastMonth > 0 ? ((currentMonth - lastMonth) / lastMonth) * 100 : 0;

  // Prepare daily spending data for the last 7 days
  const dailySpendingData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = subDays(new Date(), i);
      const dayExpenses = expenses.filter(expense => 
        format(expense.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
      );
      const total = dayExpenses.reduce((sum, expense) => sum + expense.amount, 0);
      
      return {
        date: format(date, 'MMM dd'),
        amount: total,
        fullDate: date
      };
    }).reverse();
    
    return last7Days;
  }, [expenses]);

  const categoryColors = {
    food: '#FF6B6B',
    transport: '#4ECDC4',
    entertainment: '#45B7D1',
    shopping: '#96CEB4',
    health: '#FFEAA7',
    other: '#DDA0DD'
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-bold text-sage-dark">Analytics Dashboard</h2>
        <p className="text-gray-600">Insights into your spending patterns and financial health</p>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-soft border-0 hover:shadow-lift transition-all duration-200 hover:-translate-y-1">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">Total Spent</CardTitle>
              <DollarSign className="w-4 h-4 text-sage" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-mono font-bold text-sage-dark">
              ${totalExpenses.toFixed(2)}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {expenses.length} transactions
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-soft border-0 hover:shadow-lift transition-all duration-200 hover:-translate-y-1">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">Daily Average</CardTitle>
              <Calendar className="w-4 h-4 text-bloom-coral" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-mono font-bold text-sage-dark">
              ${averageDailySpending.toFixed(2)}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              per day
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-soft border-0 hover:shadow-lift transition-all duration-200 hover:-translate-y-1">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">Top Category</CardTitle>
              <div className={`w-4 h-4 rounded ${getCategoryConfig(topCategory).bgColor}`} />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold text-sage-dark">
              {getCategoryConfig(topCategory).name}
            </p>
            <p className="text-sm font-mono text-gray-600 mt-1">
              ${(categoryTotals[topCategory] || 0).toFixed(2)}
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-soft border-0 hover:shadow-lift transition-all duration-200 hover:-translate-y-1">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">Monthly Change</CardTitle>
              {monthOverMonthChange >= 0 ? (
                <TrendingUp className="w-4 h-4 text-red-500" />
              ) : (
                <TrendingDown className="w-4 h-4 text-green-500" />
              )}
            </div>
          </CardHeader>
          <CardContent>
            <p className={`text-2xl font-mono font-bold ${monthOverMonthChange >= 0 ? 'text-red-500' : 'text-green-500'}`}>
              {monthOverMonthChange >= 0 ? '+' : ''}{monthOverMonthChange.toFixed(1)}%
            </p>
            <p className="text-xs text-gray-500 mt-1">
              vs last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown Pie Chart */}
        <Card className="shadow-soft border-0">
          <CardHeader>
            <CardTitle className="font-heading text-sage-dark">Spending by Category</CardTitle>
          </CardHeader>
          <CardContent>
            {pieChartData.length > 0 ? (
              <ChartContainer
                config={{
                  expenses: {
                    label: "Expenses",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={categoryColors[entry.category as keyof typeof categoryColors]} 
                        />
                      ))}
                    </Pie>
                    <ChartTooltip 
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-white p-3 rounded-lg shadow-lg border">
                              <p className="font-medium">{data.name}</p>
                              <p className="text-sm font-mono text-sage-dark">
                                ${data.value.toFixed(2)}
                              </p>
                              <p className="text-xs text-gray-500">
                                {((data.value / totalExpenses) * 100).toFixed(1)}% of total
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-500">
                <p>No expense data available</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Daily Spending Bar Chart */}
        <Card className="shadow-soft border-0">
          <CardHeader>
            <CardTitle className="font-heading text-sage-dark">Daily Spending (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                amount: {
                  label: "Amount",
                  color: "#87A96B",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailySpendingData}>
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <ChartTooltip 
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white p-3 rounded-lg shadow-lg border">
                            <p className="font-medium">{label}</p>
                            <p className="text-sm font-mono text-sage-dark">
                              ${payload[0].value?.toFixed(2)}
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar 
                    dataKey="amount" 
                    fill="url(#barGradient)"
                    radius={[4, 4, 0, 0]}
                  />
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#87A96B" />
                      <stop offset="100%" stopColor="#A8C488" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
