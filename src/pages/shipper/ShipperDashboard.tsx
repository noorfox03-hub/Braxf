import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/services/api';
import AppLayout from '@/components/AppLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Navigation, CheckCircle, Star, ArrowUpRight, ShieldCheck, Phone, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils'; // هذا هو السطر الذي كان ينقصك

export default function ShipperDashboard() {
  const { userProfile } = useAuth();
  const navigate = useNavigate();
  const [stats] = useState({ active: 0, completed: 0, efficiency: "100%" });
  const [drivers, setDrivers] = useState<any[]>([]);

  useEffect(() => {
    api.getAllDrivers().then(setDrivers).catch(console.error);
  }, []);

  return (
    <AppLayout>
      <div className="space-y-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter">لوحة التحكم</h1>
            <p className="text-slate-500 font-medium mt-1">أهلاً بك {userProfile?.full_name}، إدارة شحناتك أصبحت أسهل.</p>
          </div>
          <Button onClick={() => navigate('/shipper/post')} className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl h-16 px-8 font-black text-lg shadow-xl shadow-blue-500/20 gap-3">
            <Plus size={24} /> نشر شحنة جديدة
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'شحنات قيد النقل', value: stats.active, icon: <Navigation />, color: 'bg-blue-600' },
            { label: 'تم تسليمها', value: stats.completed, icon: <CheckCircle />, color: 'bg-emerald-500' },
            { label: 'معدل الأمان', value: stats.efficiency, icon: <ShieldCheck />, color: 'bg-slate-900' }
          ].map((s, i) => (
            <motion.div key={i} whileHover={{ y: -5 }} className="glass-card p-8 rounded-[2.5rem] relative overflow-hidden group">
              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg", s.color)}>
                {s.icon}
              </div>
              <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">{s.label}</p>
              <p className="text-4xl font-black text-slate-900 mt-2">{s.value}</p>
              <ArrowUpRight className="absolute top-8 end-8 text-slate-300 group-hover:text-blue-500 transition-colors" />
            </motion.div>
          ))}
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">الناقلون المعتمدون</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {drivers.map((driver, idx) => (
              <Card key={idx} className="rounded-[2.5rem] border-none shadow-sm overflow-hidden bg-white">
                <CardContent className="p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-[1.5rem] bg-slate-100 flex items-center justify-center text-2xl font-black text-slate-400">
                      {driver.profiles?.full_name?.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-black text-slate-800 truncate">{driver.profiles?.full_name}</h3>
                      <div className="flex items-center gap-1 text-amber-500 mt-1">
                        <Star size={12} fill="currentColor" />
                        <span className="text-xs font-black">4.9</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button className="flex-1 bg-[#25D366] text-white rounded-xl h-12 font-bold">واتساب</Button>
                    <Button variant="outline" className="h-12 w-12 rounded-xl"><Phone size={18}/></Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
