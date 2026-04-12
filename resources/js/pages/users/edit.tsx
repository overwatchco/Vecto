import { Head, useForm } from '@inertiajs/react';
import { ArrowLeft, UserCog } from 'lucide-react';
import { FormEventHandler } from 'react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

type RoleOption = { value: string; label: string };
type UserData = {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    position: string | null;
    role: string;
};
type Props = { user: UserData; roles: RoleOption[] };

export default function UserEdit({ user, roles }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Usuarios', href: '/users' },
        { title: user.name, href: `/users/${user.id}/edit` },
    ];

    const { data, setData, put, processing, errors } = useForm({
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone ?? '',
        position: user.position ?? '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(`/users/${user.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Editar — ${user.name}`} />

            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" className="size-9" asChild>
                        <a href="/users">
                            <ArrowLeft className="size-4" />
                        </a>
                    </Button>
                    <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-lg bg-[#FFC107]/10">
                            <UserCog className="size-5 text-[#FFC107]" />
                        </div>
                        <div>
                            <h1 className="text-xl font-semibold">Editar usuario</h1>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                    </div>
                </div>

                <div className="max-w-xl rounded-xl border border-sidebar-border p-6">
                    <form onSubmit={submit} className="flex flex-col gap-5">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Nombre completo</Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                                autoFocus
                            />
                            <InputError message={errors.name} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="email">Correo electrónico</Label>
                            <Input
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                required
                            />
                            <InputError message={errors.email} />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="phone">Teléfono</Label>
                                <Input
                                    id="phone"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    placeholder="+57 300 000 0000"
                                />
                                <InputError message={errors.phone} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="position">Cargo</Label>
                                <Input
                                    id="position"
                                    value={data.position}
                                    onChange={(e) => setData('position', e.target.value)}
                                    placeholder="Ej: Conductor"
                                />
                                <InputError message={errors.position} />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="role">Rol</Label>
                            <Select value={data.role} onValueChange={(v) => setData('role', v)}>
                                <SelectTrigger id="role">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {roles.map((r) => (
                                        <SelectItem key={r.value} value={r.value}>
                                            {r.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={errors.role} />
                        </div>

                        <div className="border-t border-sidebar-border pt-4">
                            <p className="mb-4 text-xs text-muted-foreground">
                                Deja los campos de contraseña en blanco para mantener la actual.
                            </p>
                            <div className="grid gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="password">Nueva contraseña</Label>
                                    <PasswordInput
                                        id="password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        placeholder="Dejar en blanco para no cambiar"
                                    />
                                    <InputError message={errors.password} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="password_confirmation">Confirmar contraseña</Label>
                                    <PasswordInput
                                        id="password_confirmation"
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        placeholder="Repite la nueva contraseña"
                                    />
                                    <InputError message={errors.password_confirmation} />
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 pt-2">
                            <Button
                                type="submit"
                                disabled={processing}
                                className="bg-[#FFC107] font-semibold text-black hover:bg-[#E6AC00]"
                            >
                                Guardar cambios
                            </Button>
                            <Button variant="outline" asChild>
                                <a href="/users">Cancelar</a>
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
