import { Head, Link, router } from '@inertiajs/react';
import { Car, Edit, Eye, Plus, Trash2 } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Vehículos', href: '/fleet/vehicles' },
];

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
    active:      { label: 'Activo',            color: 'bg-green-500/15 text-green-400 border-green-500/20' },
    inactive:    { label: 'Inactivo',           color: 'bg-zinc-500/15 text-zinc-400 border-zinc-500/20' },
    maintenance: { label: 'En Mantenimiento',   color: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/20' },
};

type Vehicle = {
    id: number;
    plate: string;
    type: string;
    brand: string;
    model: string;
    year: number;
    color: string | null;
    status: string;
    photo: string | null;
    company_name: string | null;
};

export default function VehiclesIndex({ vehicles }: { vehicles: Vehicle[] }) {
    function confirmDelete(id: number, plate: string) {
        if (confirm(`¿Eliminar el vehículo ${plate}?`)) {
            router.delete(`/fleet/vehicles/${id}`);
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Vehículos — VECTO" />

            <div className="flex flex-col gap-6 p-4 md:p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div
                            className="flex size-10 items-center justify-center rounded-lg"
                            style={{ background: 'rgba(255,193,7,0.12)' }}
                        >
                            <Car size={20} style={{ color: '#FFC107' }} />
                        </div>
                        <div>
                            <h1
                                className="text-2xl font-black uppercase tracking-tight text-white"
                                style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                            >
                                Inventario de Flota
                            </h1>
                            <p className="text-xs text-white/40">{vehicles.length} vehículos registrados</p>
                        </div>
                    </div>
                    <Button asChild className="bg-[#FFC107] text-black font-bold hover:bg-[#E6AC00]">
                        <Link href="/fleet/vehicles/create">
                            <Plus size={16} className="mr-1.5" />
                            Nuevo vehículo
                        </Link>
                    </Button>
                </div>

                {/* Table */}
                <div className="rounded-xl border" style={{ borderColor: 'rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)' }}>
                    {vehicles.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-white/30">
                            <Car size={40} className="mb-3 opacity-30" />
                            <p className="text-sm">No hay vehículos registrados aún.</p>
                            <Link href="/fleet/vehicles/create" className="mt-3 text-sm text-[#FFC107] hover:underline">
                                Registrar primer vehículo →
                            </Link>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                                        {['Placa', 'Vehículo', 'Año', 'Estado', 'Empresa', 'Acciones'].map((h) => (
                                            <th
                                                key={h}
                                                className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-widest text-white/35"
                                            >
                                                {h}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {vehicles.map((v) => {
                                        const st = STATUS_LABELS[v.status] ?? { label: v.status, color: '' };
                                        return (
                                            <tr
                                                key={v.id}
                                                className="transition-colors hover:bg-white/[0.02]"
                                                style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                                            >
                                                <td className="px-4 py-3 font-mono font-bold text-[#FFC107]">
                                                    {v.plate}
                                                </td>
                                                <td className="px-4 py-3 text-white">
                                                    <div>{v.brand} {v.model}</div>
                                                    <div className="text-xs text-white/40 capitalize">{v.type}</div>
                                                </td>
                                                <td className="px-4 py-3 text-white/60">{v.year}</td>
                                                <td className="px-4 py-3">
                                                    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${st.color}`}>
                                                        {st.label}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-white/50 text-xs">{v.company_name ?? '—'}</td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-1">
                                                        <Button asChild size="icon" variant="ghost" className="size-8 text-white/50 hover:text-white">
                                                            <Link href={`/fleet/vehicles/${v.id}`}><Eye size={14} /></Link>
                                                        </Button>
                                                        <Button asChild size="icon" variant="ghost" className="size-8 text-white/50 hover:text-[#FFC107]">
                                                            <Link href={`/fleet/vehicles/${v.id}/edit`}><Edit size={14} /></Link>
                                                        </Button>
                                                        <Button
                                                            size="icon"
                                                            variant="ghost"
                                                            className="size-8 text-white/50 hover:text-red-400"
                                                            onClick={() => confirmDelete(v.id, v.plate)}
                                                        >
                                                            <Trash2 size={14} />
                                                        </Button>
                                                    </div>
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
