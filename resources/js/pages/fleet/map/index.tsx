import { Head } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import { MapPin, RefreshCw } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Mapa en Vivo', href: '/fleet/map' },
];

type VehicleMarker = {
    id: number;
    plate: string;
    brand: string;
    model: string;
    status: string;
    location: {
        lat: number;
        lng: number;
        address: string | null;
        speed: number | null;
        recorded_at: string;
    } | null;
};

const STATUS_COLORS: Record<string, string> = {
    active:      '#22c55e',
    inactive:    '#6b7280',
    maintenance: '#FFC107',
};

/** Load a script from CDN once, returns a promise that resolves when loaded. */
function loadScript(src: string, id: string): Promise<void> {
    return new Promise((resolve, reject) => {
        if (document.getElementById(id)) { resolve(); return; }
        const s = document.createElement('script');
        s.id  = id;
        s.src = src;
        s.onload  = () => resolve();
        s.onerror = reject;
        document.head.appendChild(s);
    });
}

function loadLeafletCSS() {
    if (document.getElementById('leaflet-css')) return;
    const link      = document.createElement('link');
    link.id        = 'leaflet-css';
    link.rel       = 'stylesheet';
    link.href      = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);
}

export default function MapIndex({ company }: { company?: { id: number; name: string } | null }) {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapRef          = useRef<any>(null);
    const markersRef      = useRef<Map<number, any>>(new Map());

    const [vehicles, setVehicles]     = useState<VehicleMarker[]>([]);
    const [loading, setLoading]       = useState(false);
    const [filter, setFilter]         = useState<string>('all');
    const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

    async function fetchLocations(): Promise<VehicleMarker[]> {
        setLoading(true);
        try {
            const params = filter !== 'all' ? `?status=${filter}` : '';
            const res    = await fetch(`/fleet/map/locations${params}`, {
                headers: { Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
            });
            const data: VehicleMarker[] = await res.json();
            setVehicles(data);
            setLastUpdate(new Date());
            return data;
        } catch (err) {
            console.error('Error fetching locations', err);
            return [];
        } finally {
            setLoading(false);
        }
    }

    function buildMarkers(L: any, data: VehicleMarker[]) {
        if (!mapRef.current) return;
        const map = mapRef.current;

        markersRef.current.forEach(m => map.removeLayer(m));
        markersRef.current.clear();

        const withLoc = data.filter(v => v.location);
        withLoc.forEach(v => {
            const color = STATUS_COLORS[v.status] ?? '#9ca3af';
            const icon = L.divIcon({
                className: '',
                html: `<div style="width:30px;height:30px;border-radius:50%;background:${color}22;border:2px solid ${color};display:flex;align-items:center;justify-content:center;">
                    <svg xmlns='http://www.w3.org/2000/svg' width='14' height='14' fill='none' stroke='${color}' stroke-width='2' viewBox='0 0 24 24'>
                        <rect x='1' y='3' width='15' height='13' rx='2'/><path d='m16 8 5 0 2 5-7 0'/><circle cx='5.5' cy='18.5' r='2.5'/><circle cx='18.5' cy='18.5' r='2.5'/>
                    </svg>
                </div>`,
                iconSize: [30, 30], iconAnchor: [15, 15],
            });
            const marker = L.marker([v.location!.lat, v.location!.lng], { icon })
                .bindPopup(`
                    <div style="font-family:Inter,sans-serif;min-width:150px;">
                        <div style="font-weight:bold;color:#FFC107;font-size:14px;">${v.plate}</div>
                        <div style="color:#ccc;font-size:12px;">${v.brand} ${v.model}</div>
                        ${v.location!.address ? `<div style="color:#999;font-size:11px;margin-top:3px;">${v.location!.address}</div>` : ''}
                        ${v.location!.speed != null ? `<div style="color:#aaa;font-size:11px;">Velocidad: ${v.location!.speed} km/h</div>` : ''}
                        <div style="color:#555;font-size:10px;margin-top:3px;">${v.location!.recorded_at}</div>
                    </div>
                `)
                .addTo(map);
            markersRef.current.set(v.id, marker);
        });

        if (withLoc.length > 0) {
            const bounds = L.latLngBounds(withLoc.map(v => [v.location!.lat, v.location!.lng]));
            map.fitBounds(bounds, { padding: [40, 40] });
        }
    }

    useEffect(() => {
        if (mapRef.current || !mapContainerRef.current) return;

        loadLeafletCSS();
        loadScript('https://unpkg.com/leaflet@1.9.4/dist/leaflet.js', 'leaflet-js').then(() => {
            const L = (window as any).L;
            if (!L || !mapContainerRef.current || mapRef.current) return;

            const map = L.map(mapContainerRef.current, { center: [4.711, -74.0721], zoom: 11 });
            L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
                attribution: '©OpenStreetMap ©Carto', subdomains: 'abcd', maxZoom: 19,
            }).addTo(map);
            mapRef.current = map;

            fetchLocations().then(data => buildMarkers(L, data));
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function refresh() {
        const data = await fetchLocations();
        const L    = (window as any).L;
        if (L && mapRef.current) buildMarkers(L, data);
    }

    const withLocation = vehicles.filter(v => v.location).length;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Mapa en Vivo — VECTO" />

            <div className="flex h-[calc(100vh-7rem)] flex-col gap-4 p-4 md:p-6">
                {/* Controls */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-lg" style={{ background: 'rgba(255,193,7,0.12)' }}>
                            <MapPin size={20} style={{ color: '#FFC107' }} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black uppercase tracking-tight text-white" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                                Mapa en Vivo
                            </h1>
                            <p className="text-xs text-white/40">
                                {withLocation} vehículos con ubicación
                                {lastUpdate && ` · ${lastUpdate.toLocaleTimeString('es-CO')}`}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {['all', 'active', 'maintenance'].map(s => (
                            <button
                                key={s}
                                onClick={() => setFilter(s)}
                                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                                    filter === s
                                        ? 'bg-[#FFC107] text-black'
                                        : 'border border-white/10 text-white/50 hover:border-white/20 hover:text-white'
                                }`}
                            >
                                {s === 'all' ? 'Todos' : s === 'active' ? 'Activos' : 'Mantenimiento'}
                            </button>
                        ))}
                        <Button
                            size="icon" variant="ghost"
                            onClick={refresh}
                            disabled={loading}
                            className="size-9 border border-white/10 text-white/50 hover:text-white"
                        >
                            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                        </Button>
                    </div>
                </div>

                {/* Map */}
                <div
                    ref={mapContainerRef}
                    className="flex-1 rounded-xl border overflow-hidden"
                    style={{ borderColor: 'rgba(255,255,255,0.08)', minHeight: '300px' }}
                />

                {/* Vehicle chips */}
                {vehicles.length > 0 && (
                    <div className="flex gap-2 overflow-x-auto pb-1 shrink-0">
                        {vehicles.slice(0, 12).map(v => (
                            <div
                                key={v.id}
                                className="flex shrink-0 cursor-pointer items-center gap-2 rounded-lg border px-3 py-1.5 text-xs transition-colors hover:border-[#FFC107]/40"
                                style={{ borderColor: 'rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)' }}
                                onClick={() => {
                                    if (!v.location || !mapRef.current) return;
                                    const L = (window as any).L;
                                    if (L) mapRef.current.setView([v.location.lat, v.location.lng], 15);
                                    markersRef.current.get(v.id)?.openPopup();
                                }}
                            >
                                <div className="size-2 rounded-full" style={{ background: STATUS_COLORS[v.status] ?? '#6b7280' }} />
                                <span className="font-mono font-bold text-[#FFC107]">{v.plate}</span>
                                <span className="text-white/40">{v.brand} {v.model}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
