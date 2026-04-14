import { Head, useForm } from '@inertiajs/react';
import { Car } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { BreadcrumbItem } from '@/types';

const inputClass =
    'h-10 rounded-lg border border-white/10 bg-white/[0.04] px-3 text-sm text-white placeholder:text-white/25 ' +
    'focus-visible:border-[#FFC107] focus-visible:ring-2 focus-visible:ring-[#FFC107]/20 focus-visible:outline-none';
const labelClass = 'text-[11px] font-semibold uppercase tracking-widest text-white/40';

type VehicleData = {
    id: number;
    plate: string;
    type: string;
    brand: string;
    model: string;
    year: number;
    color: string | null;
    vin: string | null;
    status: string;
    notes: string | null;
    photo_url: string | null;
};

export default function VehicleEdit({ vehicle }: { vehicle: VehicleData }) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Vehículos', href: '/fleet/vehicles' },
        { title: `${vehicle.brand} ${vehicle.model} — ${vehicle.plate}`, href: `/fleet/vehicles/${vehicle.id}` },
        { title: 'Editar', href: `/fleet/vehicles/${vehicle.id}/edit` },
    ];

    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT',
        plate:   vehicle.plate,
        type:    vehicle.type,
        brand:   vehicle.brand,
        model:   vehicle.model,
        year:    vehicle.year,
        color:   vehicle.color ?? '',
        vin:     vehicle.vin ?? '',
        status:  vehicle.status,
        notes:   vehicle.notes ?? '',
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Editar ${vehicle.plate} — VECTO`} />

            <div className="flex flex-col gap-6 p-4 md:p-6">
                <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg" style={{ background: 'rgba(255,193,7,0.12)' }}>
                        <Car size={20} style={{ color: '#FFC107' }} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black uppercase tracking-tight text-white" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                            Editar Vehículo
                        </h1>
                        <p className="text-xs text-white/40">{vehicle.brand} {vehicle.model} — {vehicle.plate}</p>
                    </div>
                </div>

                <div className="rounded-xl border p-6" style={{ borderColor: 'rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)' }}>
                    <form
                        onSubmit={(e) => { e.preventDefault(); post(`/fleet/vehicles/${vehicle.id}`); }}
                        className="grid gap-5 sm:grid-cols-2"
                    >
                        <div className="flex flex-col gap-1.5">
                            <Label className={labelClass}>Placa *</Label>
                            <Input className={inputClass} value={data.plate} onChange={e => setData('plate', e.target.value.toUpperCase())} required />
                            <InputError message={errors.plate} />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <Label className={labelClass}>Tipo *</Label>
                            <Select value={data.type} onValueChange={v => setData('type', v)}>
                                <SelectTrigger className={inputClass}><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {['Camión', 'Camioneta', 'Van', 'Bus', 'Moto', 'Automóvil', 'Otro'].map(t => (
                                        <SelectItem key={t} value={t.toLowerCase()}>{t}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <Label className={labelClass}>Marca *</Label>
                            <Input className={inputClass} value={data.brand} onChange={e => setData('brand', e.target.value)} required />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <Label className={labelClass}>Modelo *</Label>
                            <Input className={inputClass} value={data.model} onChange={e => setData('model', e.target.value)} required />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <Label className={labelClass}>Año *</Label>
                            <Input className={inputClass} type="number" value={data.year} onChange={e => setData('year', +e.target.value)} required />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <Label className={labelClass}>Color</Label>
                            <Input className={inputClass} value={data.color} onChange={e => setData('color', e.target.value)} />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <Label className={labelClass}>VIN</Label>
                            <Input className={inputClass} value={data.vin} onChange={e => setData('vin', e.target.value.toUpperCase())} />
                            <InputError message={errors.vin} />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <Label className={labelClass}>Estado *</Label>
                            <Select value={data.status} onValueChange={v => setData('status', v)}>
                                <SelectTrigger className={inputClass}><SelectValue /></SelectTrigger>
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
                            />
                        </div>

                        <div className="flex gap-3 sm:col-span-2">
                            <Button type="submit" disabled={processing} className="bg-[#FFC107] font-bold text-black hover:bg-[#E6AC00]">
                                {processing ? 'Guardando…' : 'Guardar cambios'}
                            </Button>
                            <Button asChild variant="ghost" className="text-white/50 hover:text-white">
                                <a href={`/fleet/vehicles/${vehicle.id}`}>Cancelar</a>
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
