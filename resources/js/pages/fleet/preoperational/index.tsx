import { Head, Link } from '@inertiajs/react';
import { CheckCircle2, ClipboardCheck, Plus, XCircle } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Preoperacional', href: '/fleet/preoperational' },
];

const RESULT_STYLES: Record<string, { label: string; cls: string; icon: React.ElementType }> = {
    fit:                   { label: 'Apto',                    cls: 'bg-green-500/15 text-green-400 border-green-500/20',  icon: CheckCircle2 },
    unfit:                 { label: 'No Apto',                 cls: 'bg-red-500/15 text-red-400 border-red-500/20',        icon: XCircle },
    fit_with_observations: { label: 'Apto con Observaciones',  cls: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/20', icon: ClipboardCheck },
};

type Inspection = {
    id: number;
    vehicle_label: string;
    inspector_name: string | null;
    result: string;
    odometer: number | null;
    inspected_at: string;
    observations: string | null;
};

export default function PreoperationalIndex({ inspections }: { inspections: Inspection[] }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Preoperacional — VECTO" />

            <div className="flex flex-col gap-6 p-4 md:p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-lg" style={{ background: 'rgba(255,193,7,0.12)' }}>
                            <ClipboardCheck size={20} style={{ color: '#FFC107' }} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black uppercase tracking-tight text-white" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                                Inspecciones Preoperacionales
                            </h1>
                            <p className="text-xs text-white/40">{inspections.length} inspecciones registradas</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button asChild variant="ghost" className="border border-white/10 text-white/60 hover:text-white text-xs">
                            <Link href="/fleet/preoperational-items">Configurar checklist</Link>
                        </Button>
                        <Button asChild className="bg-[#FFC107] text-black font-bold hover:bg-[#E6AC00]">
                            <Link href="/fleet/preoperational/create">
                                <Plus size={16} className="mr-1.5" />Nueva inspección
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="rounded-xl border" style={{ borderColor: 'rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)' }}>
                    {inspections.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-white/30">
                            <ClipboardCheck size={40} className="mb-3 opacity-30" />
                            <p className="text-sm">No hay inspecciones registradas.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                                        {['Fecha', 'Vehículo', 'Inspector', 'Resultado', 'Odómetro', ''].map(h => (
                                            <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-widest text-white/35">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {inspections.map(i => {
                                        const rs = RESULT_STYLES[i.result] ?? RESULT_STYLES.fit;
                                        return (
                                            <tr key={i.id} className="transition-colors hover:bg-white/[0.02]" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                                                <td className="px-4 py-3 text-white/60 text-xs">{i.inspected_at}</td>
                                                <td className="px-4 py-3 text-white text-xs">{i.vehicle_label}</td>
                                                <td className="px-4 py-3 text-white/60 text-xs">{i.inspector_name ?? '—'}</td>
                                                <td className="px-4 py-3">
                                                    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${rs.cls}`}>
                                                        <rs.icon size={11} />
                                                        {rs.label}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-white/50 text-xs">
                                                    {i.odometer ? `${i.odometer.toLocaleString('es-CO')} km` : '—'}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <Button asChild size="sm" variant="ghost" className="text-xs text-white/40 hover:text-[#FFC107]">
                                                        <Link href={`/fleet/preoperational/${i.id}`}>Ver →</Link>
                                                    </Button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
