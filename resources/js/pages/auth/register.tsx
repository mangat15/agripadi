import { login } from '@/routes';
import { store } from '@/routes/register';
import { Form, Head } from '@inertiajs/react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AgripadiAuthLayout from '@/layouts/auth/agripadi-auth-layout';
import { User, Mail, Lock } from 'lucide-react';

export default function Register() {
    return (
        <AgripadiAuthLayout
            title="Cipta Akaun Baru"
            description="Daftar sebagai petani untuk mula belajar"
        >
            <Head title="Daftar" />
            <Form
                {...store.form()}
                resetOnSuccess={['password', 'password_confirmation']}
                disableWhileProcessing
                className="space-y-4"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="name" className="text-gray-700">Nama Penuh</Label>
                                <div className="relative mt-1">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <User className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <Input
                                        id="name"
                                        type="text"
                                        required
                                        autoFocus
                                        tabIndex={1}
                                        autoComplete="name"
                                        name="name"
                                        placeholder="Ahmad bin Abdullah"
                                        className="pl-10"
                                    />
                                </div>
                                <InputError message={errors.name} />
                            </div>

                            <div>
                                <Label htmlFor="email" className="text-gray-700">Alamat E-mel</Label>
                                <div className="relative mt-1">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <Mail className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <Input
                                        id="email"
                                        type="email"
                                        required
                                        tabIndex={2}
                                        autoComplete="email"
                                        name="email"
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
                                        required
                                        tabIndex={3}
                                        autoComplete="new-password"
                                        name="password"
                                        placeholder="••••••••"
                                        className="pl-10"
                                    />
                                </div>
                                <InputError message={errors.password} />
                            </div>

                            <div>
                                <Label htmlFor="password_confirmation" className="text-gray-700">
                                    Sahkan Kata Laluan
                                </Label>
                                <div className="relative mt-1">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <Input
                                        id="password_confirmation"
                                        type="password"
                                        required
                                        tabIndex={4}
                                        autoComplete="new-password"
                                        name="password_confirmation"
                                        placeholder="••••••••"
                                        className="pl-10"
                                    />
                                </div>
                                <InputError message={errors.password_confirmation} />
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-green-600 hover:bg-green-700 text-white py-6 text-base font-medium mt-2"
                                tabIndex={5}
                                data-test="register-user-button"
                            >
                                {processing && <Spinner />}
                                Daftar Sekarang →
                            </Button>
                        </div>

                        <div className="text-center text-sm text-gray-600 mt-4">
                            Sudah mempunyai akaun?{' '}
                            <TextLink href={login()} tabIndex={6} className="text-green-600 hover:text-green-700 font-medium">
                                Log masuk
                            </TextLink>
                        </div>
                    </>
                )}
            </Form>
        </AgripadiAuthLayout>
    );
}