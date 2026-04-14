import { Head, useForm } from '@inertiajs/react';
import { Car, FileText, Plus, Trash2 } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { BreadcrumbItem } from '@/types';

function fmt(n: number) {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(n);
}

type VehicleOption = { value: number; label: string };
type ContractVehicle = { id: number; plate: string; brand: string; model: string; status: string };

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
    conditions: string | null;
    vehicles: ContractVehicle[];
};

export default function ContractShow({ contract, available_vehicles }: { contract: Contract; available_vehicles: VehicleOption[] }) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Contratos', href: '/fleet/contracts' },
        { title: contract.client, href: `/fleet/contracts/${contract.id}` },
    ];

    const assignForm = useForm({ vehicle_id: '', assigned_at: new Date().toISOString().split('T')[0] });

    function handleAssign(e: React.FormEvent) {
        e.preventDefault();
        assignForm.post(`/fleet/contracts/${contract.id}/vehicles`, {
            onSuccess: () => assignForm.reset(),
        });
    }

    const STATUS_STYLES: Record<string, string> = {
        active:      'bg-green-500/15 text-green-400 border-green-500/20',
        expired:     'bg-zinc-500/15 text-zinc-400 border-zinc-500/20',
        suspended:   'bg-red-500/15 text-red-400 border-red-500/20',
    };

    const inputClass = 'h-10 rounded-lg border border-white/10 bg-white/[0.04] px-3 text-sm text-white placeholder:text-white/25 focus-visible:border-[#FFC107] focus-visible:outline-none';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Contrato ${contract.client} — VECTO`} />

            <div className="flex flex-col gap-6 p-4 md:p-6">
                <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg" style={{ background: 'rgba(255,193,7,0.12)' }}>
                        <FileText size={20} style={{ color: '#FFC107' }} />
                    </div>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-black uppercase tracking-tight text-white" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                                {contract.client}
                            </h1>
                            <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[contract.status]}`}>
                                {contract.status === 'active' ? 'Activo' : contract.status === 'expired' ? 'Vencido' : 'Suspendido'}
                            </span>
                        </div>
                        <p className="text-xs text-white/40">{contract.service_type} · {fmt(contract.rate)}/{contract.rate_unit}</p>
                    </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    {/* Contract details */}
                    <div className="rounded-xl border p-5" style={{ borderColor: 'rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)' }}>
                        <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-white/40">Detalles del Contrato</h2>
                        <dl className="grid grid-cols-2 gap-3 text-sm">
                            {[
                                ['Código', contract.code ?? '—'],
                                ['Servicio', contract.service_type],
                                ['Tarifa', `${fmt(contract.rate)}/${contract.rate_unit}`],
                                ['Inicio', contract.start_date],
                                ['Fin', contract.end_date ?? 'Indefinido'],
                            ].map(([k, v]) => (
                                <div key={k}>
                                    <dt className="text-xs text-white/35">{k}</dt>
                                    <dd className="font-medium text-white">{v}</dd>
                                </div>
                            ))}
                        </dl>
                        {contract.conditions && (
                            <div className="mt-4 border-t pt-4" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                                <dt className="text-xs text-white/35 mb-1">Condiciones</dt>
                                <dd className="text-sm text-white/70">{contract.conditions}</dd>
                            </div>
                        )}
                    </div>

                    {/* Assign vehicle */}
                    <div className="rounded-xl border p-5" style={{ borderColor: 'rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)' }}>
                        <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-white/40">Asignar Vehículo</h2>
                        <form onSubmit={handleAssign} className="flex flex-col gap-3">
                            <Select value={String(assignForm.data.vehicle_id)} onValueChange={v => assignForm.setData('vehicle_id', v)}>
                                <SelectTrigger className={inputClass}><SelectValue placeholder="Seleccionar vehículo" /></SelectTrigger>
                                <SelectContent>
                                    {available_vehicles.map(v => <SelectItem key={v.value} value={String(v.value)}>{v.label}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            <Input className={inputClass} type="date" value={assignForm.data.assigned_at} onChange={e => assignForm.setData('assigned_at', e.target.value)} />
                            <Button type="submit" disabled={assignForm.processing || !assignForm.data.vehicle_id} className="bg-[#FFC107] text-sm font-bold text-black hover:bg-[#E6AC00]">
                                <Plus size={14} className="mr-1.5" />Asignar
                            </Button>
                        </form>
                    </div>
                </div>

                {/* Vehicles assigned */}
                <div className="rounded-xl border" style={{ borderColor: 'rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)' }}>
                    <div className="border-b px-5 py-3" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                        <h2 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-white/40">
                            <Car size={12} /> Vehículos en este contrato ({contract.vehicles.length})
                        </h2>
                    </div>
                    {contract.vehicles.length === 0 ? (
                        <p className="p-5 text-sm text-white/30">Sin vehículos asignados.</p>
                    ) : (
                        <div className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
                            {contract.vehicles.map(v => (
                                <div key={v.id} className="flex items-center justify-between px-5 py-3">
                                    <div>
                                        <span className="font-mono font-bold text-[#FFC107] text-sm">{v.plate}</span>
                                        <span className="ml-2 text-sm text-white/60">{v.brand} {v.model}</span>
                                    </div>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="size-8 text-white/30 hover:text-red-400"
                                        onClick={() => {
                                            if (confirm('¿Quitar vehículo del contrato?')) {
                                                assignForm.delete(`/fleet/contracts/${contract.id}/vehicles/${v.id}`);
                                            }
                                        }}
                                    >
                                        <Trash2 size={13} />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
