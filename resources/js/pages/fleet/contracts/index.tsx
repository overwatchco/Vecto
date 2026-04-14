import { Head, Link, router } from '@inertiajs/react';
import { Eye, FileText, Plus, Trash2 } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Contratos', href: '/fleet/contracts' },
];

const STATUS_STYLES: Record<string, string> = {
    active:    'bg-green-500/15 text-green-400 border-green-500/20',
    expired:   'bg-zinc-500/15 text-zinc-400 border-zinc-500/20',
    suspended: 'bg-red-500/15 text-red-400 border-red-500/20',
};
const STATUS_LABELS: Record<string, string> = {
    active: 'Activo', expired: 'Vencido', suspended: 'Suspendido',
};

function fmt(n: number) {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(n);
}

type Contract = {
    id: number;
    code: string | null;
    client: string;
    service_type: string;
    rate: number;
    rate_unit: string;
    start_date: string;
    end_date: string | null;
    status: string;
    vehicles_count: number;
};

export default function ContractsIndex({ contracts }: { contracts: Contract[] }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Contratos — VECTO" />

            <div className="flex flex-col gap-6 p-4 md:p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-lg" style={{ background: 'rgba(255,193,7,0.12)' }}>
                            <FileText size={20} style={{ color: '#FFC107' }} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black uppercase tracking-tight text-white" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                                Contratos
                            </h1>
                            <p className="text-xs text-white/40">{contracts.length} contratos registrados</p>
                        </div>
                    </div>
                    <Button asChild className="bg-[#FFC107] text-black font-bold hover:bg-[#E6AC00]">
                        <Link href="/fleet/contracts/create"><Plus size={16} className="mr-1.5" />Nuevo contrato</Link>
                    </Button>
                </div>

                <div className="rounded-xl border" style={{ borderColor: 'rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)' }}>
                    {contracts.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-white/30">
                            <FileText size={40} className="mb-3 opacity-30" />
                            <p className="text-sm">No hay contratos registrados.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                                        {['Código', 'Cliente', 'Servicio', 'Tarifa', 'Inicio', 'Fin', 'Estado', 'Vehículos', ''].map(h => (
                                            <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-widest text-white/35">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {contracts.map(c => (
                                        <tr key={c.id} className="hover:bg-white/[0.02]" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                                            <td className="px-4 py-3 font-mono text-xs text-[#FFC107]">{c.code ?? '—'}</td>
                                            <td className="px-4 py-3 font-medium text-white">{c.client}</td>
                                            <td className="px-4 py-3 text-xs text-white/60">{c.service_type}</td>
                                            <td className="px-4 py-3 text-white/80">{fmt(c.rate)}<span className="text-xs text-white/40">/{c.rate_unit}</span></td>
                                            <td className="px-4 py-3 text-xs text-white/50">{c.start_date}</td>
                                            <td className="px-4 py-3 text-xs text-white/50">{c.end_date ?? 'Indefinido'}</td>
                                            <td className="px-4 py-3">
                                                <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[c.status]}`}>
                                                    {STATUS_LABELS[c.status]}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-center text-white/60">{c.vehicles_count}</td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-1">
                                                    <Button asChild size="icon" variant="ghost" className="size-8 text-white/40 hover:text-[#FFC107]">
                                                        <Link href={`/fleet/contracts/${c.id}`}><Eye size={14} /></Link>
                                                    </Button>
                                                    <Button
                                                        size="icon" variant="ghost"
                                                        className="size-8 text-white/30 hover:text-red-400"
                                                        onClick={() => { if (confirm('¿Eliminar contrato?')) router.delete(`/fleet/contracts/${c.id}`); }}
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
