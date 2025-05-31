
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNotifications } from '@/contexts/NotificationContext';
import { format } from 'date-fns';
import { Bell, Check, Trash2, X } from 'lucide-react';

interface NotificationPanelProps {
  onClose: () => void;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({ onClose }) => {
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    clearNotification, 
    clearAllNotifications 
  } = useNotifications();

  const getNotificationStyle = (type: string) => {
    switch (type) {
      case 'achievement':
        return 'bg-gradient-to-r from-bloom-yellow to-bloom-coral text-white border-0';
      case 'warning':
        return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
      case 'nudge':
        return 'bg-sage-light/10 dark:bg-sage/20 border-sage-light dark:border-sage';
      case 'success':
        return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
      default:
        return 'bg-card border';
    }
  };

  const getNotificationIcon = (type: string, icon?: string) => {
    if (icon) return icon;
    switch (type) {
      case 'achievement':
        return '🏆';
      case 'warning':
        return '⚠️';
      case 'nudge':
        return '💡';
      case 'success':
        return '✅';
      default:
        return '📄';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-end pt-16 pr-4">
      <Card className="w-96 max-h-[80vh] overflow-hidden shadow-lift dark:shadow-dark-lift theme-transition">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-sage" />
              <CardTitle className="text-lg font-heading">Notifications</CardTitle>
              {unreadCount > 0 && (
                <span className="bg-bloom-coral text-white text-xs px-2 py-1 rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          {notifications.length > 0 && (
            <div className="flex gap-2 mt-2">
              {unreadCount > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={markAllAsRead}
                  className="text-xs"
                >
                  <Check className="w-3 h-3 mr-1" />
                  Mark all read
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={clearAllNotifications}
                className="text-xs text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-3 h-3 mr-1" />
                Clear all
              </Button>
            </div>
          )}
        </CardHeader>
        
        <CardContent className="p-0">
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="text-center py-8 px-4">
                <div className="text-4xl mb-3">🌱</div>
                <p className="text-muted-foreground">All caught up!</p>
                <p className="text-sm text-muted-foreground mt-1">
                  We'll notify you about important updates and achievements.
                </p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-border/50 last:border-b-0 transition-all duration-200 ${
                    !notification.read ? 'bg-sage/5 dark:bg-sage/10' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div 
                      className={`p-2 rounded-lg flex-shrink-0 ${getNotificationStyle(notification.type)}`}
                    >
                      <span className="text-sm">
                        {getNotificationIcon(notification.type, notification.icon)}
                      </span>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="font-medium text-sm">{notification.title}</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">
                            {format(notification.timestamp, 'MMM dd, h:mm a')}
                          </p>
                        </div>
                        
                        <div className="flex gap-1">
                          {!notification.read && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => markAsRead(notification.id)}
                            >
                              <Check className="w-3 h-3" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-red-500 hover:text-red-600"
                            onClick={() => clearNotification(notification.id)}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationPanel;
