
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { useExpenses } from '@/contexts/ExpenseContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { toast } from '@/hooks/use-toast';
import { Moon, Sun, Download, User, Bell, Palette, Database } from 'lucide-react';

const Settings: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const { expenses, categories } = useExpenses();
  const { clearAllNotifications } = useNotifications();
  
  const [notificationSettings, setNotificationSettings] = useState({
    achievements: true,
    warnings: true,
    nudges: true,
    weeklyReports: true,
  });

  const handleExportData = () => {
    const data = {
      expenses,
      categories,
      exportDate: new Date().toISOString(),
      user: user?.email,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `budgetbloom-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Data Exported Successfully! 📊",
      description: "Your BudgetBloom data has been downloaded.",
    });
  };

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to clear all notification history? This cannot be undone.')) {
      clearAllNotifications();
      toast({
        title: "Notifications Cleared",
        description: "All notification history has been removed.",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-bold text-sage-dark dark:text-sage-light">Settings</h2>
        <p className="text-gray-600 dark:text-gray-300">Customize your BudgetBloom experience</p>
      </div>

      {/* Account Information */}
      <Card className="shadow-soft dark:shadow-dark border-0 theme-transition">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-sage" />
            Account Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
            <p className="text-sage-dark dark:text-sage-light font-medium">{user?.name}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
            <p className="text-sage-dark dark:text-sage-light font-medium">{user?.email}</p>
          </div>
          <div className="pt-4 border-t border-border">
            <Button
              variant="outline"
              onClick={logout}
              className="text-red-600 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-900/20"
            >
              Sign Out
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Appearance */}
      <Card className="shadow-soft dark:shadow-dark border-0 theme-transition">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-sage" />
            Appearance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {theme === 'dark' ? (
                <Moon className="w-5 h-5 text-sage" />
              ) : (
                <Sun className="w-5 h-5 text-sage" />
              )}
              <div>
                <p className="font-medium">Dark Mode</p>
                <p className="text-sm text-muted-foreground">
                  Toggle between light and dark themes
                </p>
              </div>
            </div>
            <Switch
              checked={theme === 'dark'}
              onCheckedChange={toggleTheme}
              className="data-[state=checked]:bg-sage"
            />
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card className="shadow-soft dark:shadow-dark border-0 theme-transition">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-sage" />
            Notification Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Achievement Notifications</p>
              <p className="text-sm text-muted-foreground">
                Get notified when you reach savings milestones
              </p>
            </div>
            <Switch
              checked={notificationSettings.achievements}
              onCheckedChange={(checked) =>
                setNotificationSettings(prev => ({ ...prev, achievements: checked }))
              }
              className="data-[state=checked]:bg-sage"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Spending Alerts</p>
              <p className="text-sm text-muted-foreground">
                Receive warnings about spending pattern changes
              </p>
            </div>
            <Switch
              checked={notificationSettings.warnings}
              onCheckedChange={(checked) =>
                setNotificationSettings(prev => ({ ...prev, warnings: checked }))
              }
              className="data-[state=checked]:bg-sage"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Gentle Nudges</p>
              <p className="text-sm text-muted-foreground">
                Encouraging tips and positive reinforcement
              </p>
            </div>
            <Switch
              checked={notificationSettings.nudges}
              onCheckedChange={(checked) =>
                setNotificationSettings(prev => ({ ...prev, nudges: checked }))
              }
              className="data-[state=checked]:bg-sage"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Weekly Reports</p>
              <p className="text-sm text-muted-foreground">
                Summary of your financial progress
              </p>
            </div>
            <Switch
              checked={notificationSettings.weeklyReports}
              onCheckedChange={(checked) =>
                setNotificationSettings(prev => ({ ...prev, weeklyReports: checked }))
              }
              className="data-[state=checked]:bg-sage"
            />
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card className="shadow-soft dark:shadow-dark border-0 theme-transition">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5 text-sage" />
            Data Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Export Data</p>
              <p className="text-sm text-muted-foreground">
                Download your expenses and settings as JSON
              </p>
            </div>
            <Button
              variant="outline"
              onClick={handleExportData}
              className="gap-2"
            >
              <Download className="w-4 h-4" />
              Export
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Clear Notifications</p>
              <p className="text-sm text-muted-foreground">
                Remove all notification history
              </p>
            </div>
            <Button
              variant="outline"
              onClick={handleClearData}
              className="text-red-600 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-900/20"
            >
              Clear
            </Button>
          </div>

          <div className="pt-4 border-t border-border">
            <div className="text-sm text-muted-foreground space-y-1">
              <p>• Total Expenses: {expenses.length}</p>
              <p>• Account Created: {user?.email ? 'Active' : 'Guest'}</p>
              <p>• Data Storage: Local Browser Storage</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
