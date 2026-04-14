import { Head, useForm } from '@inertiajs/react';
import { Wrench } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Mantenimientos', href: '/fleet/maintenances' },
    { title: 'Nuevo', href: '/fleet/maintenances/create' },
];

const inputClass =
    'h-10 rounded-lg border border-white/10 bg-white/[0.04] px-3 text-sm text-white placeholder:text-white/25 ' +
    'focus-visible:border-[#FFC107] focus-visible:ring-2 focus-visible:ring-[#FFC107]/20 focus-visible:outline-none';
const labelClass = 'text-[11px] font-semibold uppercase tracking-widest text-white/40';

type VehicleOption = { value: number; label: string };

export default function MaintenanceCreate({ vehicles }: { vehicles: VehicleOption[] }) {
    const { data, setData, post, processing, errors } = useForm({
        vehicle_id:            '',
        type:                  'preventive',
        date:                  new Date().toISOString().split('T')[0],
        description:           '',
        cost:                  '',
        provider:              '',
        next_maintenance_date: '',
        next_maintenance_km:   '',
        status:                'scheduled',
        notes:                 '',
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Nuevo Mantenimiento — VECTO" />

            <div className="flex flex-col gap-6 p-4 md:p-6">
                <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg" style={{ background: 'rgba(255,193,7,0.12)' }}>
                        <Wrench size={20} style={{ color: '#FFC107' }} />
                    </div>
                    <h1 className="text-2xl font-black uppercase tracking-tight text-white" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                        Registrar Mantenimiento
                    </h1>
                </div>

                <div className="rounded-xl border p-6" style={{ borderColor: 'rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)' }}>
                    <form onSubmit={(e) => { e.preventDefault(); post('/fleet/maintenances'); }} className="grid gap-5 sm:grid-cols-2">

                        <div className="flex flex-col gap-1.5 sm:col-span-2">
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
                            <Label className={labelClass}>Tipo *</Label>
                            <Select value={data.type} onValueChange={v => setData('type', v)}>
                                <SelectTrigger className={inputClass}><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="preventive">Preventivo</SelectItem>
                                    <SelectItem value="corrective">Correctivo</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <Label className={labelClass}>Estado *</Label>
                            <Select value={data.status} onValueChange={v => setData('status', v)}>
                                <SelectTrigger className={inputClass}><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="scheduled">Programado</SelectItem>
                                    <SelectItem value="in_progress">En Proceso</SelectItem>
                                    <SelectItem value="completed">Completado</SelectItem>
                                    <SelectItem value="cancelled">Cancelado</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <Label className={labelClass}>Fecha *</Label>
                            <Input className={inputClass} type="date" value={data.date} onChange={e => setData('date', e.target.value)} required />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <Label className={labelClass}>Costo (COP)</Label>
                            <Input className={inputClass} type="number" min="0" value={data.cost} onChange={e => setData('cost', e.target.value)} placeholder="0" />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <Label className={labelClass}>Proveedor / Taller</Label>
                            <Input className={inputClass} value={data.provider} onChange={e => setData('provider', e.target.value)} placeholder="Nombre del taller" />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <Label className={labelClass}>Próximo Mantenimiento (Fecha)</Label>
                            <Input className={inputClass} type="date" value={data.next_maintenance_date} onChange={e => setData('next_maintenance_date', e.target.value)} />
                        </div>

                        <div className="flex flex-col gap-1.5 sm:col-span-2">
                            <Label className={labelClass}>Descripción *</Label>
                            <textarea
                                value={data.description}
                                onChange={e => setData('description', e.target.value)}
                                rows={3}
                                required
                                className="resize-none rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white placeholder:text-white/25 focus-visible:border-[#FFC107] focus-visible:outline-none"
                                placeholder="Detalle del mantenimiento realizado…"
                            />
                            <InputError message={errors.description} />
                        </div>

                        <div className="flex gap-3 sm:col-span-2">
                            <Button type="submit" disabled={processing} className="bg-[#FFC107] font-bold text-black hover:bg-[#E6AC00]">
                                {processing ? 'Guardando…' : 'Registrar mantenimiento'}
                            </Button>
                            <Button asChild variant="ghost" className="text-white/50 hover:text-white">
                                <a href="/fleet/maintenances">Cancelar</a>
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
