import { Head, useForm } from '@inertiajs/react';
import { Building2, Car, Plus, Trash2, User } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { BreadcrumbItem } from '@/types';

type Option = { value: number; label: string };
type BaseVehicle = { id: number; plate: string; brand: string; model: string; status: string };
type BaseOperator = { id: number; name: string; position: string | null };
type Base = {
    id: number;
    name: string;
    address: string | null;
    capacity: number;
    is_active: boolean;
    vehicles: BaseVehicle[];
    operators: BaseOperator[];
};

export default function BaseShow({
    base,
    available_vehicles,
    available_operators,
}: {
    base: Base;
    available_vehicles: Option[];
    available_operators: Option[];
}) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Bases', href: '/fleet/bases' },
        { title: base.name, href: `/fleet/bases/${base.id}` },
    ];

    const vehicleForm   = useForm({ vehicle_id: '', assigned_at: new Date().toISOString().split('T')[0] });
    const operatorForm  = useForm({ user_id: '', assigned_at: new Date().toISOString().split('T')[0] });

    const inputClass = 'h-10 rounded-lg border border-white/10 bg-white/[0.04] px-3 text-sm text-white placeholder:text-white/25 focus-visible:border-[#FFC107] focus-visible:outline-none';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${base.name} — VECTO`} />

            <div className="flex flex-col gap-6 p-4 md:p-6">
                <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg" style={{ background: 'rgba(255,193,7,0.12)' }}>
                        <Building2 size={20} style={{ color: '#FFC107' }} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black uppercase tracking-tight text-white" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                            {base.name}
                        </h1>
                        {base.address && <p className="text-xs text-white/40">{base.address}</p>}
                    </div>
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                    {/* Vehicles section */}
                    <div className="flex flex-col gap-3">
                        <div className="rounded-xl border p-4" style={{ borderColor: 'rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)' }}>
                            <h2 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-white/40">
                                <Car size={12} /> Asignar Vehículo
                            </h2>
                            <form onSubmit={(e) => { e.preventDefault(); vehicleForm.post(`/fleet/bases/${base.id}/vehicles`, { onSuccess: () => vehicleForm.reset() }); }} className="flex flex-col gap-2">
                                <Select value={String(vehicleForm.data.vehicle_id)} onValueChange={v => vehicleForm.setData('vehicle_id', v)}>
                                    <SelectTrigger className={inputClass}><SelectValue placeholder="Seleccionar vehículo" /></SelectTrigger>
                                    <SelectContent>
                                        {available_vehicles.map(v => <SelectItem key={v.value} value={String(v.value)}>{v.label}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                <Input className={inputClass} type="date" value={vehicleForm.data.assigned_at} onChange={e => vehicleForm.setData('assigned_at', e.target.value)} />
                                <Button type="submit" disabled={vehicleForm.processing || !vehicleForm.data.vehicle_id} className="bg-[#FFC107] text-sm font-bold text-black hover:bg-[#E6AC00]">
                                    <Plus size={14} className="mr-1.5" />Asignar
                                </Button>
                            </form>
                        </div>

                        <div className="rounded-xl border" style={{ borderColor: 'rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)' }}>
                            <div className="border-b px-4 py-3" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                                <h2 className="text-xs font-semibold uppercase tracking-widest text-white/40">
                                    Vehículos en esta base ({base.vehicles.length}{base.capacity > 0 ? `/${base.capacity}` : ''})
                                </h2>
                            </div>
                            {base.vehicles.length === 0 ? (
                                <p className="p-4 text-xs text-white/30">Sin vehículos asignados.</p>
                            ) : (
                                base.vehicles.map(v => (
                                    <div key={v.id} className="flex items-center justify-between border-b px-4 py-2.5" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
                                        <div>
                                            <span className="font-mono text-sm font-bold text-[#FFC107]">{v.plate}</span>
                                            <span className="ml-2 text-xs text-white/60">{v.brand} {v.model}</span>
                                        </div>
                                        <Button
                                            size="icon" variant="ghost"
                                            className="size-7 text-white/30 hover:text-red-400"
                                            onClick={() => { if (confirm('¿Quitar vehículo de la base?')) vehicleForm.delete(`/fleet/bases/${base.id}/vehicles/${v.id}`); }}
                                        >
                                            <Trash2 size={12} />
                                        </Button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Operators section */}
                    <div className="flex flex-col gap-3">
                        <div className="rounded-xl border p-4" style={{ borderColor: 'rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)' }}>
                            <h2 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-white/40">
                                <User size={12} /> Asignar Operador
                            </h2>
                            <form onSubmit={(e) => { e.preventDefault(); operatorForm.post(`/fleet/bases/${base.id}/operators`, { onSuccess: () => operatorForm.reset() }); }} className="flex flex-col gap-2">
                                <Select value={String(operatorForm.data.user_id)} onValueChange={v => operatorForm.setData('user_id', v)}>
                                    <SelectTrigger className={inputClass}><SelectValue placeholder="Seleccionar operador" /></SelectTrigger>
                                    <SelectContent>
                                        {available_operators.map(o => <SelectItem key={o.value} value={String(o.value)}>{o.label}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                <Input className={inputClass} type="date" value={operatorForm.data.assigned_at} onChange={e => operatorForm.setData('assigned_at', e.target.value)} />
                                <Button type="submit" disabled={operatorForm.processing || !operatorForm.data.user_id} className="bg-[#FFC107] text-sm font-bold text-black hover:bg-[#E6AC00]">
                                    <Plus size={14} className="mr-1.5" />Asignar
                                </Button>
                            </form>
                        </div>

                        <div className="rounded-xl border" style={{ borderColor: 'rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)' }}>
                            <div className="border-b px-4 py-3" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                                <h2 className="text-xs font-semibold uppercase tracking-widest text-white/40">
                                    Operadores en esta base ({base.operators.length})
                                </h2>
                            </div>
                            {base.operators.length === 0 ? (
                                <p className="p-4 text-xs text-white/30">Sin operadores asignados.</p>
                            ) : (
                                base.operators.map(o => (
                                    <div key={o.id} className="flex items-center justify-between border-b px-4 py-2.5" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
                                        <div>
                                            <span className="text-sm text-white">{o.name}</span>
                                            {o.position && <span className="ml-2 text-xs text-white/40">{o.position}</span>}
                                        </div>
                                        <Button
                                            size="icon" variant="ghost"
                                            className="size-7 text-white/30 hover:text-red-400"
                                            onClick={() => { if (confirm('¿Quitar operador de la base?')) operatorForm.delete(`/fleet/bases/${base.id}/operators/${o.id}`); }}
                                        >
                                            <Trash2 size={12} />
                                        </Button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
