import { Head, useForm, router } from '@inertiajs/react';
import { ClipboardCheck, Plus, Trash2 } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Preoperacional', href: '/fleet/preoperational' },
    { title: 'Configurar checklist', href: '/fleet/preoperational-items' },
];

const inputClass = 'h-9 rounded-lg border border-white/10 bg-white/[0.04] px-3 text-sm text-white placeholder:text-white/25 focus-visible:border-[#FFC107] focus-visible:outline-none';
const labelClass = 'text-[11px] font-semibold uppercase tracking-widest text-white/40';

type Item = { id: number; category: string; name: string; is_required: boolean; sort_order: number; is_active: boolean };

const DEFAULT_CATEGORIES = ['Frenos', 'Luces', 'Llantas', 'Motor', 'Fluidos', 'Documentos', 'Carrocería', 'Seguridad'];

export default function PreoperationalItems({ items }: { items: Item[] }) {
    const { data, setData, post, processing, reset } = useForm({
        category:    DEFAULT_CATEGORIES[0],
        name:        '',
        is_required: true,
        sort_order:  0,
    });

    const grouped = items.reduce((acc, item) => {
        if (!acc[item.category]) acc[item.category] = [];
        acc[item.category].push(item);
        return acc;
    }, {} as Record<string, Item[]>);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post('/fleet/preoperational-items', { onSuccess: () => reset() });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Checklist Preoperacional — VECTO" />

            <div className="flex flex-col gap-6 p-4 md:p-6">
                <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg" style={{ background: 'rgba(255,193,7,0.12)' }}>
                        <ClipboardCheck size={20} style={{ color: '#FFC107' }} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black uppercase tracking-tight text-white" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                            Configurar Checklist
                        </h1>
                        <p className="text-xs text-white/40">{items.length} ítems configurados</p>
                    </div>
                </div>

                {/* Add new item */}
                <div className="rounded-xl border p-5" style={{ borderColor: 'rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)' }}>
                    <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-white/40">Agregar Ítem al Checklist</h2>
                    <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-4">
                        <div className="flex flex-col gap-1.5">
                            <Label className={labelClass}>Categoría *</Label>
                            <select
                                value={data.category}
                                onChange={e => setData('category', e.target.value)}
                                className="h-9 w-full rounded-lg border border-white/10 bg-zinc-900 px-3 text-sm text-white focus:border-[#FFC107] focus:outline-none"
                            >
                                {DEFAULT_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                <option value="Otro">Otro</option>
                            </select>
                        </div>
                        <div className="flex flex-col gap-1.5 sm:col-span-2">
                            <Label className={labelClass}>Nombre del ítem *</Label>
                            <Input className={inputClass} value={data.name} onChange={e => setData('name', e.target.value)} placeholder="Funcionamiento de frenos, Presión de llantas…" required />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <Label className={labelClass}>¿Requerido?</Label>
                            <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 h-9">
                                <input
                                    type="checkbox"
                                    id="is_required"
                                    checked={data.is_required}
                                    onChange={e => setData('is_required', e.target.checked)}
                                    className="accent-[#FFC107]"
                                />
                                <label htmlFor="is_required" className="text-xs text-white/60 cursor-pointer">Sí</label>
                            </div>
                        </div>
                        <div className="flex items-end sm:col-span-4">
                            <Button type="submit" disabled={processing} className="bg-[#FFC107] font-bold text-black hover:bg-[#E6AC00]">
                                <Plus size={14} className="mr-1.5" />
                                {processing ? 'Agregando…' : 'Agregar ítem'}
                            </Button>
                        </div>
                    </form>
                </div>

                {/* Items grouped by category */}
                {Object.keys(grouped).length === 0 ? (
                    <div className="rounded-xl border p-10 text-center text-sm text-white/30" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                        No hay ítems configurados. Agrega los primeros usando el formulario de arriba.
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        {Object.entries(grouped).map(([category, catItems]) => (
                            <div key={category} className="rounded-xl border" style={{ borderColor: 'rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)' }}>
                                <div className="border-b px-5 py-3" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                                    <h3 className="text-xs font-bold uppercase tracking-widest text-white/50">{category}</h3>
                                </div>
                                <div className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
                                    {catItems.map(item => (
                                        <div key={item.id} className="flex items-center justify-between px-5 py-2.5">
                                            <div className="flex items-center gap-3">
                                                <span className="text-sm text-white">{item.name}</span>
                                                {item.is_required && (
                                                    <span className="text-[10px] text-red-400/70 border border-red-500/20 rounded-full px-1.5 py-0.5">Requerido</span>
                                                )}
                                            </div>
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="size-7 text-white/30 hover:text-red-400"
                                                onClick={() => {
                                                    if (confirm('¿Eliminar este ítem del checklist?')) {
                                                        router.delete(`/fleet/preoperational-items/${item.id}`);
                                                    }
                                                }}
                                            >
                                                <Trash2 size={12} />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
