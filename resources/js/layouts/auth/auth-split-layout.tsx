import { Link } from '@inertiajs/react';
import { CheckCircle2 } from 'lucide-react';
import type { AuthLayoutProps } from '@/types';

const YELLOW = '#FFC107';
const NAVY   = '#0D2035';
const BLACK  = '#000000';

const features = [
    'Rastreo GPS en tiempo real',
    'Mantenimiento predictivo con IA',
    'Control de combustible y eficiencia',
    'Reportes y analytics avanzados',
];

export default function AuthSplitLayout({ children, title, description }: AuthLayoutProps) {
    return (
        /* Force dark-mode CSS variables for ALL shadcn components inside */
        <div
            className="dark grid min-h-svh lg:grid-cols-2"
            style={
                {
                    '--background': '0 0% 0%',
                    '--foreground': '0 0% 98%',
                    '--card': '0 0% 4%',
                    '--card-foreground': '0 0% 98%',
                    '--popover': '0 0% 4%',
                    '--popover-foreground': '0 0% 98%',
                    '--primary': '45 100% 51%',
                    '--primary-foreground': '0 0% 0%',
                    '--secondary': '0 0% 12%',
                    '--secondary-foreground': '0 0% 98%',
                    '--muted': '0 0% 12%',
                    '--muted-foreground': '0 0% 55%',
                    '--accent': '0 0% 12%',
                    '--accent-foreground': '0 0% 98%',
                    '--border': '0 0% 16%',
                    '--input': '0 0% 16%',
                    '--ring': '45 100% 51%',
                } as React.CSSProperties
            }
        >
            {/* ── LEFT PANEL ── */}
            <div
                className="relative hidden flex-col overflow-hidden lg:flex"
                style={{ background: NAVY }}
            >
                {/* Grid texture */}
                <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                        backgroundImage:
                            `linear-gradient(rgba(255,193,7,0.05) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(255,193,7,0.05) 1px, transparent 1px)`,
                        backgroundSize: '52px 52px',
                    }}
                />
                {/* Radial glow bottom-left */}
                <div
                    className="pointer-events-none absolute -bottom-48 -left-48 size-[600px] rounded-full opacity-60"
                    style={{
                        background: `radial-gradient(circle, rgba(255,193,7,0.14) 0%, transparent 65%)`,
                    }}
                />
                {/* Radial glow top-right */}
                <div
                    className="pointer-events-none absolute -right-32 -top-32 size-[400px] rounded-full opacity-40"
                    style={{
                        background: `radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 65%)`,
                    }}
                />

                {/* Logo top */}
                <div className="relative z-10 p-10">
                    <Link href="/">
                        <img
                            src="/images/logos/VECTO-horizontal-amarillo.png"
                            alt="VECTO"
                            className="h-8 w-auto object-contain"
                        />
                    </Link>
                </div>

                {/* Main content — vertically centered */}
                <div className="relative z-10 flex flex-1 flex-col justify-center px-10 pb-10">
                    {/* Badge */}
                    <div
                        className="mb-6 inline-flex w-fit items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-widest"
                        style={{
                            background: 'rgba(255,193,7,0.12)',
                            border: '1px solid rgba(255,193,7,0.25)',
                            color: YELLOW,
                        }}
                    >
                        <span
                            className="size-1.5 animate-pulse rounded-full"
                            style={{ background: YELLOW }}
                        />
                        Plataforma activa
                    </div>

                    {/* Headline */}
                    <h2
                        className="mb-4 leading-none tracking-tight text-white"
                        style={{
                            fontFamily: "'Barlow Condensed', sans-serif",
                            fontSize: 'clamp(40px, 4.5vw, 60px)',
                            fontWeight: 900,
                        }}
                    >
                        GESTIÓN INTELIGENTE
                        <br />
                        <span style={{ color: YELLOW }}>DE FLOTAS</span>
                    </h2>

                    <p className="mb-10 max-w-xs text-sm leading-relaxed text-white/50">
                        Controla, monitorea y optimiza toda tu flota vehicular desde un solo lugar.
                    </p>

                    {/* Feature list */}
                    <ul className="flex flex-col gap-3.5">
                        {features.map((f) => (
                            <li key={f} className="flex items-center gap-3 text-sm text-white/70">
                                <CheckCircle2 className="size-4 shrink-0" style={{ color: YELLOW }} />
                                {f}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Abstract vehicle dots decoration */}
                <div className="pointer-events-none absolute bottom-24 right-10 opacity-20">
                    {[
                        { x: 60, y: 0 }, { x: 120, y: 30 }, { x: 30, y: 60 },
                        { x: 90, y: 80 }, { x: 10, y: 110 }, { x: 140, y: 100 },
                    ].map((dot, i) => (
                        <div
                            key={i}
                            className="absolute size-2 rounded-full"
                            style={{ left: dot.x, top: dot.y, background: YELLOW }}
                        />
                    ))}
                    <svg width="160" height="130" viewBox="0 0 160 130" fill="none" className="absolute inset-0">
                        <path d="M60 0 Q 90 25, 120 30 Q 80 55, 90 80" stroke={YELLOW} strokeWidth="1" strokeDasharray="4 3" fill="none" />
                        <path d="M30 60 Q 60 70, 90 80 Q 110 90, 140 100" stroke={YELLOW} strokeWidth="1" strokeDasharray="4 3" fill="none" />
                        <path d="M10 110 Q 40 95, 60 0" stroke={YELLOW} strokeWidth="0.5" strokeDasharray="3 4" fill="none" />
                    </svg>
                </div>

                {/* Bottom copyright */}
                <p className="relative z-10 px-10 pb-8 text-xs text-white/25">
                    © {new Date().getFullYear()} VECTO® — Todos los derechos reservados.
                </p>
            </div>

            {/* ── RIGHT PANEL ── */}
            <div
                className="flex min-h-svh flex-col items-center justify-center p-6 md:p-10"
                style={{ background: BLACK }}
            >
                <div className="w-full max-w-[360px]">
                    {/* Mobile logo */}
                    <div className="mb-10 flex justify-center lg:hidden">
                        <Link href="/">
                            <img
                                src="/images/logos/VECTO-vertical-amarillo.png"
                                alt="VECTO"
                                className="h-16 w-auto object-contain"
                            />
                        </Link>
                    </div>

                    {/* Title block */}
                    <div className="mb-8">
                        <h1
                            className="mb-1.5 text-2xl font-bold text-white"
                            style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: '0.02em' }}
                        >
                            {title}
                        </h1>
                        <p className="text-sm text-white/40">{description}</p>
                    </div>

                    {children}
                </div>
            </div>
        </div>
    );
}
