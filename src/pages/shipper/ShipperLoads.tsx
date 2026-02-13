import {طر 314.

### الحل: استبدل كود ملف `src/pages/shipper/Shi useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/services/api';
import AppLayout frompperPostLoad.tsx` بالكود الكامل التالي:

هذا الكود يحتوي على كافة الإغلاقات الصحي '@/components/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';حة والحقول المطلوبة:

```tsx
import { useState } from 'react';
import { useTranslation } from 'react-i1
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/8next';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/servicesinput';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/api';
import AppLayout from '@/components/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@//ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input }components/ui/select';
import { toast } from 'sonner';
import { Loader2, MapPin from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {, Package, User, Phone, Info, AlertCircle, Calendar, Weight, DollarSign } from 'lucide-react';
import { useNavigate } Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger from 'react-router-dom';
import { cn } from '@/lib/utils';

export default function Shi, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
importpperPostLoad() {
  const { t } = useTranslation();
  const { userProfile } = use { Loader2, MapPin, Package, User, Phone, AlertCircle } from 'lucide-react';
Auth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

form, setForm] = useState({
    origin: '',
    destination: '',
    weight: '',
    priceinterface PostLoadForm {
  origin: string;
  destination: string;
  weight: string;
  price: string;
  truck_size: string;
  body_type: string;
  type: string: '',
    truck_size: '',
    body_type: 'flatbed',
    type: 'general',
    package_type: 'boxes',
    pickup_date: new Date().toISOString().split('T')[0],
    description: '',
    receiver;
  package_type: string;
  pickup_date: string;
  description: string;
  receiver_name: string;
  receiver_phone: string;
  receiver_address: string;
_name: '',
    receiver_phone: '',
    receiver_address: '',
  });

  const}

export default function ShipperPostLoad() {
  const { t } = useTranslation();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user { userProfile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [form, setProfile?.id) {
      toast.error("يجب تسجيل الدخول أولاً");
      return;
    }

    setLoading(true);
    try {
      await api.postLoad(form, userProfile.id);
      toast.success("تم نشر الشحنة بنجاح في سوق الحمولات");
      navigate('/Form] = useState<PostLoadForm>({
    origin: '',
    destination: '',
    weight: '',
    price: '',
    truck_size: 'large',
    body_type: 'flatbed',
    type: 'general',
    package_type: 'boxes',
    pickup_date: new Date().toISOString().split('shipper/dashboard');
    } catch (err: any) {
      toast.error(err.message || "فشل نشر الشحنة");
    } finally {
      setLoading(false);
    }
  };

  T')[0],
    description: '',
    receiver_name: '',
    receiver_phone: '',
    receiver_address: '',
  });

  const validateForm = () => {
    const newErrors:const updateField = (key: string, value: string) => {
    setForm(prev => ({ ...prev, [key Record<string, string> = {};
    if (!form.origin) newErrors.origin = "موقع]: value }));
  };

  const bodyTypes = [
    { value: 'flatbed', label: 'سطحة' },
    { value: 'curtain', label: 'ستارة' },
    { value التحميل مطلوب";
    if (!form.destination) newErrors.destination = "موقع التفريغ مطلوب";
    if (!form.weight) newErrors.weight = "الوزن مطلوب";
    if (!form.price) new: 'box', label: 'صندوق مغلق' },
    { value: 'refrigerated', labelErrors.price = "السعر مطلوب";
    setErrors(newErrors);
    return Object.keys(newErrors).length ===: 'مبرد' },
    { value: 'tank', label: 'صهريج' },
  ];

  return ( 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    
    <AppLayout>
      <div className="max-w-4xl mx-auto space-ye.preventDefault();
    if (!validateForm()) return;
    if (!userProfile?.id) return;

    setLoading(true);
    try {
      await api.postLoad(form, userProfile.id);
      toast.-6 pb-10">
        <div className="flex flex-col gap-1 mb-2">
            <h1 className="success("تم نشر الشحنة بنجاح");
      navigate('/shipper/dashboard');
    } catch (err:text-3xl font-black text-slate-900 tracking-tight">نشر شحنة جديدة</h1>
            <p className="text-slate-500 font-bold text-sm uppercase tracking-widest">أدخل تفاصيل الحم any) {
      toast.error(err.message || "فشل النشر");
    } finally {
      setLoading(false);
    }
  };

  const updateField = (key: keyof PostLoadForm, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  returnولة للبحث عن ناقل</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* قسم المسار */}
          <Card className="rounded-[2.5rem] border-none shadow-xl shadow-slate-200/50 overflow-hidden">
            <CardHeader className="bg-slate- (
    <AppLayout>
      <div className="max-w-4xl mx-auto pb-10">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* معلومات المسار */}
          <Card className900 text-white p-7">
              <CardTitle className="flex items-center gap-3="rounded-[2.5rem] border-none shadow-xl overflow-hidden bg-white">
            <CardHeader className="bg text-lg font-black italic">
                <MapPin className="text-blue-500" /> Route Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 grid grid-cols-1 md-slate-900 text-white p-8">
              <CardTitle className="flex items-center gap-3 font-black text-xl">
                <MapPin className="text-blue-400:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="font-black text-slate-700 text-xs uppercase mr-2">موقع التحميل</Label>
" /> تفاصيل المسار
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="font-bold">مدينة التحميل</Label>
                                <Input placeholder="المدينة، الحي..." value={form.origin} onChange={e => updateField('origin', e.target.value)} required className="h-14 rounded-2xl bg-slate-50 border-none font-bold" />
              </div>
              <div className="space-y-2">
                <Label className="font<Input 
                  value={form.origin} 
                  onChange={e => updateField('origin', e.target.value)} 
                  className={cn("h-14 rounded-2xl bg-slate-50", errors.origin && "border-red-500")}
                />
              </div>
              <div className="-black text-slate-700 text-xs uppercase mr-2">موقع التنزيل</Label>
                <Input placeholder="المدينة، الحي..." value={form.destination} onChange={e => updateField('destination', e.space-y-2">
                <Label className="font-bold">مدينة التفريغ</Label>
                <Input 
                  value={form.destination} 
                  onChange={e => updateField('destination',target.value)} required className="h-14 rounded-2xl bg-slate-50 border-none e.target.value)} 
                  className={cn("h-14 rounded-2xl bg-slate-50", errors. font-bold" />
              </div>
            </CardContent>
          </Card>

          {/* تفاصيل الحمولة */}
          <Card className="rounded-[2.5rem] border-none shadow-xl shadow-slate-200/50 overflow-hidden">
            <CardHeader className="p-7 pbdestination && "border-red-500")}
                />
              </div>
            </CardContent>
          </Card>

          {/* تفاصيل الحمولة */}
          <Card className="rounded-[2.5rem] border-0">
              <CardTitle className="flex items-center gap-3 text-lg font-black text-none shadow-xl overflow-hidden bg-white">
            <CardHeader className="p-8 pb-0">
              <CardTitle-slate-800 italic">
                <Package className="text-blue-600" /> Cargo & className="flex items-center gap-3 font-black text-xl text-slate-800">
 Truck Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space                <Package className="text-blue-600" /> معلومات الشحنة
              </CardTitle>-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              < gap-6">
                <div className="space-y-2">
                  <Label className="font-div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <divblack text-slate-700 text-xs uppercase mr-2">الوزن التقديري (طن)</Label>
 className="space-y-2">
                  <Label className="font-bold">الوزن التقديري (طن)</Label>
                  <Input type="number" value={form.weight} onChange={e => updateField('weight', e.target.value)} required                  <Input type="number" value={form.weight} onChange={e => updateField('weight', e.target.value)} className="h-14 rounded-2xl bg-slate-50 border-none font-bold" /> className="h-14 rounded-2xl bg-slate-50" />
                </div>
                <div
                </div>
                <div className="space-y-2">
                  <Label className="font-black text-slate-700 text-xs uppercase mr-2">الأجرة المقترحة (ر.س)</Label>
                  <Input type="number" value={form.price} onChange={e => updateField('price', e.target.value)} required className="h-14 rounded-2xl bg-slate-5 className="space-y-2">
                  <Label className="font-bold">السعر المعروض (ريال)</Label>
                  <Input type="number" value={form.price} onChange={e => updateField('price', e.0 border-none font-bold text-emerald-600" />
                </div>
                <div classNametarget.value)} className="h-14 rounded-2xl bg-slate-50 font-bold text-emerald-600"="space-y-2">
                  <Label className="font-black text-slate-700 text />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">-xs uppercase mr-2">نوع الهيكل المطلوب</Label>
                  <Select value={form.body_type}
                <div className="space-y-2">
                  <Label className="font-bold">نوع اله onValueChange={v => updateField('body_type', v)}>
                    <SelectTrigger className="h-14 rounded-2يكل المطلوب</Label>
                  <Select value={form.body_type} onValueChange={v => updateFieldxl bg-slate-50 border-none font-bold"><SelectValue /></SelectTrigger>
                    <SelectContent className="rounded-2xl font-bold">
                      {bodyTypes.map(t => <SelectItem key={t.value} value={t.value('body_type', v)}>
                    <SelectTrigger className="h-14 rounded-2xl bg-slate-50"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="flatbed">سطحة</SelectItem>
                      <SelectItem value="}>{t.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 curtain">ستارة</SelectItem>
                      <SelectItem value="refrigerated">مبرد</SelectItem>
                      <div className="space-y-2">
                    <Label className="font-black text-slate-7<SelectItem value="tanker">صهريج</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="font-bold">تاريخ التحميل</00 text-xs uppercase mr-2">تاريخ التحميل</Label>
                    <Input type="date" value={form.pickup_date} onChange={e => updateField('pickup_date', e.target.Label>
                  <Input type="date" value={form.pickup_date} onChange={e => updateFieldvalue)} className="h-14 rounded-2xl bg-slate-50 border-none font-bold text('pickup_date', e.target.value)} className="h-14 rounded-2xl bg-slate-50" />
-center" />
                 </div>
                 <div className="space-y-2">
                    <Label className="font-black text-                </div>
              </div>

              <div className="space-y-2">
                <Label className="font-bold">وصف إslate-700 text-xs uppercase mr-2">نوع التغليف</Label>
                    <Inputضافي</Label>
                <Textarea value={form.description} onChange={e => updateField('description', placeholder="كراتين، طبلية، صب..." value={form.package_type} onChange={e => updateField('package_type', e.target.value)} className="h-14 rounded-2xl bg-slate-50 border-none font-bold" />
                 </div>
              </div>

              <div className="space-y-2">
                <Label className e.target.value)} className="rounded-2xl bg-slate-50 min-h-[100px]" placeholder="أي ملاحظات إضافية للناقل..." />
              </div>
            </CardContent>
          </Card>

          {/* معلومات="font-black text-slate-700 text-xs uppercase mr-2">وصف إضافي للح المستلم */}
          <Card className="rounded-[2.5rem] border-none shadow-xl overflow-hidden bg-white">
            <CardHeader className="p-8 pb-0">
              <CardTitle className="flex items-center gap-3 font-black text-xl text-slate-800">
مولة</Label>
                <Textarea placeholder="اكتب أي ملاحظات أخرى للسائق..." value={form.description} onChange={e                <User className="text-blue-600" /> بيانات المستلم
              </CardTitle>
            </CardHeader>
             => updateField('description', e.target.value)} className="min-h-[120px] rounded-[2rem] bg-slate-50 border-none font-medium p-5" />
              </div>
            </<CardContent className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2CardContent>
          </Card>

          {/* معلومات المستلم */}
          <Card className="rounded-[2.5rem]">
                  <Label className="font-bold">اسم المستلم</Label>
                  <Input value={form border-none shadow-xl shadow-slate-200/50 overflow-hidden bg-white">
.receiver_name} onChange={e => updateField('receiver_name', e.target.value)} className="            <CardHeader className="p-7 pb-0">
               <CardTitle className="flex items-center gap-3 text-lg fonth-14 rounded-2xl bg-slate-50" />
                </div>
                <div className="space-y-2">
                  <Label className="font-bold">جوال المستلم</Label>
                  -black text-slate-800 italic">
                <User className="text-blue-600" /> Receiver Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 grid grid<Input value={form.receiver_phone} onChange={e => updateField('receiver_phone', e.target-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-.value)} className="h-14 rounded-2xl bg-slate-50" dir="ltr"2">
                  <Label className="font-black text-slate-700 text-xs uppercase mr- />
                </div>
              </div>
              <div className="space-y-2">
                <Label className2">اسم المستلم</Label>
                  <Input placeholder="الاسم الثلاثي" value={form.receiver_="font-bold">عنوان التسليم بالتفصيل</Label>
                <Input value={form.receiver_address} onChange={e => updateField('receiver_address', e.target.value)} className="h-1name} onChange={e => updateField('receiver_name', e.target.value)} required className="h-14 rounded-4 rounded-2xl bg-slate-50" />
              </div>
            </CardContent>
          2xl bg-slate-50 border-none font-bold" />
               </div>
               <div className="space-y-2">
                  <Label className="font-black text-slate-700 text</Card>

          <Button type="submit" disabled={loading} className="w-full h-16-xs uppercase mr-2">رقم جوال المستلم</Label>
                  <Input placeholder="05XXXXXXXX" value={form.receiver_phone} onChange={e => updateField('receiver_phone', e.target rounded-[1.5rem] bg-blue-600 hover:bg-blue-700 text-white font-black text-xl shadow-xl shadow-blue-500/20">
            {loading ?.value)} required className="h-14 rounded-2xl bg-slate-50 border-none font-bold text-center" dir="ltr" />
               </div>
               <div className="md:col-span-2 space-y-2">
                  <Label className="font-black text-slate-700 text-xs uppercase mr-2">عنوان التوصيل <Loader2 className="animate-spin" /> : "تأكيد ونشر الطلب في السوق"}
          </Button>

 بالتفصيل</Label>
                  <Input placeholder="اسم المستودع أو المحل، الشارع..." value={form.receiver        </form>
      </div>
    </AppLayout>
  );
}
