// src/pages/driver/DriverLoads.tsx

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/services/api';
import AppLayout from '@/components/AppLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { MapPin, Weight, DollarSign, Loader2, Search, User } from 'lucide-react';
import { Load } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const statusColors: Record<string, string> = {
  available: 'bg-green-100 text-green-700 border-green-200',
  pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  in_progress: 'bg-blue-100 text-blue-700 border-blue-200',
  completed: 'bg-gray-100 text-gray-700 border-gray-200',
  cancelled: 'bg-red-100 text-red-700 border-red-200',
};

export default function DriverLoads() {
  const { t } = useTranslation();
  const { userProfile } = useAuth();
  const [loads, setLoads] = useState<Load[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [bidLoadId, setBidLoadId] = useState<string | null>(null);
  const [bidPrice, setBidPrice] = useState('');
  const [bidMsg, setBidMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchLoads = async () => {
    try {
      const data = await api.getAvailableLoads();
      // فلترة الشحنات لإخفاء شحنات المستخدم نفسه
      const otherLoads = (data as Load[]).filter(l => l.owner_id !== userProfile?.id);
      setLoads(otherLoads);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLoads(); }, [userProfile]);

  const handleAccept = async (loadId: string) => {
    if (!userProfile?.id) return;
    try {
      await api.acceptLoad(loadId, userProfile.id);
      toast.success(t('success'));
      fetchLoads();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleBid = async () => {
    if (!userProfile?.id || !bidLoadId) return;
    setSubmitting(true);
    try {
      await api.submitBid(bidLoadId, userProfile.id, parseFloat(bidPrice), bidMsg);
      toast.success(t('success'));
      setBidLoadId(null);
      setBidPrice('');
      setBidMsg('');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = loads.filter(l =>
    l.origin.toLowerCase().includes(search.toLowerCase()) ||
    l.destination.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppLayout>
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <Input
            placeholder={t('search')}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="ps-10"
          />
        </div>

        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="animate-spin text-primary" size={32} /></div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">{t('no_data')}</div>
        ) : (
          <div className="grid gap-4">
            {filtered.map(load => (
              <Card key={load.id} className="hover:shadow-lg transition-shadow border-l-4 border-l-primary">
                <CardContent className="p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
                    <div className="flex items-center gap-2 text-lg font-bold">
                      <MapPin size={20} className="text-primary shrink-0" />
                      <span>{load.origin}</span>
                      <span className="text-muted-foreground">←</span>
                      <span>{load.destination}</span>
                    </div>
                    <Badge className={statusColors[load.status] || 'bg-gray-100'}>{t(load.status)}</Badge>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                    <div className="flex flex-col">
                      <span className="text-muted-foreground text-xs">{t('weight')}</span>
                      <span className="font-semibold flex items-center gap-1"><Weight size={14} /> {load.weight} طن</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-muted-foreground text-xs">{t('price')}</span>
                      <span className="font-semibold text-green-600 flex items-center gap-1"><DollarSign size={14} /> {load.price} ر.س</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-muted-foreground text-xs">{t('pickup_date')}</span>
                      <span className="font-semibold">{load.pickup_date || '-'}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-muted-foreground text-xs">صاحب الشحنة</span>
                      <span className="font-semibold flex items-center gap-1 text-primary">
                        <User size={14} /> 
                        {load.profiles?.full_name || 'غير معروف'}
                      </span>
                    </div>
                  </div>

                  {load.description && (
                    <div className="bg-muted/30 p-3 rounded-md text-sm text-muted-foreground mb-4">
                      {load.description}
                    </div>
                  )}

                  <div className="flex gap-3 mt-2">
                    <Button className="flex-1 bg-primary hover:bg-primary/90" onClick={() => handleAccept(load.id)}>
                      {t('accept_load')}
                    </Button>
                    
                    <Dialog open={bidLoadId === load.id} onOpenChange={open => !open && setBidLoadId(null)}>
                      <DialogTrigger asChild>
                        <Button className="flex-1" variant="outline" onClick={() => setBidLoadId(load.id)}>
                          {t('submit_bid')}
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader><DialogTitle>{t('submit_bid')}</DialogTitle></DialogHeader>
                        <div className="space-y-4 pt-4">
                          <div>
                            <Label>{t('bid_price')}</Label>
                            <Input type="number" value={bidPrice} onChange={e => setBidPrice(e.target.value)} dir="ltr" className="mt-1" />
                          </div>
                          <div>
                            <Label>ملاحظات</Label>
                            <Textarea value={bidMsg} onChange={e => setBidMsg(e.target.value)} className="mt-1" placeholder="اكتب عرضك هنا..." />
                          </div>
                          <Button onClick={handleBid} disabled={submitting} className="w-full">
                            {submitting ? <Loader2 className="animate-spin" /> : t('submit')}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
