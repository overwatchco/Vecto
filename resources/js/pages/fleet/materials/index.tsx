import { Head, Link, router } from '@inertiajs/react';
import { AlertTriangle, Edit, Package, Plus, Trash2 } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Materiales', href: '/fleet/materials' },
];

type Material = {
    id: number;
    name: string;
    reference: string | null;
    unit: string;
    unit_cost: number;
    stock: number;
    min_stock: number;
    provider: string | null;
    warehouse_location: string | null;
    is_low_stock: boolean;
    is_active: boolean;
    total_value: number;
};

function fmt(n: number) {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(n);
}

export default function MaterialsIndex({ materials, low_stock_count }: { materials: Material[]; low_stock_count: number }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Materiales — VECTO" />

            <div className="flex flex-col gap-6 p-4 md:p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-lg" style={{ background: 'rgba(255,193,7,0.12)' }}>
                            <Package size={20} style={{ color: '#FFC107' }} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black uppercase tracking-tight text-white" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                                Materiales y Repuestos
                            </h1>
                            <p className="text-xs text-white/40">{materials.length} ítems en inventario</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        {low_stock_count > 0 && (
                            <div className="flex items-center gap-2 rounded-lg border border-orange-500/20 bg-orange-500/10 px-3 py-1.5 text-xs text-orange-400">
                                <AlertTriangle size={12} />
                                {low_stock_count} con stock bajo
                            </div>
                        )}
                        <Button asChild className="bg-[#FFC107] text-black font-bold hover:bg-[#E6AC00]">
                            <Link href="/fleet/materials/create"><Plus size={16} className="mr-1.5" />Nuevo</Link>
                        </Button>
                    </div>
                </div>

                <div className="rounded-xl border" style={{ borderColor: 'rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)' }}>
                    {materials.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-white/30">
                            <Package size={40} className="mb-3 opacity-30" />
                            <p className="text-sm">No hay materiales registrados.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                                        {['Material', 'Ref.', 'Stock', 'Costo Unit.', 'Valor Total', 'Proveedor', 'Acciones'].map(h => (
                                            <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-widest text-white/35">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {materials.map(m => (
                                        <tr key={m.id} className="transition-colors hover:bg-white/[0.02]" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                                            <td className="px-4 py-3">
                                                <div className="font-medium text-white">{m.name}</div>
                                                <div className="text-xs text-white/40">{m.unit}</div>
                                            </td>
                                            <td className="px-4 py-3 font-mono text-xs text-white/50">{m.reference ?? '—'}</td>
                                            <td className="px-4 py-3">
                                                <div className={`font-bold ${m.is_low_stock ? 'text-orange-400' : 'text-white'}`}>
                                                    {Number(m.stock).toLocaleString('es-CO')} {m.unit}
                                                </div>
                                                {m.is_low_stock && (
                                                    <div className="text-[10px] text-orange-400/70">Mín: {m.min_stock}</div>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-white/70">{fmt(m.unit_cost)}</td>
                                            <td className="px-4 py-3 text-white/70">{fmt(m.total_value)}</td>
                                            <td className="px-4 py-3 text-xs text-white/40">{m.provider ?? '—'}</td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-1">
                                                    <Button asChild size="sm" variant="ghost" className="text-xs text-white/40 hover:text-[#FFC107]">
                                                        <Link href={`/fleet/materials/${m.id}/movements`}>Movimientos</Link>
                                                    </Button>
                                                    <Button asChild size="icon" variant="ghost" className="size-8 text-white/40 hover:text-[#FFC107]">
                                                        <Link href={`/fleet/materials/${m.id}/edit`}><Edit size={13} /></Link>
                                                    </Button>
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        className="size-8 text-white/30 hover:text-red-400"
                                                        onClick={() => { if (confirm('¿Eliminar?')) router.delete(`/fleet/materials/${m.id}`); }}
                                                    >
                                                        <Trash2 size={13} />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
