import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { login } from '@/routes';
import { store } from '@/routes/register';

const inputClass =
    'h-11 rounded-lg border border-white/10 bg-white/[0.04] px-3.5 text-sm text-white placeholder:text-white/25 ' +
    'transition-colors focus-visible:border-[#FFC107] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFC107]/20 ' +
    'hover:border-white/20';

const labelClass = 'text-[11px] font-semibold uppercase tracking-widest text-white/40';

export default function Register() {
    return (
        <AuthLayout
            title="Crea tu cuenta"
            description="Registra tu empresa y comienza a gestionar tu flota hoy"
        >
            <Head title="Registro — VECTO" />
            <Form
                {...store.form()}
                resetOnSuccess={['password', 'password_confirmation']}
                disableWhileProcessing
                className="flex flex-col gap-4"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="company_name" className={labelClass}>
                                Empresa
                            </Label>
                            <Input
                                id="company_name"
                                type="text"
                                required
                                autoFocus
                                tabIndex={1}
                                name="company_name"
                                placeholder="Transportes del Pacífico S.A.S"
                                className={inputClass}
                            />
                            <InputError message={errors.company_name} className="text-xs" />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="name" className={labelClass}>
                                Nombre completo
                            </Label>
                            <Input
                                id="name"
                                type="text"
                                required
                                tabIndex={2}
                                autoComplete="name"
                                name="name"
                                placeholder="Tu nombre y apellido"
                                className={inputClass}
                            />
                            <InputError message={errors.name} className="text-xs" />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="email" className={labelClass}>
                                Correo electrónico
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                required
                                tabIndex={3}
                                autoComplete="email"
                                name="email"
                                placeholder="tu@empresa.com"
                                className={inputClass}
                            />
                            <InputError message={errors.email} className="text-xs" />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="password" className={labelClass}>
                                    Contraseña
                                </Label>
                                <PasswordInput
                                    id="password"
                                    required
                                    tabIndex={4}
                                    autoComplete="new-password"
                                    name="password"
                                    placeholder="Mín. 8 caracteres"
                                    className={inputClass}
                                />
                                <InputError message={errors.password} className="text-xs" />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="password_confirmation" className={labelClass}>
                                    Confirmar
                                </Label>
                                <PasswordInput
                                    id="password_confirmation"
                                    required
                                    tabIndex={5}
                                    autoComplete="new-password"
                                    name="password_confirmation"
                                    placeholder="Repite"
                                    className={inputClass}
                                />
                                <InputError message={errors.password_confirmation} className="text-xs" />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="mt-2 h-11 w-full rounded-lg bg-[#FFC107] text-sm font-bold text-black transition-all hover:bg-[#E6AC00] hover:shadow-[0_0_24px_rgba(255,193,7,0.3)] disabled:opacity-50"
                            tabIndex={6}
                            disabled={processing}
                        >
                            {processing ? <Spinner className="mr-2 size-4" /> : null}
                            {processing ? 'Creando cuenta…' : 'Crear cuenta gratis'}
                        </Button>

                        <div className="relative my-1 flex items-center gap-3">
                            <div className="h-px flex-1 bg-white/8" />
                            <span className="text-[11px] text-white/25">o</span>
                            <div className="h-px flex-1 bg-white/8" />
                        </div>

                        <p className="text-center text-sm text-white/30">
                            ¿Ya tienes cuenta?{' '}
                            <TextLink
                                href={login()}
                                tabIndex={7}
                                className="font-semibold text-[#FFC107] transition-colors hover:text-[#E6AC00]"
                            >
                                Iniciar sesión
                            </TextLink>
                        </p>
                    </>
                )}
            </Form>
        </AuthLayout>
    );
}
