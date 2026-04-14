import { Head, useForm } from '@inertiajs/react';
import { TrendingUp } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Ingresos', href: '/fleet/revenues' },
    { title: 'Registrar ingreso', href: '/fleet/revenues/create' },
];

const inputClass = 'h-10 rounded-lg border border-white/10 bg-white/[0.04] px-3 text-sm text-white placeholder:text-white/25 focus-visible:border-[#FFC107] focus-visible:ring-2 focus-visible:ring-[#FFC107]/20 focus-visible:outline-none';
const labelClass = 'text-[11px] font-semibold uppercase tracking-widest text-white/40';

type Option = { value: string | number; label: string };

export default function RevenueCreate({ vehicles, contracts }: { vehicles: Option[]; contracts: Option[] }) {
    const { data, setData, post, processing, errors } = useForm({
        vehicle_id:  '',
        contract_id: '',
        description: '',
        amount:      '',
        date:        new Date().toISOString().split('T')[0],
        invoice_ref: '',
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Registrar Ingreso — VECTO" />

            <div className="flex flex-col gap-6 p-4 md:p-6">
                <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg" style={{ background: 'rgba(255,193,7,0.12)' }}>
                        <TrendingUp size={20} style={{ color: '#FFC107' }} />
                    </div>
                    <h1 className="text-2xl font-black uppercase tracking-tight text-white" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                        Registrar Ingreso
                    </h1>
                </div>

                <div className="rounded-xl border p-6" style={{ borderColor: 'rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)' }}>
                    <form onSubmit={(e) => { e.preventDefault(); post('/fleet/revenues'); }} className="grid gap-5 sm:grid-cols-2">

                        <div className="flex flex-col gap-1.5">
                            <Label className={labelClass}>Vehículo *</Label>
                            <Select value={String(data.vehicle_id)} onValueChange={v => setData('vehicle_id', v)}>
                                <SelectTrigger className={inputClass}><SelectValue placeholder="Seleccionar vehículo" /></SelectTrigger>
                                <SelectContent>
                                    {vehicles.map(v => <SelectItem key={v.value} value={String(v.value)}>{v.label}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            <InputError message={errors.vehicle_id} />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <Label className={labelClass}>Contrato (opcional)</Label>
                            <Select value={String(data.contract_id)} onValueChange={v => setData('contract_id', v)}>
                                <SelectTrigger className={inputClass}><SelectValue placeholder="Sin contrato" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="">Sin contrato</SelectItem>
                                    {contracts.map(c => <SelectItem key={c.value} value={String(c.value)}>{c.label}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <Label className={labelClass}>Fecha *</Label>
                            <Input className={inputClass} type="date" value={data.date} onChange={e => setData('date', e.target.value)} required />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <Label className={labelClass}>Monto (COP) *</Label>
                            <Input className={inputClass} type="number" min="0" step="1" value={data.amount} onChange={e => setData('amount', e.target.value)} placeholder="0" required />
                            <InputError message={errors.amount} />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <Label className={labelClass}>Referencia / Factura</Label>
                            <Input className={inputClass} value={data.invoice_ref} onChange={e => setData('invoice_ref', e.target.value)} placeholder="FV-001" />
                        </div>

                        <div className="flex flex-col gap-1.5 sm:col-span-2">
                            <Label className={labelClass}>Descripción *</Label>
                            <Input className={inputClass} value={data.description} onChange={e => setData('description', e.target.value)} placeholder="Descripción del ingreso" required />
                            <InputError message={errors.description} />
                        </div>

                        <div className="flex gap-3 sm:col-span-2">
                            <Button type="submit" disabled={processing} className="bg-[#FFC107] font-bold text-black hover:bg-[#E6AC00]">
                                {processing ? 'Guardando…' : 'Registrar ingreso'}
                            </Button>
                            <Button asChild variant="ghost" className="text-white/50 hover:text-white">
                                <a href="/fleet/revenues">Cancelar</a>
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
