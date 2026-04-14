import { Head, useForm } from '@inertiajs/react';
import { ClipboardCheck } from 'lucide-react';
import { useMemo } from 'react';
import AppLayout from '@/layouts/app-layout';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Preoperacional', href: '/fleet/preoperational' },
    { title: 'Nueva inspección', href: '/fleet/preoperational/create' },
];

const labelClass = 'text-[11px] font-semibold uppercase tracking-widest text-white/40';
const inputClass = 'h-10 rounded-lg border border-white/10 bg-white/[0.04] px-3 text-sm text-white placeholder:text-white/25 focus-visible:border-[#FFC107] focus-visible:ring-2 focus-visible:ring-[#FFC107]/20 focus-visible:outline-none';

type Item = { id: number; category: string; name: string; is_required: boolean };
type VehicleOption = { value: number; label: string };

export default function PreoperationalCreate({
    vehicles,
    items,
    vehicle_id,
}: {
    vehicles: VehicleOption[];
    items: Item[];
    vehicle_id: number | null;
}) {
    const categories = useMemo(() => {
        const map = new Map<string, Item[]>();
        items.forEach(item => {
            if (!map.has(item.category)) map.set(item.category, []);
            map.get(item.category)!.push(item);
        });
        return Array.from(map.entries());
    }, [items]);

    const initialResponses = useMemo(() =>
        items.reduce((acc, item) => {
            acc[item.id] = { item_id: item.id, value: 'ok', note: '' };
            return acc;
        }, {} as Record<number, { item_id: number; value: string; note: string }>),
        [items]
    );

    const { data, setData, post, processing, errors } = useForm<{
        vehicle_id: string;
        odometer:   string;
        observations: string;
        responses:  Record<number, { item_id: number; value: string; note: string }>;
    }>({
        vehicle_id:   String(vehicle_id ?? ''),
        odometer:     '',
        observations: '',
        responses:    initialResponses,
    });

    function setResponse(itemId: number, field: 'value' | 'note', val: string) {
        setData('responses', {
            ...data.responses,
            [itemId]: { ...data.responses[itemId], [field]: val },
        });
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const payload = {
            ...data,
            responses: Object.values(data.responses),
        };
        post('/fleet/preoperational', { data: payload });
    }

    const VALUE_OPTIONS = [
        { value: 'ok',   label: '✓ OK',        cls: 'border-green-500/30 bg-green-500/10 text-green-400' },
        { value: 'fail', label: '✗ Falla',      cls: 'border-red-500/30 bg-red-500/10 text-red-400' },
        { value: 'na',   label: 'N/A',          cls: 'border-zinc-500/30 bg-zinc-500/10 text-zinc-400' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Nueva Inspección Preoperacional — VECTO" />

            <div className="flex flex-col gap-6 p-4 md:p-6">
                <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg" style={{ background: 'rgba(255,193,7,0.12)' }}>
                        <ClipboardCheck size={20} style={{ color: '#FFC107' }} />
                    </div>
                    <h1 className="text-2xl font-black uppercase tracking-tight text-white" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                        Inspección Preoperacional
                    </h1>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    {/* Vehicle + odometer */}
                    <div className="grid gap-5 rounded-xl border p-5 sm:grid-cols-2" style={{ borderColor: 'rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)' }}>
                        <div className="flex flex-col gap-1.5">
                            <Label className={labelClass}>Vehículo *</Label>
                            <Select value={data.vehicle_id} onValueChange={v => setData('vehicle_id', v)}>
                                <SelectTrigger className={inputClass}><SelectValue placeholder="Seleccionar vehículo" /></SelectTrigger>
                                <SelectContent>
                                    {vehicles.map(v => <SelectItem key={v.value} value={String(v.value)}>{v.label}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            <InputError message={errors.vehicle_id} />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <Label className={labelClass}>Odómetro (km)</Label>
                            <Input className={inputClass} type="number" min="0" value={data.odometer} onChange={e => setData('odometer', e.target.value)} placeholder="125000" />
                        </div>
                    </div>

                    {/* Checklist */}
                    {items.length === 0 ? (
                        <div className="rounded-xl border p-8 text-center text-sm text-white/40" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                            No hay ítems de checklist configurados.{' '}
                            <a href="/fleet/preoperational-items" className="text-[#FFC107] hover:underline">Configúralos aquí →</a>
                        </div>
                    ) : (
                        categories.map(([category, catItems]) => (
                            <div key={category} className="rounded-xl border" style={{ borderColor: 'rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)' }}>
                                <div className="border-b px-5 py-3" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                                    <h3 className="text-xs font-bold uppercase tracking-widest text-white/50">{category}</h3>
                                </div>
                                <div className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
                                    {catItems.map(item => {
                                        const resp = data.responses[item.id];
                                        return (
                                            <div key={item.id} className="flex flex-wrap items-center gap-4 px-5 py-3">
                                                <div className="flex-1 min-w-[160px]">
                                                    <span className="text-sm text-white">{item.name}</span>
                                                    {item.is_required && (
                                                        <span className="ml-2 text-[10px] text-red-400/70">*requerido</span>
                                                    )}
                                                </div>
                                                <div className="flex gap-1.5">
                                                    {VALUE_OPTIONS.map(opt => (
                                                        <button
                                                            key={opt.value}
                                                            type="button"
                                                            onClick={() => setResponse(item.id, 'value', opt.value)}
                                                            className={`rounded-lg border px-3 py-1 text-xs font-semibold transition-all ${
                                                                resp?.value === opt.value
                                                                    ? opt.cls + ' ring-1 ring-offset-1 ring-offset-black'
                                                                    : 'border-white/10 text-white/30 hover:border-white/20'
                                                            }`}
                                                        >
                                                            {opt.label}
                                                        </button>
                                                    ))}
                                                </div>
                                                {resp?.value === 'fail' && (
                                                    <Input
                                                        className="h-8 w-full sm:w-48 rounded-lg border border-white/10 bg-white/[0.04] px-2 text-xs text-white placeholder:text-white/25 focus-visible:border-[#FFC107] focus-visible:outline-none"
                                                        placeholder="Describir la falla…"
                                                        value={resp.note}
                                                        onChange={e => setResponse(item.id, 'note', e.target.value)}
                                                    />
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))
                    )}

                    {/* Observations */}
                    <div className="flex flex-col gap-1.5 rounded-xl border p-5" style={{ borderColor: 'rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)' }}>
                        <Label className={labelClass}>Observaciones Generales</Label>
                        <textarea
                            value={data.observations}
                            onChange={e => setData('observations', e.target.value)}
                            rows={3}
                            className="resize-none rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white placeholder:text-white/25 focus-visible:border-[#FFC107] focus-visible:outline-none"
                            placeholder="Observaciones adicionales sobre el estado del vehículo…"
                        />
                    </div>

                    <div className="flex gap-3">
                        <Button type="submit" disabled={processing} className="bg-[#FFC107] font-bold text-black hover:bg-[#E6AC00]">
                            {processing ? 'Registrando…' : 'Registrar inspección'}
                        </Button>
                        <Button asChild variant="ghost" className="text-white/50 hover:text-white">
                            <a href="/fleet/preoperational">Cancelar</a>
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
