import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/services/api';
import { supabase } from '@/integrations/supabase/client';
import AppLayout from '@/components/AppLayout';
import StatCard from '@/components/StatCard';
import { Package, CheckCircle, Plus, Truck, Phone, Mail, UserCheck, ShieldCheck, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';

export default function ShipperDashboard() {
  const { t } = useTranslation();
  const { userProfile } = useAuth();
  const navigate = useNavigate();
  
  const [stats, setStats] = useState({ activeLoads: 0, completedTrips: 0 });
  const [mainDrivers, setMainDrivers] = useState<any[]>([]);
  const [subDrivers, setSubDrivers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // دالة جلب البيانات الشاملة
  const fetchInitialData = async () => {
    if (!userProfile?.id) return;
    
    try {
      // 1. جلب الإحصائيات
      const statsData = await api.getShipperStats(userProfile.id);
      setStats(statsData);

      // 2. جلب السائقين الأساسيين
      const driversData = await api.getAllDrivers();
      setMainDrivers(driversData || []);

      // 3. جلب السائقين الفرعيين
      const subDriversData = await api.getAllSubDrivers();
      setSubDrivers(subDriversData || []);

    } catch (error) {
      console.error("خطأ في جلب البيانات:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();

    // إعداد التحديث الفوري (Realtime) لمراقبة جدولين في نفس الوقت
    const channel = supabase
      .channel('dashboard-realtime')
      .on(
        'postgres_changes', 
        { event: '*', schema: 'public', table: 'driver_details' }, 
        () => {
          console.log('تحديث في جدول السائقين الأساسيين');
          fetchInitialData(); 
        }
      )
      .on(
        'postgres_changes', 
        { event: '*', schema: 'public', table: 'sub_drivers' }, 
        () => {
          console.log('تحديث في جدول السائقين الفرعيين');
          fetchInitialData(); 
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userProfile]);

  // دمج القائمتين للعرض في الواجهة
  const allAvailableDrivers = [
    ...mainDrivers.map(d => ({ ...d, isSub: false })),
    ...subDrivers.map(d => ({ ...d, isSub: true }))
  ];

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* الترحيب */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">{t('welcome')}، {userProfile?.full_name}</h1>
            <p className="text-sm text-muted-foreground">تابع شحناتك وتواصل مع الناقلين المتاحين الآن</p>
          </div>
        </div>

        {/* كروت الإحصائيات */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <StatCard title={t('active_loads')} value={stats.activeLoads} icon={<Package size={24} />} color="primary" />
          <StatCard title={t('completed_trips')} value={stats.completedTrips} icon={<CheckCircle size={24} />} color="accent" />
        </div>

        {/* زر نشر شحنة سريع */}
        <Card 
          className="cursor-pointer hover:shadow-xl transition-all border-dashed border-2 border-primary/40 bg-primary/5 group"
          onClick={() => navigate('/shipper/post')}
        >
          <CardContent className="flex items-center gap-5 p-6">
            <div className="p-4 rounded-2xl bg-primary text-white group-hover:scale-110 transition-transform shadow-lg shadow-primary/20">
              <Plus size={32} strokeWidth={3} />
            </div>
            <div>
              <p className="font-black text-xl text-primary">{t('post_load')}</p>
              <p className="text-sm text-slate-500 font-medium">لديك بضاعة تريد نقلها؟ انشر طلبك وشاهد العروض</p>
            </div>
          </CardContent>
        </Card>

        {/* قسم السائقين المتصلين حالياً */}
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-8 bg-primary rounded-full"></div>
              <h2 className="text-xl font-bold">الناقلون النشطون الآن</h2>
            </div>
            
            <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-green-600 font-bold bg-green-50 px-3 py-1.5 rounded-full border border-green-200">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              تحديث فوري نشط
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary" size={40} /></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <AnimatePresence mode='popLayout'>
                {allAvailableDrivers.map((driver, index) => (
                  <motion.div
                    key={driver.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Card className="relative overflow-hidden hover:border-primary/50 transition-all border-slate-100 shadow-sm">
                      <CardContent className="p-5">
                        <div className="flex items-center gap-4 mb-5">
                          <div className="relative">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-2xl font-black text-primary border border-slate-200">
                              {(driver.profiles?.full_name || driver.driver_name)?.charAt(0)}
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></div>
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 mb-1">
                               <h3 className="font-bold text-slate-800 truncate">
                                 {driver.isSub ? driver.driver_name : driver.profiles?.full_name}
                               </h3>
                               {driver.isSub ? (
                                 <Badge variant="outline" className="text-[9px] h-4 px-1.5 bg-blue-50 text-blue-600 border-blue-100">سائق فرعي</Badge>
                               ) : (
                                 <ShieldCheck size={14} className="text-primary" />
                               )}
                            </div>
                            <p className="text-xs text-muted-foreground font-medium truncate">
                                {driver.truck_type || (driver.isSub ? "سائق معتمد" : "ناقل مسجل")}
                            </p>
                          </div>
                        </div>

                        <Dialog>
                          <DialogTrigger asChild>
                            <Button className="w-full h-10 rounded-xl font-bold text-xs" variant="secondary">
                              <UserCheck size={14} className="ml-1" />
                              عرض بيانات التواصل
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-md rounded-3xl">
                            <DialogHeader>
                              <DialogTitle className="text-center">بيانات الناقل</DialogTitle>
                            </DialogHeader>
                            <div className="flex flex-col items-center py-6 gap-6">
                              <div className="w-24 h-24 rounded-3xl bg-primary/10 flex items-center justify-center text-4xl font-black text-primary shadow-inner">
                                  {(driver.profiles?.full_name || driver.driver_name)?.charAt(0)}
                              </div>
                              <div className="text-center">
                                  <Badge className="mb-2 bg-green-100 text-green-700 hover:bg-green-100 border-0">متصل الآن ومتاح</Badge>
                                  <h2 className="text-2xl font-black text-slate-800">
                                    {driver.isSub ? driver.driver_name : driver.profiles?.full_name}
                                  </h2>
                                  <p className="text-slate-500 font-medium">{driver.truck_type || 'نقل بضائع عام'}</p>
                              </div>
                              
                              <div className="w-full space-y-3">
                                  <div className="group flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-primary/5 transition-colors">
                                      <div className="flex items-center gap-3">
                                        <div className="p-2 bg-white rounded-lg shadow-sm"><Phone size={18} className="text-primary" /></div>
                                        <span dir="ltr" className="font-bold text-slate-700">
                                          {driver.isSub ? driver.driver_phone : (driver.profiles?.phone || 'غير مسجل')}
                                        </span>
                                      </div>
                                      <Button size="sm" variant="ghost" className="text-primary font-bold h-8" onClick={() => window.open(`tel:${driver.isSub ? driver.driver_phone : driver.profiles?.phone}`)}>إتصال</Button>
                                  </div>
                                  
                                  {!driver.isSub && driver.profiles?.email && (
                                    <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                        <div className="p-2 bg-white rounded-lg shadow-sm"><Mail size={18} className="text-primary" /></div>
                                        <span className="font-bold text-slate-700 truncate">{driver.profiles?.email}</span>
                                    </div>
                                  )}
                              </div>
                              
                              <div className="w-full grid grid-cols-2 gap-3 mt-2">
                                <Button className="h-12 rounded-xl font-bold bg-green-600 hover:bg-green-700" onClick={() => window.open(`https://wa.me/${(driver.isSub ? driver.driver_phone : driver.profiles?.phone)?.replace(/^0/, '966')}`)}>
                                    واتساب
                                </Button>
                                <Button variant="outline" className="h-12 rounded-xl font-bold border-slate-200" onClick={() => window.open(`tel:${driver.isSub ? driver.driver_phone : driver.profiles?.phone}`)}>
                                    إتصال مباشر
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          {!loading && allAvailableDrivers.length === 0 && (
             <div className="py-20 text-center border-2 border-dashed rounded-3xl bg-muted/10">
                <Truck size={40} className="mx-auto text-muted-foreground/30 mb-4" />
                <p className="text-slate-400 font-bold">لا يوجد ناقلون متوفرون في هذه اللحظة</p>
                <p className="text-xs text-slate-400">بمجرد دخول سائق للنظام سيظهر هنا فوراً</p>
             </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
