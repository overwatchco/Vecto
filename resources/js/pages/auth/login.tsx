import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';

type Props = {
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;
};

const inputClass =
    'h-11 rounded-lg border border-white/10 bg-white/[0.04] px-3.5 text-sm text-white placeholder:text-white/25 ' +
    'transition-colors focus-visible:border-[#FFC107] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFC107]/20 ' +
    'hover:border-white/20';

export default function Login({ status, canResetPassword, canRegister }: Props) {
    return (
        <AuthLayout
            title="Bienvenido de nuevo"
            description="Ingresa tus credenciales para acceder a tu flota"
        >
            <Head title="Iniciar sesión — VECTO" />

            {status && (
                <div className="mb-5 rounded-lg border border-green-500/20 bg-green-500/8 px-4 py-3 text-center text-sm text-green-400">
                    {status}
                </div>
            )}

            <Form
                {...store.form()}
                resetOnSuccess={['password']}
                className="flex flex-col gap-4"
            >
                {({ processing, errors }) => (
                    <>
                        {/* Email */}
                        <div className="flex flex-col gap-1.5">
                            <Label
                                htmlFor="email"
                                className="text-[11px] font-semibold uppercase tracking-widest text-white/40"
                            >
                                Correo electrónico
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                name="email"
                                required
                                autoFocus
                                tabIndex={1}
                                autoComplete="email"
                                placeholder="tu@empresa.com"
                                className={inputClass}
                            />
                            <InputError message={errors.email} className="text-xs" />
                        </div>

                        {/* Password */}
                        <div className="flex flex-col gap-1.5">
                            <div className="flex items-center justify-between">
                                <Label
                                    htmlFor="password"
                                    className="text-[11px] font-semibold uppercase tracking-widest text-white/40"
                                >
                                    Contraseña
                                </Label>
                                {canResetPassword && (
                                    <TextLink
                                        href={request()}
                                        tabIndex={5}
                                        className="text-xs text-white/35 transition-colors hover:text-[#FFC107]"
                                    >
                                        ¿Olvidaste tu contraseña?
                                    </TextLink>
                                )}
                            </div>
                            <PasswordInput
                                id="password"
                                name="password"
                                required
                                tabIndex={2}
                                autoComplete="current-password"
                                placeholder="••••••••"
                                className={inputClass}
                            />
                            <InputError message={errors.password} className="text-xs" />
                        </div>

                        {/* Remember me */}
                        <div className="flex items-center gap-2.5">
                            <Checkbox
                                id="remember"
                                name="remember"
                                tabIndex={3}
                                className="border-white/15 data-[state=checked]:border-[#FFC107] data-[state=checked]:bg-[#FFC107] data-[state=checked]:text-black"
                            />
                            <Label htmlFor="remember" className="cursor-pointer text-sm text-white/45">
                                Recordarme en este dispositivo
                            </Label>
                        </div>

                        {/* Submit */}
                        <Button
                            type="submit"
                            tabIndex={4}
                            disabled={processing}
                            className="mt-2 h-11 w-full rounded-lg bg-[#FFC107] text-sm font-bold text-black transition-all hover:bg-[#E6AC00] hover:shadow-[0_0_24px_rgba(255,193,7,0.3)] disabled:opacity-50"
                        >
                            {processing ? <Spinner className="mr-2 size-4" /> : null}
                            {processing ? 'Ingresando…' : 'Iniciar sesión'}
                        </Button>

                        {/* Divider */}
                        <div className="relative my-1 flex items-center gap-3">
                            <div className="h-px flex-1 bg-white/8" />
                            <span className="text-[11px] text-white/25">o</span>
                            <div className="h-px flex-1 bg-white/8" />
                        </div>

                        {/* Register link */}
                        {canRegister && (
                            <p className="text-center text-sm text-white/30">
                                ¿Primera vez en VECTO?{' '}
                                <TextLink
                                    href={register()}
                                    tabIndex={6}
                                    className="font-semibold text-[#FFC107] transition-colors hover:text-[#E6AC00]"
                                >
                                    Crea una cuenta
                                </TextLink>
                            </p>
                        )}
                    </>
                )}
            </Form>
        </AuthLayout>
    );
}
