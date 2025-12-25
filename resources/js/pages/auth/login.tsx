import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AgripadiAuthLayout from '@/layouts/auth/agripadi-auth-layout';
import { register } from '@/routes';
import { store } from '@/routes/login';
import { Form, Head } from '@inertiajs/react';
import { Mail, Lock } from 'lucide-react';

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;
}

export default function Login({
    status,
    canResetPassword,
    canRegister,
}: LoginProps) {
    return (
        <AgripadiAuthLayout
            title="Log Masuk"
            description="Masukkan alamat e-mel dan kata laluan anda untuk log masuk"
        >
            <Head title="Log Masuk" />

            {status && (
                <div className="mb-4 text-center text-sm font-medium text-green-600">
                    {status}
                </div>
            )}

            <Form
                {...store.form()}
                resetOnSuccess={['password']}
                className="space-y-4"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="email" className="text-gray-700">Alamat E-mel</Label>
                                <div className="relative mt-1">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <Mail className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <Input
                                        id="email"
                                        type="email"
                                        name="email"
                                        required
                                        autoFocus
                                        tabIndex={1}
                                        autoComplete="email"
                                        placeholder="nama@contoh.com"
                                        className="pl-10"
                                    />
                                </div>
                                <InputError message={errors.email} />
                            </div>

                            <div>
                                <Label htmlFor="password" className="text-gray-700">Kata Laluan</Label>
                                <div className="relative mt-1">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <Input
                                        id="password"
                                        type="password"
                                        name="password"
                                        required
                                        tabIndex={2}
                                        autoComplete="current-password"
                                        placeholder="••••••••"
                                        className="pl-10"
                                    />
                                </div>
                                <InputError message={errors.password} />
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-green-600 hover:bg-green-700 text-white py-6 text-base font-medium"
                                tabIndex={3}
                                disabled={processing}
                                data-test="login-button"
                            >
                                {processing && <Spinner />}
                                Log Masuk
                            </Button>
                        </div>

                        {canRegister && (
                            <div className="text-center text-sm text-gray-600 mt-4">
                                Belum mempunyai akaun?{' '}
                                <TextLink href={register()} tabIndex={4} className="text-green-600 hover:text-green-700 font-medium">
                                    Daftar sekarang
                                </TextLink>
                            </div>
                        )}
                    </>
                )}
            </Form>
        </AgripadiAuthLayout>
    );
}