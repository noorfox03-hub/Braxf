import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/services/api';
import { supabase } from '@/integrations/supabase/client';
import AppLayout from '@/components/AppLayout';
import StatCard from '@/components/StatCard';
import { Package, CheckCircle, Plus, MapPin, Trash2, AlertCircle, Loader2, Clock, ChevronLeft } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { motion, AnimatePresence } from 'framer-motion';

export default function ShipperDashboard() {
  const { t } = useTranslation();
  const { userProfile } = useAuth();
  const navigate = useNavigate();
  
  const [stats, setStats] = useState({ activeLoads: 0, completedTrips: 0 });
  const [myLoads, setMyLoads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    if (!userProfile?.id) return;
    try {
      // جلب الإحصائيات
      const s = await api.getShipperStats(userProfile.id);
      setStats(s);

      // جلب شحناتي الأخيرة
      const data = await api.getUserLoads(userProfile.id);
      setMyLoads(data as any[] || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();

    // التحديث الفوري: أي شحنة تتضاف أو تتمسح أو يقبلها سواق، القائمة تتحدث فوراً
    const channel = supabase
      .channel('shipper-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'loads' }, () => {
        fetchDashboardData();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [userProfile]);

  const handleDelete = async (id: string) => {
    setIsDeleting(id);
    try {
      await api.deleteLoad(id);
      toast.success("تم حذف طلب الشحنة بنجاح");
    } catch (err: any) {
      toast.error("عذراً، لا يمكن حذف الشحنة الآن");
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6 pb-10">
        <div className="flex justify-between items-center">
            <h1 className="text-2xl font-black text-slate-800">مرحباً بك، {userProfile?.full_name}</h1>
        </div>

        {/* ملخص النشاط */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <StatCard title="شحنات نشطة" value={stats.activeLoads} icon={<Package size={24} />} color="primary" />
          <StatCard title="رحلات مكتملة" value={stats.completedTrips} icon={<CheckCircle size={24} />} color="accent" />
        </div>

        {/* زر النشر الكبير - شكل شيك جداً */}
        <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
            <Card 
            className="cursor-pointer border-none shadow-xl shadow-primary/10 bg-gradient-to-r from-primary to-blue-700 text-white overflow-hidden relative group"
            onClick={() => navigate('/shipper/post')}
            >
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:rotate-12 transition-transform">
                    <Package size={120} />
                </div>
                <CardContent className="flex items-center gap-6 p-8 relative z-10">
                    <div className="p-4 rounded-3xl bg-white/20 backdrop-blur-md">
                        <Plus size={36} strokeWidth={3} />
                    </div>
                    <div>
                        <p className="font-black text-2xl">انشر شحنة جديدة</p>
                        <p className="text-white/80 font-medium mt-1">ابدأ الآن وابحث عن أفضل السائقين لبضاعتك</p>
                    </div>
                </CardContent>
            </Card>
        </motion.div>

        {/* قائمة الشحنات بتصميم الكروت الأنيقة */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
              <Clock className="text-primary" size={22} />
              شحناتي الأخيرة
            </h2>
            <div className="flex items-center gap-1.5 text-[10px] text-green-600 font-bold bg-green-50 px-2 py-1 rounded-full border border-green-100">
                <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                مباشر
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary" size={40} /></div>
          ) : myLoads.length === 0 ? (
            <div className="py-20 text-center border-2 border-dashed rounded-[2.5rem] bg-slate-50/50">
                <Package size={48} className="mx-auto text-slate-200 mb-4" />
                <p className="text-slate-400 font-bold">لم تقم بنشر أي شحنات بعد</p>
            </div>
          ) : (
            <div className="grid gap-3">
              <AnimatePresence mode='popLayout'>
                {myLoads.map((load) => (
                  <motion.div key={load.id} layout initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, scale: 0.95 }}>
                    <Card className="rounded-[2rem] border-none shadow-sm hover:shadow-md transition-all overflow-hidden bg-white group">
                      <CardContent className="p-0">
                        <div className="flex">
                            {/* شريط الحالة الملون */}
                            <div className={`w-3 ${load.status === 'available' ? 'bg-emerald-500' : 'bg-blue-500'}`}></div>
                            
                            <div className="flex-1 p-5">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 font-black text-slate-800 text-lg">
                                            {load.origin} 
                                            <ChevronLeft size={16} className="text-slate-300" /> 
                                            {load.destination}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Badge className={load.status === 'available' ? 'bg-emerald-50 text-emerald-600 border-0' : 'bg-blue-50 text-blue-600 border-0'}>
                                                {load.status === 'available' ? 'في انتظار ناقل' : 'جاري التوصيل'}
                                            </Badge>
                                            <span className="text-[10px] text-slate-400 font-bold">{new Date(load.created_at).toLocaleDateString('ar')}</span>
                                        </div>
                                    </div>

                                    {/* زر الحذف للسلة */}
                                    {load.status === 'available' && (
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="ghost" size="icon" className="text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-2xl h-12 w-12 transition-colors">
                                                    {isDeleting === load.id ? <Loader2 className="animate-spin" size={20} /> : <Trash2 size={24} />}
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent className="rounded-[2.5rem]">
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle className="text-xl font-black">حذف طلب الشحنة؟</AlertDialogTitle>
                                                    <AlertDialogDescription className="font-medium">
                                                        سيتم إزالة الشحنة من قائمة السائقين ولن يتمكن أحد من قبولها.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter className="gap-3 mt-4">
                                                    <AlertDialogCancel className="rounded-2xl h-12 font-bold border-slate-200">إلغاء</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => handleDelete(load.id)} className="rounded-2xl h-12 font-bold bg-rose-500 hover:bg-rose-600 text-white">تأكيد الحذف</AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    )}
                                </div>

                                <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                                    <div className="flex gap-4">
                                        <div><p className="text-[10px] text-slate-400 font-bold uppercase">الوزن</p><p className="font-black text-slate-700">{load.weight} طن</p></div>
                                        <div className="border-r border-slate-100 pr-4">
                                            <p className="text-[10px] text-slate-400 font-bold uppercase">السعر التقديري</p>
                                            <p className="font-black text-emerald-600">{load.price} ر.س</p>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="sm" className="text-primary font-black hover:bg-primary/5 rounded-xl px-4" onClick={() => navigate('/shipper/loads')}>
                                        التفاصيل
                                    </Button>
                                </div>
                            </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
