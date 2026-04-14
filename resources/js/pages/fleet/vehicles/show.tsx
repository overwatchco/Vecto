import { Head, Link } from '@inertiajs/react';
import { Car, DollarSign, Edit, MapPin, TrendingDown, TrendingUp } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import type { BreadcrumbItem } from '@/types';

type Props = {
    vehicle: {
        id: number;
        plate: string;
        type: string;
        brand: string;
        model: string;
        year: number;
        color: string | null;
        vin: string | null;
        status: string;
        notes: string | null;
        photo: string | null;
        company?: { name: string };
        last_location?: { latitude: number; longitude: number; address: string | null; recorded_at: string } | null;
    };
    total_costs: number;
    total_revenues: number;
    profit: number;
};

const STATUS: Record<string, string> = {
    active:      'bg-green-500/15 text-green-400 border border-green-500/20',
    inactive:    'bg-zinc-500/15 text-zinc-400 border border-zinc-500/20',
    maintenance: 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/20',
};

const STATUS_LABELS: Record<string, string> = {
    active: 'Activo', inactive: 'Inactivo', maintenance: 'En Mantenimiento',
};

function fmt(n: number) {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(n);
}

export default function VehicleShow({ vehicle, total_costs, total_revenues, profit }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Vehículos', href: '/fleet/vehicles' },
        { title: `${vehicle.brand} ${vehicle.model} — ${vehicle.plate}`, href: `/fleet/vehicles/${vehicle.id}` },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${vehicle.plate} — VECTO`} />

            <div className="flex flex-col gap-6 p-4 md:p-6">
                {/* Header */}
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="flex size-14 items-center justify-center rounded-xl" style={{ background: 'rgba(255,193,7,0.12)' }}>
                            <Car size={26} style={{ color: '#FFC107' }} />
                        </div>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-3xl font-black uppercase tracking-tight text-white" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                                    {vehicle.plate}
                                </h1>
                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS[vehicle.status]}`}>
                                    {STATUS_LABELS[vehicle.status]}
                                </span>
                            </div>
                            <p className="text-sm text-white/50">{vehicle.brand} {vehicle.model} {vehicle.year} · {vehicle.type}</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button asChild variant="ghost" className="text-white/50 hover:text-[#FFC107]">
                            <Link href={`/fleet/vehicles/${vehicle.id}/edit`}><Edit size={14} className="mr-1.5" />Editar</Link>
                        </Button>
                        <Button asChild className="bg-[#FFC107] text-black font-bold hover:bg-[#E6AC00]">
                            <Link href={`/fleet/costs/vehicle/${vehicle.id}`}><DollarSign size={14} className="mr-1.5" />Ver costos</Link>
                        </Button>
                    </div>
                </div>

                {/* Financial summary */}
                <div className="grid gap-4 sm:grid-cols-3">
                    {[
                        { label: 'Total Costos', value: fmt(total_costs), icon: TrendingDown, color: 'text-red-400' },
                        { label: 'Total Ingresos', value: fmt(total_revenues), icon: TrendingUp, color: 'text-green-400' },
                        { label: 'Utilidad', value: fmt(profit), icon: DollarSign, color: profit >= 0 ? 'text-green-400' : 'text-red-400' },
                    ].map(({ label, value, icon: Icon, color }) => (
                        <div key={label} className="rounded-xl border p-4" style={{ borderColor: 'rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)' }}>
                            <div className="flex items-center gap-2 text-white/40 text-xs font-semibold uppercase tracking-widest">
                                <Icon size={14} />
                                {label}
                            </div>
                            <p className={`mt-1 text-xl font-bold ${color}`}>{value}</p>
                        </div>
                    ))}
                </div>

                {/* Details */}
                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-xl border p-5" style={{ borderColor: 'rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)' }}>
                        <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-white/40">Información del Vehículo</h2>
                        <dl className="grid grid-cols-2 gap-3 text-sm">
                            {[
                                ['Placa', vehicle.plate],
                                ['Tipo', vehicle.type],
                                ['Marca', vehicle.brand],
                                ['Modelo', vehicle.model],
                                ['Año', String(vehicle.year)],
                                ['Color', vehicle.color ?? '—'],
                                ['VIN', vehicle.vin ?? '—'],
                            ].map(([k, v]) => (
                                <div key={k}>
                                    <dt className="text-white/35 text-xs">{k}</dt>
                                    <dd className="font-medium text-white">{v}</dd>
                                </div>
                            ))}
                        </dl>
                    </div>

                    {vehicle.last_location && (
                        <div className="rounded-xl border p-5" style={{ borderColor: 'rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)' }}>
                            <h2 className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-white/40">
                                <MapPin size={12} /> Última Ubicación
                            </h2>
                            <p className="text-sm text-white">{vehicle.last_location.address ?? 'Sin dirección'}</p>
                            <p className="mt-1 text-xs text-white/40 font-mono">
                                {vehicle.last_location.latitude}, {vehicle.last_location.longitude}
                            </p>
                            <p className="mt-1 text-xs text-white/30">{vehicle.last_location.recorded_at}</p>
                        </div>
                    )}
                </div>

                {vehicle.notes && (
                    <div className="rounded-xl border p-5" style={{ borderColor: 'rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)' }}>
                        <h2 className="mb-2 text-xs font-semibold uppercase tracking-widest text-white/40">Notas</h2>
                        <p className="text-sm text-white/70">{vehicle.notes}</p>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
