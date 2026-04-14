import { Head, useForm } from '@inertiajs/react';
import { Building2 } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Bases', href: '/fleet/bases' },
    { title: 'Nueva base', href: '/fleet/bases/create' },
];

const inputClass = 'h-10 rounded-lg border border-white/10 bg-white/[0.04] px-3 text-sm text-white placeholder:text-white/25 focus-visible:border-[#FFC107] focus-visible:ring-2 focus-visible:ring-[#FFC107]/20 focus-visible:outline-none';
const labelClass = 'text-[11px] font-semibold uppercase tracking-widest text-white/40';

export default function BaseCreate() {
    const { data, setData, post, processing } = useForm({
        name:      '',
        address:   '',
        latitude:  '',
        longitude: '',
        capacity:  '',
        is_active: true,
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Nueva Base — VECTO" />

            <div className="flex flex-col gap-6 p-4 md:p-6">
                <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg" style={{ background: 'rgba(255,193,7,0.12)' }}>
                        <Building2 size={20} style={{ color: '#FFC107' }} />
                    </div>
                    <h1 className="text-2xl font-black uppercase tracking-tight text-white" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                        Nueva Base Operativa
                    </h1>
                </div>

                <div className="rounded-xl border p-6" style={{ borderColor: 'rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)' }}>
                    <form onSubmit={(e) => { e.preventDefault(); post('/fleet/bases'); }} className="grid gap-5 sm:grid-cols-2">

                        <div className="flex flex-col gap-1.5 sm:col-span-2">
                            <Label className={labelClass}>Nombre de la Base *</Label>
                            <Input className={inputClass} value={data.name} onChange={e => setData('name', e.target.value)} placeholder="Base Norte, Bodega Central…" required />
                        </div>

                        <div className="flex flex-col gap-1.5 sm:col-span-2">
                            <Label className={labelClass}>Dirección</Label>
                            <textarea
                                value={data.address}
                                onChange={e => setData('address', e.target.value)}
                                rows={2}
                                className="resize-none rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white placeholder:text-white/25 focus-visible:border-[#FFC107] focus-visible:outline-none"
                                placeholder="Dirección completa de la base"
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <Label className={labelClass}>Latitud</Label>
                            <Input className={inputClass} type="number" step="any" value={data.latitude} onChange={e => setData('latitude', e.target.value)} placeholder="4.7110" />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <Label className={labelClass}>Longitud</Label>
                            <Input className={inputClass} type="number" step="any" value={data.longitude} onChange={e => setData('longitude', e.target.value)} placeholder="-74.0721" />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <Label className={labelClass}>Capacidad (vehículos)</Label>
                            <Input className={inputClass} type="number" min="0" value={data.capacity} onChange={e => setData('capacity', e.target.value)} placeholder="20" />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <Label className={labelClass}>Estado</Label>
                            <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2">
                                <input
                                    type="checkbox"
                                    id="is_active"
                                    checked={data.is_active}
                                    onChange={e => setData('is_active', e.target.checked)}
                                    className="accent-[#FFC107]"
                                />
                                <label htmlFor="is_active" className="text-sm text-white/70 cursor-pointer">Base activa</label>
                            </div>
                        </div>

                        <div className="flex gap-3 sm:col-span-2">
                            <Button type="submit" disabled={processing} className="bg-[#FFC107] font-bold text-black hover:bg-[#E6AC00]">
                                {processing ? 'Guardando…' : 'Crear base'}
                            </Button>
                            <Button asChild variant="ghost" className="text-white/50 hover:text-white">
                                <a href="/fleet/bases">Cancelar</a>
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
