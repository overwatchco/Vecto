import { Head, Link, router, usePage } from '@inertiajs/react';
import { PencilLine, Plus, Trash2, Users } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

type UserRow = {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    position: string | null;
    role: string;
    role_label: string;
    created_at: string;
};

type Props = { users: UserRow[] };

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Usuarios', href: '/users' },
];

export default function UsersIndex({ users }: Props) {
    const { props } = usePage<{ flash?: { success?: string } }>();
    const [deleteTarget, setDeleteTarget] = useState<UserRow | null>(null);

    function confirmDelete() {
        if (!deleteTarget) return;
        router.delete(`/users/${deleteTarget.id}`, { preserveScroll: true });
        setDeleteTarget(null);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Usuarios" />

            <div className="flex flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-lg bg-[#FFC107]/10">
                            <Users className="size-5 text-[#FFC107]" />
                        </div>
                        <div>
                            <h1 className="text-xl font-semibold">Usuarios</h1>
                            <p className="text-sm text-muted-foreground">
                                {users.length} usuario{users.length !== 1 ? 's' : ''} en tu empresa
                            </p>
                        </div>
                    </div>
                    <Button asChild className="bg-[#FFC107] font-semibold text-black hover:bg-[#E6AC00]">
                        <Link href="/users/create">
                            <Plus className="mr-1.5 size-4" />
                            Nuevo usuario
                        </Link>
                    </Button>
                </div>

                {/* Flash */}
                {props.flash?.success && (
                    <div className="rounded-md border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-400">
                        {props.flash.success}
                    </div>
                )}

                {/* Table */}
                <div className="overflow-hidden rounded-xl border border-sidebar-border">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-sidebar-border bg-sidebar-accent/50 text-xs uppercase tracking-wider text-muted-foreground">
                                <th className="px-5 py-3 text-left font-medium">Usuario</th>
                                <th className="hidden px-5 py-3 text-left font-medium md:table-cell">Contacto</th>
                                <th className="hidden px-5 py-3 text-left font-medium lg:table-cell">Cargo</th>
                                <th className="px-5 py-3 text-left font-medium">Rol</th>
                                <th className="hidden px-5 py-3 text-left font-medium sm:table-cell">Creado</th>
                                <th className="px-5 py-3 text-right font-medium">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-sidebar-border">
                            {users.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="py-12 text-center text-muted-foreground">
                                        No hay usuarios registrados todavía.
                                    </td>
                                </tr>
                            )}
                            {users.map((user) => (
                                <tr key={user.id} className="transition-colors hover:bg-sidebar-accent/30">
                                    <td className="px-5 py-3.5">
                                        <div>
                                            <p className="font-medium">{user.name}</p>
                                            <p className="text-xs text-muted-foreground">{user.email}</p>
                                        </div>
                                    </td>
                                    <td className="hidden px-5 py-3.5 text-muted-foreground md:table-cell">
                                        {user.phone ?? '—'}
                                    </td>
                                    <td className="hidden px-5 py-3.5 text-muted-foreground lg:table-cell">
                                        {user.position ?? '—'}
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <Badge
                                            variant={user.role === 'admin' ? 'default' : 'secondary'}
                                            className={
                                                user.role === 'admin'
                                                    ? 'bg-[#FFC107]/15 text-[#FFC107] hover:bg-[#FFC107]/20'
                                                    : ''
                                            }
                                        >
                                            {user.role_label}
                                        </Badge>
                                    </td>
                                    <td className="hidden px-5 py-3.5 text-muted-foreground sm:table-cell">
                                        {user.created_at}
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <div className="flex items-center justify-end gap-1">
                                            <Button variant="ghost" size="icon" className="size-8" asChild>
                                                <Link href={`/users/${user.id}/edit`}>
                                                    <PencilLine className="size-3.5" />
                                                </Link>
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="size-8 text-destructive hover:text-destructive"
                                                onClick={() => setDeleteTarget(user)}
                                            >
                                                <Trash2 className="size-3.5" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Delete confirmation dialog */}
            <Dialog open={deleteTarget !== null} onOpenChange={(open) => !open && setDeleteTarget(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>¿Eliminar usuario?</DialogTitle>
                        <DialogDescription>
                            Estás a punto de eliminar a <strong>{deleteTarget?.name}</strong>. Esta acción no se puede deshacer y el usuario perderá el acceso a la plataforma.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteTarget(null)}>
                            Cancelar
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={confirmDelete}
                        >
                            Eliminar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
