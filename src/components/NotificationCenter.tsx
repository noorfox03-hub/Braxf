import { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/services/api';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';

export default function NotificationCenter() {
  const { userProfile } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    if (!userProfile?.id) return;
    try {
      const data = await api.getNotifications(userProfile.id);
      setNotifications(data || []);
      setUnreadCount(data?.filter((n: any) => !n.is_read).length || 0);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // يمكنك إضافة Realtime subscription هنا لتحديث الإشعارات فوراً
  }, [userProfile]);

  const handleMarkAsRead = async () => {
    if (!userProfile?.id || unreadCount === 0) return;
    try {
      await api.markNotificationsAsRead(userProfile.id);
      setUnreadCount(0);
      fetchNotifications();
    } catch (error) {
      console.error('Error marking notifications as read:', error);
    }
  };

  return (
    <Popover onOpenChange={(open) => open && handleMarkAsRead()}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative rounded-xl bg-white shadow-sm border border-slate-100">
          <Bell size={20} className="text-slate-600" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white border-2 border-white">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 rounded-[2rem] shadow-2xl border-slate-100" align="end">
        <div className="p-4 border-b border-slate-50 bg-slate-50/50 rounded-t-[2rem]">
          <h3 className="font-black text-slate-800">الإشعارات</h3>
        </div>
        <ScrollArea className="h-[350px]">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-sm">
              لا توجد إشعارات حالياً
            </div>
          ) : (
            <div className="divide-y divide-slate-50">
              {notifications.map((n) => (
                <div key={n.id} className={`p-4 transition-colors ${!n.is_read ? 'bg-blue-50/30' : ''}`}>
                  <p className="text-sm font-bold text-slate-800">{n.title}</p>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{n.message}</p>
                  <p className="text-[10px] text-slate-400 mt-2 font-medium">
                    {formatDistanceToNow(new Date(n.created_at), { addSuffix: true, locale: ar })}
                  </p>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
