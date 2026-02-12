import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/services/api';
import { supabase } from '@/integrations/supabase/client'; // استيراد العميل للـ Realtime
import AppLayout from '@/components/AppLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, MapPin, Weight, DollarSign, User } from 'lucide-react';
import { Load } from '@/types';
import { toast } from 'sonner';

export default function DriverLoads() {
  const { t } = useTranslation();
  const { userProfile } = useAuth();
  const [loads, setLoads] = useState<Load[]>([]);
  const [loading, setLoading] = useState(true);

  // دالة جلب البيانات باستخدام الـ api.ts الخاص بك
  const fetchLoads = async () => {
    try {
      const data = await api.getAvailableLoads();
      // ملاحظة: لكي تظهر لك شحناتك أثناء التجربة، احذف فلتر (owner_id !== userProfile?.id)
      setLoads(data as any[]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoads();

    // إعداد التحديث الفوري
    const channel = supabase
      .channel('public:loads')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'loads' },
        (payload) => {
          console.log('تغيير في قاعدة البيانات:', payload);
          fetchLoads(); // إعادة جلب البيانات فوراً عند أي تغيير
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <AppLayout>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">الشحنات المتاحة</h2>
            <div className="flex items-center gap-2 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full border border-green-200">
                <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                تحديث مباشر
            </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="animate-spin text-primary" size={32} /></div>
        ) : loads.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed rounded-xl text-muted-foreground">
            لا توجد شحنات متاحة حالياً
          </div>
        ) : (
          <div className="grid gap-4">
            {loads.map((load: any) => (
              <Card key={load.id} className="hover:border-primary transition-colors">
                <CardContent className="p-5">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2 text-lg font-bold">
                      <MapPin className="text-primary" size={18} />
                      {load.origin} ← {load.destination}
                    </div>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">متاحة</Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                    <div>
                      <p className="text-muted-foreground text-xs">الوزن</p>
                      <p className="font-semibold flex items-center gap-1"><Weight size={14}/> {load.weight} طن</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">السعر</p>
                      <p className="font-bold text-green-600 flex items-center gap-1"><DollarSign size={14}/> {load.price} ر.س</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">الشاحن</p>
                      <p className="font-semibold flex items-center gap-1 text-primary">
                        <User size={14}/> {load.profiles?.full_name || 'غير معروف'}
                      </p>
                    </div>
                  </div>
                  
                  <Button className="w-full" onClick={() => toast.info("قريباً: تقديم عرض سعر")}>
                    قبول الشحنة / تقديم عرض
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
