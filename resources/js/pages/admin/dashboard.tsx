import { Head, usePage } from '@inertiajs/react';
import { Building2, Car, Shield, Users } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import type { Auth, BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Panel Global', href: '/admin/dashboard' }];

export default function AdminDashboard() {
    const { auth } = usePage().props as { auth: Auth };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Panel Superadmin — VECTO" />

            <div className="flex flex-col gap-6 p-4 md:p-6">
                <div className="flex items-center gap-3">
                    <div
                        className="flex size-12 items-center justify-center rounded-xl"
                        style={{ background: 'rgba(255,193,7,0.15)', border: '1px solid rgba(255,193,7,0.3)' }}
                    >
                        <Shield size={22} style={{ color: '#FFC107' }} />
                    </div>
                    <div>
                        <h1
                            className="text-3xl font-black uppercase tracking-tight text-white"
                            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                        >
                            Panel Global
                        </h1>
                        <p className="text-sm text-white/40">Superadministrador · {auth.user.name}</p>
                    </div>
                </div>

                <div
                    className="rounded-xl border p-6"
                    style={{
                        background: 'linear-gradient(135deg, #0D2035 0%, rgba(13,32,53,0.6) 100%)',
                        borderColor: 'rgba(255,193,7,0.2)',
                    }}
                >
                    <p
                        className="mb-2 text-xl font-black uppercase text-white"
                        style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                    >
                        Acceso Total al Sistema
                    </p>
                    <p className="text-sm text-white/50">
                        Tienes acceso global a todas las empresas, flotas, vehículos y módulos del sistema.
                        Navega usando el menú lateral para gestionar cualquier entidad.
                    </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                    {[
                        { icon: Building2, label: 'Empresas', desc: 'Gestiona todas las empresas registradas', href: '/fleet/vehicles' },
                        { icon: Car,       label: 'Flota Global', desc: 'Visualiza todos los vehículos del sistema', href: '/fleet/vehicles' },
                        { icon: Users,     label: 'Usuarios',     desc: 'Administra todos los usuarios', href: '/users' },
                    ].map(({ icon: Icon, label, desc, href }) => (
                        <a
                            key={label}
                            href={href}
                            className="rounded-xl border p-5 transition-all hover:border-[#FFC107]/30"
                            style={{ borderColor: 'rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)' }}
                        >
                            <Icon size={20} style={{ color: '#FFC107' }} className="mb-3" />
                            <p className="font-bold text-white">{label}</p>
                            <p className="mt-0.5 text-xs text-white/40">{desc}</p>
                        </a>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
