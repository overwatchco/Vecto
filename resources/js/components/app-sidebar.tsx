import { Link, usePage } from '@inertiajs/react';
import {
    BarChart3,
    Building2,
    Car,
    ClipboardCheck,
    DollarSign,
    FileText,
    LayoutGrid,
    MapPin,
    Package,
    Shield,
    TrendingUp,
    Users,
    Wrench,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import type { Auth, NavItem } from '@/types';

export function AppSidebar() {
    const { auth } = usePage().props as { auth: Auth };
    const role = auth?.user?.role;

    const isAdmin     = role === 'company_admin' || role === 'superadmin';
    const isSuperAdmin = role === 'superadmin';

    const fleetNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: '/dashboard',
            icon: LayoutGrid,
        },
        {
            title: 'Vehículos',
            href: '/fleet/vehicles',
            icon: Car,
        },
        {
            title: 'Mapa en Vivo',
            href: '/fleet/map',
            icon: MapPin,
        },
        {
            title: 'Preoperacional',
            href: '/fleet/preoperational',
            icon: ClipboardCheck,
        },
    ];

    const adminNavItems: NavItem[] = isAdmin
        ? [
              {
                  title: 'Mantenimientos',
                  href: '/fleet/maintenances',
                  icon: Wrench,
              },
              {
                  title: 'Materiales',
                  href: '/fleet/materials',
                  icon: Package,
              },
              {
                  title: 'Costos',
                  href: '/fleet/costs',
                  icon: DollarSign,
              },
              {
                  title: 'Ingresos',
                  href: '/fleet/revenues',
                  icon: TrendingUp,
              },
              {
                  title: 'Contratos',
                  href: '/fleet/contracts',
                  icon: FileText,
              },
              {
                  title: 'Bases',
                  href: '/fleet/bases',
                  icon: Building2,
              },
              {
                  title: 'Usuarios',
                  href: '/users',
                  icon: Users,
              },
          ]
        : [];

    const superadminNavItems: NavItem[] = isSuperAdmin
        ? [
              {
                  title: 'Panel Global',
                  href: '/admin/dashboard',
                  icon: Shield,
              },
              {
                  title: 'Analytics',
                  href: '/admin/dashboard',
                  icon: BarChart3,
              },
          ]
        : [];

    const mainNavItems: NavItem[] = [
        ...fleetNavItems,
        ...adminNavItems,
        ...superadminNavItems,
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={[]} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
