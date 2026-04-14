import { Head, useForm } from '@inertiajs/react';
import { FileText } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Contratos', href: '/fleet/contracts' },
    { title: 'Nuevo contrato', href: '/fleet/contracts/create' },
];

const inputClass = 'h-10 rounded-lg border border-white/10 bg-white/[0.04] px-3 text-sm text-white placeholder:text-white/25 focus-visible:border-[#FFC107] focus-visible:ring-2 focus-visible:ring-[#FFC107]/20 focus-visible:outline-none';
const labelClass = 'text-[11px] font-semibold uppercase tracking-widest text-white/40';

export default function ContractCreate() {
    const { data, setData, post, processing, errors } = useForm({
        code:         '',
        client:       '',
        service_type: '',
        rate:         '',
        rate_unit:    'mes',
        start_date:   new Date().toISOString().split('T')[0],
        end_date:     '',
        conditions:   '',
        status:       'active',
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Nuevo Contrato — VECTO" />

            <div className="flex flex-col gap-6 p-4 md:p-6">
                <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg" style={{ background: 'rgba(255,193,7,0.12)' }}>
                        <FileText size={20} style={{ color: '#FFC107' }} />
                    </div>
                    <h1 className="text-2xl font-black uppercase tracking-tight text-white" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                        Nuevo Contrato
                    </h1>
                </div>

                <div className="rounded-xl border p-6" style={{ borderColor: 'rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)' }}>
                    <form onSubmit={(e) => { e.preventDefault(); post('/fleet/contracts'); }} className="grid gap-5 sm:grid-cols-2">

                        <div className="flex flex-col gap-1.5">
                            <Label className={labelClass}>Código / Referencia</Label>
                            <Input className={inputClass} value={data.code} onChange={e => setData('code', e.target.value)} placeholder="CT-2026-001" />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <Label className={labelClass}>Estado *</Label>
                            <Select value={data.status} onValueChange={v => setData('status', v)}>
                                <SelectTrigger className={inputClass}><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="active">Activo</SelectItem>
                                    <SelectItem value="expired">Vencido</SelectItem>
                                    <SelectItem value="suspended">Suspendido</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex flex-col gap-1.5 sm:col-span-2">
                            <Label className={labelClass}>Cliente *</Label>
                            <Input className={inputClass} value={data.client} onChange={e => setData('client', e.target.value)} placeholder="Nombre del cliente o empresa" required />
                            <InputError message={errors.client} />
                        </div>

                        <div className="flex flex-col gap-1.5 sm:col-span-2">
                            <Label className={labelClass}>Tipo de Servicio *</Label>
                            <Input className={inputClass} value={data.service_type} onChange={e => setData('service_type', e.target.value)} placeholder="Transporte de carga, Mensajería…" required />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <Label className={labelClass}>Tarifa (COP) *</Label>
                            <Input className={inputClass} type="number" min="0" value={data.rate} onChange={e => setData('rate', e.target.value)} placeholder="0" required />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <Label className={labelClass}>Unidad de tarifa</Label>
                            <Select value={data.rate_unit} onValueChange={v => setData('rate_unit', v)}>
                                <SelectTrigger className={inputClass}><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {['día', 'mes', 'km', 'viaje', 'hora', 'servicio'].map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <Label className={labelClass}>Fecha de inicio *</Label>
                            <Input className={inputClass} type="date" value={data.start_date} onChange={e => setData('start_date', e.target.value)} required />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <Label className={labelClass}>Fecha de fin</Label>
                            <Input className={inputClass} type="date" value={data.end_date} onChange={e => setData('end_date', e.target.value)} />
                        </div>

                        <div className="flex flex-col gap-1.5 sm:col-span-2">
                            <Label className={labelClass}>Condiciones</Label>
                            <textarea
                                value={data.conditions}
                                onChange={e => setData('conditions', e.target.value)}
                                rows={3}
                                className="resize-none rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white placeholder:text-white/25 focus-visible:border-[#FFC107] focus-visible:outline-none"
                                placeholder="Términos y condiciones del contrato…"
                            />
                        </div>

                        <div className="flex gap-3 sm:col-span-2">
                            <Button type="submit" disabled={processing} className="bg-[#FFC107] font-bold text-black hover:bg-[#E6AC00]">
                                {processing ? 'Guardando…' : 'Crear contrato'}
                            </Button>
                            <Button asChild variant="ghost" className="text-white/50 hover:text-white">
                                <a href="/fleet/contracts">Cancelar</a>
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
