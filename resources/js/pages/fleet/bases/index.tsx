import { Head, Link, router } from '@inertiajs/react';
import { Building2, Eye, Plus, Trash2 } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Bases', href: '/fleet/bases' },
];

type Base = {
    id: number;
    name: string;
    address: string | null;
    capacity: number;
    vehicles_count: number;
    operators_count: number;
    occupancy_pct: number;
    is_active: boolean;
};

export default function BasesIndex({ bases }: { bases: Base[] }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Bases Operativas — VECTO" />

            <div className="flex flex-col gap-6 p-4 md:p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-lg" style={{ background: 'rgba(255,193,7,0.12)' }}>
                            <Building2 size={20} style={{ color: '#FFC107' }} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black uppercase tracking-tight text-white" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                                Bases Operativas
                            </h1>
                            <p className="text-xs text-white/40">{bases.length} bases registradas</p>
                        </div>
                    </div>
                    <Button asChild className="bg-[#FFC107] text-black font-bold hover:bg-[#E6AC00]">
                        <Link href="/fleet/bases/create"><Plus size={16} className="mr-1.5" />Nueva base</Link>
                    </Button>
                </div>

                {bases.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-xl border py-16 text-white/30" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                        <Building2 size={40} className="mb-3 opacity-30" />
                        <p className="text-sm">No hay bases operativas registradas.</p>
                    </div>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {bases.map(b => (
                            <div
                                key={b.id}
                                className="rounded-xl border p-5 transition-all hover:border-[#FFC107]/30"
                                style={{ borderColor: 'rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)' }}
                            >
                                <div className="mb-3 flex items-start justify-between">
                                    <div>
                                        <h3 className="font-bold text-white">{b.name}</h3>
                                        {b.address && <p className="mt-0.5 text-xs text-white/40 line-clamp-2">{b.address}</p>}
                                    </div>
                                    <span className={`ml-2 shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${b.is_active ? 'bg-green-500/15 text-green-400' : 'bg-zinc-500/15 text-zinc-400'}`}>
                                        {b.is_active ? 'Activa' : 'Inactiva'}
                                    </span>
                                </div>

                                {/* Occupancy bar */}
                                {b.capacity > 0 && (
                                    <div className="mb-3">
                                        <div className="mb-1 flex justify-between text-[10px] text-white/40">
                                            <span>Ocupación</span>
                                            <span>{b.vehicles_count}/{b.capacity} vehículos ({b.occupancy_pct}%)</span>
                                        </div>
                                        <div className="h-1.5 w-full rounded-full bg-white/10">
                                            <div
                                                className="h-1.5 rounded-full transition-all"
                                                style={{
                                                    width: `${Math.min(b.occupancy_pct, 100)}%`,
                                                    background: b.occupancy_pct >= 90 ? '#ef4444' : b.occupancy_pct >= 70 ? '#FFC107' : '#22c55e',
                                                }}
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-center justify-between text-xs text-white/50">
                                    <span>{b.operators_count} operadores</span>
                                    <div className="flex gap-1">
                                        <Button asChild size="icon" variant="ghost" className="size-7 text-white/40 hover:text-[#FFC107]">
                                            <Link href={`/fleet/bases/${b.id}`}><Eye size={13} /></Link>
                                        </Button>
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            className="size-7 text-white/30 hover:text-red-400"
                                            onClick={() => { if (confirm('¿Eliminar base?')) router.delete(`/fleet/bases/${b.id}`); }}
                                        >
                                            <Trash2 size={13} />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
