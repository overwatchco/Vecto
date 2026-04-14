import { Head, Link, router } from '@inertiajs/react';
import { AlertTriangle, Plus, Trash2, Wrench } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Mantenimientos', href: '/fleet/maintenances' },
];

const TYPE_LABELS: Record<string, string> = { preventive: 'Preventivo', corrective: 'Correctivo' };
const STATUS_STYLES: Record<string, string> = {
    scheduled:   'bg-blue-500/15 text-blue-400 border-blue-500/20',
    in_progress: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/20',
    completed:   'bg-green-500/15 text-green-400 border-green-500/20',
    cancelled:   'bg-zinc-500/15 text-zinc-400 border-zinc-500/20',
};
const STATUS_LABELS: Record<string, string> = {
    scheduled: 'Programado', in_progress: 'En Proceso', completed: 'Completado', cancelled: 'Cancelado',
};

type Maintenance = {
    id: number;
    vehicle_plate: string;
    vehicle_label: string;
    type: string;
    date: string;
    description: string;
    cost: number;
    status: string;
    provider: string | null;
    next_maintenance_date: string | null;
    responsible_name: string | null;
};

function fmt(n: number) {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(n);
}

export default function MaintenancesIndex({ maintenances, upcoming_alerts }: { maintenances: Maintenance[]; upcoming_alerts: number }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Mantenimientos — VECTO" />

            <div className="flex flex-col gap-6 p-4 md:p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-lg" style={{ background: 'rgba(255,193,7,0.12)' }}>
                            <Wrench size={20} style={{ color: '#FFC107' }} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black uppercase tracking-tight text-white" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                                Mantenimientos
                            </h1>
                            <p className="text-xs text-white/40">{maintenances.length} registros</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        {upcoming_alerts > 0 && (
                            <div className="flex items-center gap-2 rounded-lg border border-yellow-500/20 bg-yellow-500/10 px-3 py-1.5 text-xs text-yellow-400">
                                <AlertTriangle size={12} />
                                {upcoming_alerts} próximos esta semana
                            </div>
                        )}
                        <Button asChild className="bg-[#FFC107] text-black font-bold hover:bg-[#E6AC00]">
                            <Link href="/fleet/maintenances/create">
                                <Plus size={16} className="mr-1.5" />Nuevo
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="rounded-xl border" style={{ borderColor: 'rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)' }}>
                    {maintenances.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-white/30">
                            <Wrench size={40} className="mb-3 opacity-30" />
                            <p className="text-sm">No hay mantenimientos registrados.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                                        {['Vehículo', 'Tipo', 'Fecha', 'Descripción', 'Costo', 'Estado', 'Próximo', ''].map(h => (
                                            <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-widest text-white/35">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {maintenances.map(m => (
                                        <tr key={m.id} className="transition-colors hover:bg-white/[0.02]" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                                            <td className="px-4 py-3">
                                                <div className="font-mono text-[#FFC107] text-xs font-bold">{m.vehicle_plate}</div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${m.type === 'preventive' ? 'border-blue-500/20 bg-blue-500/10 text-blue-400' : 'border-orange-500/20 bg-orange-500/10 text-orange-400'}`}>
                                                    {TYPE_LABELS[m.type]}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-white/60">{m.date}</td>
                                            <td className="max-w-[200px] truncate px-4 py-3 text-white">{m.description}</td>
                                            <td className="px-4 py-3 text-white/80">{fmt(m.cost)}</td>
                                            <td className="px-4 py-3">
                                                <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[m.status]}`}>
                                                    {STATUS_LABELS[m.status]}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-xs text-white/40">{m.next_maintenance_date ?? '—'}</td>
                                            <td className="px-4 py-3">
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    className="size-8 text-white/30 hover:text-red-400"
                                                    onClick={() => {
                                                        if (confirm('¿Eliminar este mantenimiento?')) {
                                                            router.delete(`/fleet/maintenances/${m.id}`);
                                                        }
                                                    }}
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
