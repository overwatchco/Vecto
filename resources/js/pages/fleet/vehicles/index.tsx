import { Head, Link, router } from '@inertiajs/react';
import { Car, CheckCircle2, Edit, Eye, Plus, Search, Trash2, WrenchIcon, XCircle } from 'lucide-react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Vehículos', href: '/fleet/vehicles' },
];

const STATUS_MAP = {
    active:      { label: 'Activo',           cls: 'bg-green-500/15 text-green-400 border border-green-500/25',  dot: 'bg-green-400' },
    maintenance: { label: 'En Mantenimiento', cls: 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/25', dot: 'bg-yellow-400' },
    inactive:    { label: 'Inactivo',         cls: 'bg-zinc-500/15 text-zinc-400 border border-zinc-500/25',     dot: 'bg-zinc-400' },
} as const;

type Vehicle = {
    id: number;
    plate: string;
    type: string;
    brand: string;
    model: string;
    year: number;
    color: string | null;
    vin: string | null;
    status: keyof typeof STATUS_MAP;
    photo: string | null;
    company_name: string | null;
};

type Stats = { total: number; active: number; maintenance: number; inactive: number };

type Props = {
    vehicles: Vehicle[];
    stats: Stats;
    filters: { search: string; status: string };
};

function StatCard({ icon: Icon, label, value, color }: { icon: React.ElementType; label: string; value: number; color: string }) {
    return (
        <div
            className="flex items-center gap-4 rounded-xl border p-5"
            style={{ borderColor: 'rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)' }}
        >
            <div className="flex size-11 shrink-0 items-center justify-center rounded-lg" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <Icon size={20} style={{ color }} />
            </div>
            <div>
                <p className="text-2xl font-bold text-white">{value}</p>
                <p className="text-[11px] font-semibold uppercase tracking-widest text-white/40">{label}</p>
            </div>
        </div>
    );
}

export default function VehiclesIndex({ vehicles, stats, filters }: Props) {
    const [search, setSearch] = useState(filters.search);
    const [status, setStatus] = useState(filters.status);

    function applyFilters() {
        router.get('/fleet/vehicles', { search, status }, { preserveState: true, replace: true });
    }

    function clearFilters() {
        setSearch('');
        setStatus('');
        router.get('/fleet/vehicles', {}, { preserveState: false, replace: true });
    }

    function confirmDelete(id: number, plate: string) {
        if (confirm(`¿Eliminar el vehículo ${plate}? Esta acción no se puede deshacer.`)) {
            router.delete(`/fleet/vehicles/${id}`);
        }
    }

    const hasFilters = search || status;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Vehículos — VECTO" />

            <div className="flex flex-col gap-6 p-4 md:p-6">

                {/* ── Header ─────────────────────────────────────────────── */}
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
                            <p className="text-xs text-white/40">
                                {vehicles.length} vehículo{vehicles.length !== 1 ? 's' : ''} encontrado{vehicles.length !== 1 ? 's' : ''}
                            </p>
                        </div>
                    </div>
                    <Button asChild className="bg-[#FFC107] font-bold text-black hover:bg-[#E6AC00]">
                        <Link href="/fleet/vehicles/create">
                            <Plus size={16} className="mr-1.5" />
                            Nuevo vehículo
                        </Link>
                    </Button>
                </div>

                {/* ── Stats cards ────────────────────────────────────────── */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard icon={Car}         label="Total flota"       value={stats.total}       color="#FFC107" />
                    <StatCard icon={CheckCircle2} label="Activos"           value={stats.active}      color="#22c55e" />
                    <StatCard icon={WrenchIcon}   label="En mantenimiento"  value={stats.maintenance} color="#f59e0b" />
                    <StatCard icon={XCircle}      label="Inactivos"         value={stats.inactive}    color="#6b7280" />
                </div>

                {/* ── Filtros y búsqueda ──────────────────────────────────── */}
                <div
                    className="flex flex-wrap items-center gap-3 rounded-xl border p-4"
                    style={{ borderColor: 'rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)' }}
                >
                    <div className="relative flex-1 min-w-[200px]">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                        <Input
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && applyFilters()}
                            placeholder="Buscar por placa, marca, modelo…"
                            className="h-9 rounded-lg border border-white/10 bg-white/[0.04] pl-9 text-sm text-white placeholder:text-white/25 focus-visible:border-[#FFC107] focus-visible:outline-none focus-visible:ring-0"
                        />
                    </div>

                    <select
                        value={status}
                        onChange={e => setStatus(e.target.value)}
                        className="h-9 rounded-lg border border-white/10 bg-zinc-900 px-3 text-sm text-white focus:border-[#FFC107] focus:outline-none"
                    >
                        <option value="">Todos los estados</option>
                        <option value="active">Activo</option>
                        <option value="maintenance">En Mantenimiento</option>
                        <option value="inactive">Inactivo</option>
                    </select>

                    <Button
                        onClick={applyFilters}
                        className="h-9 bg-[#FFC107] font-bold text-black hover:bg-[#E6AC00]"
                    >
                        Filtrar
                    </Button>

                    {hasFilters && (
                        <Button
                            variant="ghost"
                            onClick={clearFilters}
                            className="h-9 text-white/40 hover:text-white"
                        >
                            Limpiar
                        </Button>
                    )}
                </div>

                {/* ── Tabla / Empty state ─────────────────────────────────── */}
                <div
                    className="rounded-xl border"
                    style={{ borderColor: 'rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)' }}
                >
                    {vehicles.length === 0 ? (
                        /* Empty state */
                        <div className="flex flex-col items-center justify-center py-20">
                            <div
                                className="mb-4 flex size-16 items-center justify-center rounded-2xl"
                                style={{ background: 'rgba(255,193,7,0.08)', border: '1px solid rgba(255,193,7,0.15)' }}
                            >
                                <Car size={28} style={{ color: '#FFC107' }} />
                            </div>
                            <p className="text-base font-semibold text-white">
                                {hasFilters ? 'Sin resultados' : 'No hay vehículos registrados'}
                            </p>
                            <p className="mt-1 text-sm text-white/40">
                                {hasFilters
                                    ? 'Prueba con otros filtros de búsqueda'
                                    : 'Comienza agregando tu primer vehículo a la flota'}
                            </p>
                            {!hasFilters && (
                                <Button asChild className="mt-5 bg-[#FFC107] font-bold text-black hover:bg-[#E6AC00]">
                                    <Link href="/fleet/vehicles/create">
                                        <Plus size={15} className="mr-1.5" />
                                        Agregar vehículo
                                    </Link>
                                </Button>
                            )}
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                                        {['Vehículo', 'Placa', 'Tipo', 'Año', 'Empresa', 'Estado', 'Acciones'].map(h => (
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
                                    {vehicles.map(v => {
                                        const st = STATUS_MAP[v.status] ?? STATUS_MAP.inactive;
                                        return (
                                            <tr
                                                key={v.id}
                                                className="group transition-colors hover:bg-white/[0.025]"
                                                style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                                            >
                                                {/* Vehículo */}
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-3">
                                                        <div
                                                            className="flex size-8 shrink-0 items-center justify-center rounded-lg"
                                                            style={{ background: 'rgba(255,193,7,0.1)' }}
                                                        >
                                                            <Car size={14} style={{ color: '#FFC107' }} />
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-white">
                                                                {v.brand} {v.model}
                                                            </p>
                                                            {v.vin && (
                                                                <p className="font-mono text-[10px] text-white/30">
                                                                    {v.vin}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Placa */}
                                                <td className="px-4 py-3">
                                                    <span className="font-mono text-sm font-bold tracking-wider text-[#FFC107]">
                                                        {v.plate}
                                                    </span>
                                                </td>

                                                {/* Tipo */}
                                                <td className="px-4 py-3 capitalize text-white/60">
                                                    {v.type}
                                                </td>

                                                {/* Año */}
                                                <td className="px-4 py-3 text-white/60">
                                                    {v.year}
                                                </td>

                                                {/* Empresa */}
                                                <td className="px-4 py-3 text-xs text-white/40">
                                                    {v.company_name ?? '—'}
                                                </td>

                                                {/* Estado */}
                                                <td className="px-4 py-3">
                                                    <span
                                                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${st.cls}`}
                                                    >
                                                        <span className={`size-1.5 rounded-full ${st.dot}`} />
                                                        {st.label}
                                                    </span>
                                                </td>

                                                {/* Acciones */}
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-0.5 opacity-60 transition-opacity group-hover:opacity-100">
                                                        <Button
                                                            asChild
                                                            size="icon"
                                                            variant="ghost"
                                                            className="size-8 text-white/60 hover:text-white"
                                                            title="Ver detalle"
                                                        >
                                                            <Link href={`/fleet/vehicles/${v.id}`}>
                                                                <Eye size={14} />
                                                            </Link>
                                                        </Button>
                                                        <Button
                                                            asChild
                                                            size="icon"
                                                            variant="ghost"
                                                            className="size-8 text-white/60 hover:text-[#FFC107]"
                                                            title="Editar"
                                                        >
                                                            <Link href={`/fleet/vehicles/${v.id}/edit`}>
                                                                <Edit size={14} />
                                                            </Link>
                                                        </Button>
                                                        <Button
                                                            size="icon"
                                                            variant="ghost"
                                                            className="size-8 text-white/60 hover:text-red-400"
                                                            title="Eliminar"
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
