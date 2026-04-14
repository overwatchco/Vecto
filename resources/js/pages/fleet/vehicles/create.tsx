import { Head, useForm } from '@inertiajs/react';
import { Car } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Vehículos', href: '/fleet/vehicles' },
    { title: 'Nuevo vehículo', href: '/fleet/vehicles/create' },
];

const inputClass =
    'h-10 rounded-lg border border-white/10 bg-white/[0.04] px-3 text-sm text-white placeholder:text-white/25 ' +
    'focus-visible:border-[#FFC107] focus-visible:ring-2 focus-visible:ring-[#FFC107]/20 focus-visible:outline-none';

const labelClass = 'text-[11px] font-semibold uppercase tracking-widest text-white/40';

export default function VehicleCreate() {
    const { data, setData, post, processing, errors } = useForm({
        plate:  '',
        type:   '',
        brand:  '',
        model:  '',
        year:   new Date().getFullYear(),
        color:  '',
        vin:    '',
        status: 'active',
        notes:  '',
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Nuevo Vehículo — VECTO" />

            <div className="flex flex-col gap-6 p-4 md:p-6">
                <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg" style={{ background: 'rgba(255,193,7,0.12)' }}>
                        <Car size={20} style={{ color: '#FFC107' }} />
                    </div>
                    <h1 className="text-2xl font-black uppercase tracking-tight text-white" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                        Registrar Vehículo
                    </h1>
                </div>

                <div className="rounded-xl border p-6" style={{ borderColor: 'rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)' }}>
                    <form
                        onSubmit={(e) => { e.preventDefault(); post('/fleet/vehicles'); }}
                        className="grid gap-5 sm:grid-cols-2"
                    >
                        <div className="flex flex-col gap-1.5">
                            <Label className={labelClass}>Placa *</Label>
                            <Input className={inputClass} value={data.plate} onChange={e => setData('plate', e.target.value.toUpperCase())} placeholder="ABC-123" required />
                            <InputError message={errors.plate} />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <Label className={labelClass}>Tipo *</Label>
                            <Select value={data.type} onValueChange={v => setData('type', v)}>
                                <SelectTrigger className={inputClass}>
                                    <SelectValue placeholder="Seleccionar tipo" />
                                </SelectTrigger>
                                <SelectContent>
                                    {['Camión', 'Camioneta', 'Van', 'Bus', 'Moto', 'Automóvil', 'Otro'].map(t => (
                                        <SelectItem key={t} value={t.toLowerCase()}>{t}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={errors.type} />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <Label className={labelClass}>Marca *</Label>
                            <Input className={inputClass} value={data.brand} onChange={e => setData('brand', e.target.value)} placeholder="Toyota, Ford…" required />
                            <InputError message={errors.brand} />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <Label className={labelClass}>Modelo *</Label>
                            <Input className={inputClass} value={data.model} onChange={e => setData('model', e.target.value)} placeholder="Hilux, Ranger…" required />
                            <InputError message={errors.model} />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <Label className={labelClass}>Año *</Label>
                            <Input className={inputClass} type="number" value={data.year} onChange={e => setData('year', +e.target.value)} min={1990} max={new Date().getFullYear() + 1} required />
                            <InputError message={errors.year} />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <Label className={labelClass}>Color</Label>
                            <Input className={inputClass} value={data.color} onChange={e => setData('color', e.target.value)} placeholder="Blanco, Negro…" />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <Label className={labelClass}>VIN / No. de Serie</Label>
                            <Input className={inputClass} value={data.vin} onChange={e => setData('vin', e.target.value.toUpperCase())} placeholder="17 caracteres" />
                            <InputError message={errors.vin} />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <Label className={labelClass}>Estado *</Label>
                            <Select value={data.status} onValueChange={v => setData('status', v)}>
                                <SelectTrigger className={inputClass}>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="active">Activo</SelectItem>
                                    <SelectItem value="inactive">Inactivo</SelectItem>
                                    <SelectItem value="maintenance">En Mantenimiento</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex flex-col gap-1.5 sm:col-span-2">
                            <Label className={labelClass}>Notas</Label>
                            <textarea
                                value={data.notes}
                                onChange={e => setData('notes', e.target.value)}
                                rows={3}
                                className="resize-none rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white placeholder:text-white/25 focus-visible:border-[#FFC107] focus-visible:outline-none"
                                placeholder="Observaciones adicionales…"
                            />
                        </div>

                        <div className="flex gap-3 sm:col-span-2">
                            <Button type="submit" disabled={processing} className="bg-[#FFC107] font-bold text-black hover:bg-[#E6AC00]">
                                {processing ? 'Guardando…' : 'Registrar vehículo'}
                            </Button>
                            <Button asChild variant="ghost" className="text-white/50 hover:text-white">
                                <a href="/fleet/vehicles">Cancelar</a>
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
