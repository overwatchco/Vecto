import { Head, Link, router } from '@inertiajs/react';
import { Plus, Trash2, TrendingUp } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Ingresos', href: '/fleet/revenues' },
];

function fmt(n: number) {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(n);
}

type Revenue = {
    id: number;
    vehicle_label: string;
    contract_client: string | null;
    description: string;
    amount: number;
    date: string;
    invoice_ref: string | null;
};

export default function RevenuesIndex({ revenues, total_revenue }: { revenues: Revenue[]; total_revenue: number }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Ingresos — VECTO" />

            <div className="flex flex-col gap-6 p-4 md:p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-lg" style={{ background: 'rgba(255,193,7,0.12)' }}>
                            <TrendingUp size={20} style={{ color: '#FFC107' }} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black uppercase tracking-tight text-white" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                                Ingresos por Vehículo
                            </h1>
                            <p className="text-xs text-white/40">Total: <span className="font-bold text-green-400">{fmt(total_revenue)}</span></p>
                        </div>
                    </div>
                    <Button asChild className="bg-[#FFC107] text-black font-bold hover:bg-[#E6AC00]">
                        <Link href="/fleet/revenues/create"><Plus size={16} className="mr-1.5" />Registrar ingreso</Link>
                    </Button>
                </div>

                <div className="rounded-xl border" style={{ borderColor: 'rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)' }}>
                    {revenues.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-white/30">
                            <TrendingUp size={40} className="mb-3 opacity-30" />
                            <p className="text-sm">No hay ingresos registrados.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                                        {['Fecha', 'Vehículo', 'Contrato', 'Descripción', 'Monto', 'Factura', ''].map(h => (
                                            <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-widest text-white/35">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {revenues.map(r => (
                                        <tr key={r.id} className="hover:bg-white/[0.02]" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                                            <td className="px-4 py-3 text-xs text-white/50">{r.date}</td>
                                            <td className="px-4 py-3 text-xs text-white/80">{r.vehicle_label}</td>
                                            <td className="px-4 py-3 text-xs text-white/50">{r.contract_client ?? '—'}</td>
                                            <td className="max-w-[180px] truncate px-4 py-3 text-white">{r.description}</td>
                                            <td className="px-4 py-3 font-bold text-green-400">{fmt(r.amount)}</td>
                                            <td className="px-4 py-3 font-mono text-xs text-white/40">{r.invoice_ref ?? '—'}</td>
                                            <td className="px-4 py-3">
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    className="size-8 text-white/30 hover:text-red-400"
                                                    onClick={() => { if (confirm('¿Eliminar?')) router.delete(`/fleet/revenues/${r.id}`); }}
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
