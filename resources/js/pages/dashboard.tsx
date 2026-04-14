import { Head, Link, usePage } from '@inertiajs/react';
import { Car, ClipboardCheck, DollarSign, MapPin, TrendingUp, Wrench } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import type { Auth, BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Dashboard', href: '/dashboard' }];

const YELLOW = '#FFC107';
const NAVY   = '#0D2035';

function StatCard({
    icon: Icon,
    label,
    value,
    href,
    accent = false,
}: {
    icon: React.ElementType;
    label: string;
    value?: string | number;
    href?: string;
    accent?: boolean;
}) {
    const card = (
        <div
            className="flex items-center gap-4 rounded-xl border p-5 transition-all hover:shadow-lg"
            style={{
                background: accent ? `rgba(255,193,7,0.08)` : 'rgba(255,255,255,0.03)',
                borderColor: accent ? 'rgba(255,193,7,0.3)' : 'rgba(255,255,255,0.08)',
            }}
        >
            <div
                className="flex size-12 shrink-0 items-center justify-center rounded-lg"
                style={{ background: accent ? 'rgba(255,193,7,0.15)' : 'rgba(255,255,255,0.06)' }}
            >
                <Icon size={22} style={{ color: accent ? YELLOW : '#9ca3af' }} />
            </div>
            <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-white/40">{label}</p>
                {value !== undefined && (
                    <p className="mt-0.5 text-2xl font-bold text-white">{value}</p>
                )}
            </div>
        </div>
    );

    return href ? <Link href={href}>{card}</Link> : card;
}

export default function Dashboard() {
    const { auth } = usePage().props as { auth: Auth };
    const role     = auth.user.role;
    const isAdmin  = role === 'company_admin' || role === 'superadmin';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard — VECTO" />

            <div className="flex flex-col gap-6 p-4 md:p-6">
                {/* Greeting */}
                <div>
                    <h1
                        className="text-3xl font-black uppercase tracking-tight text-white"
                        style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                    >
                        Bienvenido, {auth.user.name.split(' ')[0]}
                    </h1>
                    <p className="mt-1 text-sm text-white/40">
                        {role === 'superadmin' && 'Panel de Superadministrador — acceso global'}
                        {role === 'company_admin' && 'Panel de Administrador — tu flota en un vistazo'}
                        {role === 'operator' && 'Panel de Operador — tu vehículo asignado'}
                    </p>
                </div>

                {/* Quick access grid */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <StatCard icon={Car}           label="Vehículos"      href="/fleet/vehicles"       accent />
                    <StatCard icon={MapPin}         label="Mapa en Vivo"   href="/fleet/map" />
                    <StatCard icon={ClipboardCheck} label="Preoperacional" href="/fleet/preoperational" />
                    {isAdmin && (
                        <>
                            <StatCard icon={Wrench}     label="Mantenimientos" href="/fleet/maintenances" />
                            <StatCard icon={DollarSign}  label="Costos"         href="/fleet/costs" />
                            <StatCard icon={TrendingUp}  label="Ingresos"       href="/fleet/revenues" />
                        </>
                    )}
                </div>

                {/* Info strip */}
                <div
                    className="rounded-xl border p-6"
                    style={{
                        background: `linear-gradient(135deg, ${NAVY} 0%, rgba(13,32,53,0.6) 100%)`,
                        borderColor: 'rgba(255,193,7,0.2)',
                    }}
                >
                    <p
                        className="mb-1 text-xl font-black uppercase text-white"
                        style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                    >
                        VECTO® Fleet Management
                    </p>
                    <p className="text-sm text-white/50">
                        Controla, monitorea y optimiza toda tu flota desde este panel.
                        Navega usando el menú lateral para acceder a cada módulo.
                    </p>
                </div>
            </div>
        </AppLayout>
    );
}
