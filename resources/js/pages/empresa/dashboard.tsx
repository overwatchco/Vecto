import { Head, Link, usePage } from '@inertiajs/react';
import { BarChart3, Building2, Car, ClipboardCheck, DollarSign, FileText, Package, TrendingUp, Users, Wrench } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import type { Auth, BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Panel de Empresa', href: '/empresa/dashboard' }];

const MODULES = [
    { title: 'Flota',            href: '/fleet/vehicles',         icon: Car,           desc: 'Gestiona todos tus vehículos' },
    { title: 'Mantenimientos',   href: '/fleet/maintenances',     icon: Wrench,        desc: 'Preventivos y correctivos' },
    { title: 'Mapa en Vivo',     href: '/fleet/map',              icon: BarChart3,     desc: 'Localización en tiempo real' },
    { title: 'Preoperacional',   href: '/fleet/preoperational',   icon: ClipboardCheck,desc: 'Inspecciones de vehículos' },
    { title: 'Materiales',       href: '/fleet/materials',        icon: Package,       desc: 'Inventario de repuestos' },
    { title: 'Costos',           href: '/fleet/costs',            icon: DollarSign,    desc: 'Control de gastos por flota' },
    { title: 'Ingresos',         href: '/fleet/revenues',         icon: TrendingUp,    desc: 'Ingresos por vehículo' },
    { title: 'Contratos',        href: '/fleet/contracts',        icon: FileText,      desc: 'Clientes y servicios' },
    { title: 'Bases',            href: '/fleet/bases',            icon: Building2,     desc: 'Sedes operativas' },
    { title: 'Usuarios',         href: '/users',                  icon: Users,         desc: 'Administra tu equipo' },
];

export default function EmpresaDashboard() {
    const { auth } = usePage().props as { auth: Auth };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Panel de Empresa — VECTO" />

            <div className="flex flex-col gap-6 p-4 md:p-6">
                <div>
                    <h1
                        className="text-3xl font-black uppercase tracking-tight text-white"
                        style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                    >
                        Panel de Empresa
                    </h1>
                    <p className="mt-1 text-sm text-white/40">
                        {auth.user.name} · Administrador
                    </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {MODULES.map(({ title, href, icon: Icon, desc }) => (
                        <Link
                            key={href}
                            href={href}
                            className="group rounded-xl border p-5 transition-all hover:border-[#FFC107]/30 hover:bg-[#FFC107]/5"
                            style={{ borderColor: 'rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)' }}
                        >
                            <div
                                className="mb-3 flex size-10 items-center justify-center rounded-lg transition-colors group-hover:bg-[#FFC107]/15"
                                style={{ background: 'rgba(255,255,255,0.05)' }}
                            >
                                <Icon size={18} className="text-white/50 group-hover:text-[#FFC107] transition-colors" />
                            </div>
                            <p className="font-bold text-white group-hover:text-[#FFC107] transition-colors">{title}</p>
                            <p className="mt-0.5 text-xs text-white/40">{desc}</p>
                        </Link>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
