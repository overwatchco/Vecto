import { Head, Link } from '@inertiajs/react';
import { BarChart3, DollarSign, TrendingDown, TrendingUp } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import type { BreadcrumbItem } from '@/types';

const CATEGORY_LABELS: Record<string, string> = {
    maintenance: 'Mantenimiento', fuel: 'Combustible', materials: 'Materiales',
    insurance: 'Seguros', taxes: 'Impuestos', tolls: 'Peajes', other: 'Otros',
};

function fmt(n: number) {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(n);
}

type Props = {
    vehicle: { id: number; label: string; plate: string };
    total_costs: number;
    total_revenues: number;
    profit: number;
    monthly: { month: string; total: number }[];
    costs: { id: number; category: string; description: string; amount: number; date: string }[];
    revenues: { id: number; description: string; amount: number; date: string }[];
};

export default function CostsVehicle({ vehicle, total_costs, total_revenues, profit, monthly, costs, revenues }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Costos', href: '/fleet/costs' },
        { title: vehicle.plate, href: `/fleet/costs/vehicle/${vehicle.id}` },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Costos ${vehicle.plate} — VECTO`} />

            <div className="flex flex-col gap-6 p-4 md:p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-black uppercase tracking-tight text-white" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                            {vehicle.label}
                        </h1>
                        <p className="text-xs text-white/40">Historial completo de costos e ingresos</p>
                    </div>
                    <Button asChild className="bg-[#FFC107] text-black font-bold hover:bg-[#E6AC00]">
                        <Link href="/fleet/costs/create">Registrar costo</Link>
                    </Button>
                </div>

                {/* Summary */}
                <div className="grid gap-4 sm:grid-cols-3">
                    {[
                        { label: 'Total Costos', value: fmt(total_costs), icon: TrendingDown, color: 'text-red-400' },
                        { label: 'Total Ingresos', value: fmt(total_revenues), icon: TrendingUp, color: 'text-green-400' },
                        { label: 'Utilidad', value: fmt(profit), icon: BarChart3, color: profit >= 0 ? 'text-green-400' : 'text-red-400' },
                    ].map(({ label, value, icon: Icon, color }) => (
                        <div key={label} className="rounded-xl border p-4" style={{ borderColor: 'rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)' }}>
                            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-white/40">
                                <Icon size={12} />{label}
                            </div>
                            <p className={`mt-1 text-xl font-bold ${color}`}>{value}</p>
                        </div>
                    ))}
                </div>

                {/* Monthly breakdown */}
                {monthly.length > 0 && (
                    <div className="rounded-xl border p-5" style={{ borderColor: 'rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)' }}>
                        <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-white/40">Costos Mensuales</h2>
                        <div className="flex flex-wrap gap-3">
                            {monthly.map(m => (
                                <div key={m.month} className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-center">
                                    <div className="text-[10px] text-white/40">{m.month}</div>
                                    <div className="mt-0.5 text-sm font-bold text-red-400">{fmt(m.total)}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="grid gap-4 lg:grid-cols-2">
                    {/* Costs table */}
                    <div className="rounded-xl border" style={{ borderColor: 'rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)' }}>
                        <div className="border-b px-5 py-3" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                            <h2 className="text-xs font-semibold uppercase tracking-widest text-white/40 flex items-center gap-2">
                                <TrendingDown size={12} /> Costos ({costs.length})
                            </h2>
                        </div>
                        <div className="max-h-72 overflow-y-auto">
                            {costs.map(c => (
                                <div key={c.id} className="flex items-center justify-between border-b px-4 py-2.5 text-xs" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
                                    <div>
                                        <div className="text-white">{c.description}</div>
                                        <div className="text-white/40">{c.date} · {CATEGORY_LABELS[c.category] ?? c.category}</div>
                                    </div>
                                    <div className="font-bold text-red-400 shrink-0 ml-3">{fmt(c.amount)}</div>
                                </div>
                            ))}
                            {costs.length === 0 && <p className="p-4 text-xs text-white/30">Sin costos registrados.</p>}
                        </div>
                    </div>

                    {/* Revenues table */}
                    <div className="rounded-xl border" style={{ borderColor: 'rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)' }}>
                        <div className="border-b px-5 py-3" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                            <h2 className="text-xs font-semibold uppercase tracking-widest text-white/40 flex items-center gap-2">
                                <TrendingUp size={12} /> Ingresos ({revenues.length})
                            </h2>
                        </div>
                        <div className="max-h-72 overflow-y-auto">
                            {revenues.map(r => (
                                <div key={r.id} className="flex items-center justify-between border-b px-4 py-2.5 text-xs" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
                                    <div>
                                        <div className="text-white">{r.description}</div>
                                        <div className="text-white/40">{r.date}</div>
                                    </div>
                                    <div className="font-bold text-green-400 shrink-0 ml-3">{fmt(r.amount)}</div>
                                </div>
                            ))}
                            {revenues.length === 0 && <p className="p-4 text-xs text-white/30">Sin ingresos registrados.</p>}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
