import { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/services/api';

export default function NotificationCenter() {
  const { userProfile } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    if (userProfile?.id) {
      api.getNotifications(userProfile.id).then(setNotifications).catch(console.error);
    }
  }, [userProfile]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative rounded-xl bg-white shadow-sm border border-slate-100">
          <Bell size={20} className="text-slate-600" />
          {notifications.filter(n => !n.is_read).length > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[8px] text-white">
              {notifications.filter(n => !n.is_read).length}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 rounded-[2rem] shadow-2xl border-slate-100" align="end">
        <div className="p-4 border-b bg-slate-50/50 rounded-t-[2rem]">
          <h3 className="font-black text-slate-800">الإشعارات</h3>
        </div>
        <ScrollArea className="h-80">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-sm">لا توجد إشعارات</div>
          ) : (
            notifications.map((n, i) => (
              <div key={i} className="p-4 border-b last:border-0">
                <p className="text-sm font-bold text-slate-800">{n.title}</p>
                <p className="text-xs text-slate-500">{n.message}</p>
              </div>
            ))
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
