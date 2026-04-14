import { Head, Link, router } from '@inertiajs/react';
import { BarChart3, DollarSign, Plus, Trash2, TrendingDown, TrendingUp } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Costos', href: '/fleet/costs' },
];

const CATEGORY_LABELS: Record<string, string> = {
    maintenance: 'Mantenimiento',
    fuel:        'Combustible',
    materials:   'Materiales',
    insurance:   'Seguros',
    taxes:       'Impuestos',
    tolls:       'Peajes',
    other:       'Otros',
};

const PERIOD_OPTIONS = [
    { value: 'month',   label: 'Este mes' },
    { value: 'quarter', label: 'Este trimestre' },
    { value: 'year',    label: 'Este año' },
];

function fmt(n: number) {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(n);
}

type ByVehicle = { vehicle_label: string; total_costs: number; total_revenues: number; profit: number };
type RecentCost = { id: number; vehicle_label: string; category: string; description: string; amount: number; date: string };

type Props = {
    period: string;
    year: number;
    total_costs: number;
    total_revenues: number;
    profit: number;
    by_category: Record<string, { total: number; count: number }>;
    by_vehicle: ByVehicle[];
    recent_costs: RecentCost[];
};

export default function CostsIndex({ period, total_costs, total_revenues, profit, by_category, by_vehicle, recent_costs }: Props) {
    function changePeriod(p: string) {
        router.get('/fleet/costs', { period: p }, { preserveState: true, replace: true });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Costos — VECTO" />

            <div className="flex flex-col gap-6 p-4 md:p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-lg" style={{ background: 'rgba(255,193,7,0.12)' }}>
                            <DollarSign size={20} style={{ color: '#FFC107' }} />
                        </div>
                        <h1 className="text-2xl font-black uppercase tracking-tight text-white" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                            Gestión de Costos
                        </h1>
                    </div>
                    <div className="flex items-center gap-2">
                        {PERIOD_OPTIONS.map(p => (
                            <button
                                key={p.value}
                                onClick={() => changePeriod(p.value)}
                                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                                    period === p.value ? 'bg-[#FFC107] text-black' : 'border border-white/10 text-white/50 hover:border-white/20 hover:text-white'
                                }`}
                            >
                                {p.label}
                            </button>
                        ))}
                        <Button asChild className="ml-2 bg-[#FFC107] text-black font-bold hover:bg-[#E6AC00]">
                            <Link href="/fleet/costs/create"><Plus size={16} className="mr-1.5" />Registrar costo</Link>
                        </Button>
                    </div>
                </div>

                {/* Summary cards */}
                <div className="grid gap-4 sm:grid-cols-3">
                    {[
                        { label: 'Total Costos', value: fmt(total_costs), icon: TrendingDown, color: 'text-red-400' },
                        { label: 'Total Ingresos', value: fmt(total_revenues), icon: TrendingUp, color: 'text-green-400' },
                        { label: 'Utilidad Neta', value: fmt(profit), icon: BarChart3, color: profit >= 0 ? 'text-green-400' : 'text-red-400' },
                    ].map(({ label, value, icon: Icon, color }) => (
                        <div key={label} className="rounded-xl border p-5" style={{ borderColor: 'rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)' }}>
                            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-white/40">
                                <Icon size={13} />{label}
                            </div>
                            <p className={`mt-2 text-2xl font-bold ${color}`}>{value}</p>
                        </div>
                    ))}
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                    {/* By category */}
                    <div className="rounded-xl border p-5" style={{ borderColor: 'rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)' }}>
                        <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-white/40">Costos por Categoría</h2>
                        <div className="flex flex-col gap-2">
                            {Object.entries(by_category).map(([cat, data]) => (
                                <div key={cat} className="flex items-center justify-between text-sm">
                                    <span className="text-white/70">{CATEGORY_LABELS[cat] ?? cat}</span>
                                    <span className="font-bold text-white">{fmt(data.total)}</span>
                                </div>
                            ))}
                            {Object.keys(by_category).length === 0 && (
                                <p className="text-sm text-white/30">Sin datos para el período.</p>
                            )}
                        </div>
                    </div>

                    {/* By vehicle */}
                    <div className="rounded-xl border p-5" style={{ borderColor: 'rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)' }}>
                        <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-white/40">Rentabilidad por Vehículo</h2>
                        <div className="flex flex-col gap-2">
                            {by_vehicle.slice(0, 6).map((v, i) => (
                                <div key={i} className="flex items-center justify-between text-xs">
                                    <span className="truncate text-white/60 max-w-[160px]">{v.vehicle_label}</span>
                                    <span className={`font-bold ${v.profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>{fmt(v.profit)}</span>
                                </div>
                            ))}
                            {by_vehicle.length === 0 && (
                                <p className="text-sm text-white/30">Sin datos para el período.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Recent costs */}
                <div className="rounded-xl border" style={{ borderColor: 'rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)' }}>
                    <div className="border-b px-5 py-3" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                        <h2 className="text-xs font-semibold uppercase tracking-widest text-white/40">Costos Recientes</h2>
                    </div>
                    {recent_costs.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-white/30">
                            <DollarSign size={36} className="mb-2 opacity-30" />
                            <p className="text-sm">No hay costos en este período.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                                        {['Fecha', 'Vehículo', 'Categoría', 'Descripción', 'Monto', ''].map(h => (
                                            <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-widest text-white/35">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {recent_costs.map(c => (
                                        <tr key={c.id} className="hover:bg-white/[0.02]" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                                            <td className="px-4 py-3 text-white/50 text-xs">{c.date}</td>
                                            <td className="px-4 py-3 text-xs text-white/70">{c.vehicle_label}</td>
                                            <td className="px-4 py-3">
                                                <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] text-white/60">
                                                    {CATEGORY_LABELS[c.category] ?? c.category}
                                                </span>
                                            </td>
                                            <td className="max-w-[200px] truncate px-4 py-3 text-white">{c.description}</td>
                                            <td className="px-4 py-3 font-bold text-red-400">{fmt(c.amount)}</td>
                                            <td className="px-4 py-3">
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    className="size-8 text-white/30 hover:text-red-400"
                                                    onClick={() => { if (confirm('¿Eliminar?')) router.delete(`/fleet/costs/${c.id}`); }}
                                                >
                                                    <Trash2 size={13} />
                                                </Button>
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
