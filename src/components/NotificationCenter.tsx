import { useState, useEffect } from 'react';
import { Bell, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/services/api';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

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
      console.error('Failed to fetch notifications:', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [userProfile]);

  const markAllAsRead = async () => {
    if (!userProfile?.id) return;
    try {
      await api.markNotificationsAsRead(userProfile.id);
      setUnreadCount(0);
      fetchNotifications();
      toast.success("تم تحديد الكل كمقروء");
    } catch (error) {
      toast.error("فشل تحديث التنبيهات");
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative rounded-xl bg-white shadow-sm border border-slate-100">
          <Bell size={20} className="text-slate-600" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 rounded-3xl border-none shadow-2xl overflow-hidden" align="end">
        <div className="bg-slate-900 p-4 text-white flex justify-between items-center">
          <h3 className="font-black text-sm">الإشعارات</h3>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-[10px] h-7 hover:bg-white/10 text-white/70 hover:text-white">
              <Check size={14} className="ml-1" /> تحديد الكل كمقروء
            </Button>
          )}
        </div>
        <div className="max-h-[400px] overflow-y-auto bg-white">
          {notifications.length === 0 ? (
            <div className="p-10 text-center text-slate-400 text-xs font-bold">لا توجد تنبيهات حالياً</div>
          ) : (
            notifications.map((n) => (
              <div key={n.id} className={cn("p-4 border-b border-slate-50 transition-colors", !n.is_read && "bg-blue-50/50")}>
                <p className="font-black text-xs text-slate-800">{n.title}</p>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed font-medium">{n.message}</p>
                <p className="text-[9px] text-slate-400 mt-2 font-bold">{new Date(n.created_at).toLocaleString('ar-SA')}</p>
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
