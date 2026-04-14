import { Head, useForm } from '@inertiajs/react';
import { Package } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Materiales', href: '/fleet/materials' },
    { title: 'Nuevo material', href: '/fleet/materials/create' },
];

const inputClass = 'h-10 rounded-lg border border-white/10 bg-white/[0.04] px-3 text-sm text-white placeholder:text-white/25 focus-visible:border-[#FFC107] focus-visible:ring-2 focus-visible:ring-[#FFC107]/20 focus-visible:outline-none';
const labelClass = 'text-[11px] font-semibold uppercase tracking-widest text-white/40';

const UNITS = ['und', 'lt', 'kg', 'm', 'ml', 'gal', 'par', 'caja', 'rollo'];

export default function MaterialCreate() {
    const { data, setData, post, processing } = useForm({
        name:               '',
        reference:          '',
        unit:               'und',
        unit_cost:          '',
        stock:              '0',
        min_stock:          '0',
        provider:           '',
        warehouse_location: '',
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Nuevo Material — VECTO" />

            <div className="flex flex-col gap-6 p-4 md:p-6">
                <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg" style={{ background: 'rgba(255,193,7,0.12)' }}>
                        <Package size={20} style={{ color: '#FFC107' }} />
                    </div>
                    <h1 className="text-2xl font-black uppercase tracking-tight text-white" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                        Registrar Material
                    </h1>
                </div>

                <div className="rounded-xl border p-6" style={{ borderColor: 'rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)' }}>
                    <form onSubmit={(e) => { e.preventDefault(); post('/fleet/materials'); }} className="grid gap-5 sm:grid-cols-2">

                        <div className="flex flex-col gap-1.5 sm:col-span-2">
                            <Label className={labelClass}>Nombre del Material *</Label>
                            <Input className={inputClass} value={data.name} onChange={e => setData('name', e.target.value)} placeholder="Filtro de aceite, Pastillas de freno…" required />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <Label className={labelClass}>Referencia / Código</Label>
                            <Input className={inputClass} value={data.reference} onChange={e => setData('reference', e.target.value)} placeholder="REF-001" />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <Label className={labelClass}>Unidad de Medida *</Label>
                            <Select value={data.unit} onValueChange={v => setData('unit', v)}>
                                <SelectTrigger className={inputClass}><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {UNITS.map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <Label className={labelClass}>Costo Unitario (COP)</Label>
                            <Input className={inputClass} type="number" min="0" value={data.unit_cost} onChange={e => setData('unit_cost', e.target.value)} placeholder="0" />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <Label className={labelClass}>Stock Inicial</Label>
                            <Input className={inputClass} type="number" min="0" step="0.01" value={data.stock} onChange={e => setData('stock', e.target.value)} placeholder="0" />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <Label className={labelClass}>Stock Mínimo (Alerta)</Label>
                            <Input className={inputClass} type="number" min="0" step="0.01" value={data.min_stock} onChange={e => setData('min_stock', e.target.value)} placeholder="0" />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <Label className={labelClass}>Proveedor</Label>
                            <Input className={inputClass} value={data.provider} onChange={e => setData('provider', e.target.value)} placeholder="Nombre del proveedor" />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <Label className={labelClass}>Ubicación en Bodega</Label>
                            <Input className={inputClass} value={data.warehouse_location} onChange={e => setData('warehouse_location', e.target.value)} placeholder="Estante A-3, Bodega Sur…" />
                        </div>

                        <div className="flex gap-3 sm:col-span-2">
                            <Button type="submit" disabled={processing} className="bg-[#FFC107] font-bold text-black hover:bg-[#E6AC00]">
                                {processing ? 'Guardando…' : 'Registrar material'}
                            </Button>
                            <Button asChild variant="ghost" className="text-white/50 hover:text-white">
                                <a href="/fleet/materials">Cancelar</a>
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
