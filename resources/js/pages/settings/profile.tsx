import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import { send } from '@/routes/verification';
import { type SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { Form, Head, Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { User, Globe, Phone } from 'lucide-react';

import DeleteUser from '@/components/delete-user';
import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import SettingsLayout from '@/layouts/settings/layout';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Profile({
    mustVerifyEmail,
    status,
}: {
    mustVerifyEmail: boolean;
    status?: string;
}) {
    const { auth } = usePage<SharedData>().props;
    const { language, setLanguage, t } = useLanguage();
    const [profilePicturePreview, setProfilePicturePreview] = useState<string | null>(
        auth.user.profile_picture ? `/storage/${auth.user.profile_picture}` : null
    );

    const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfilePicturePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <>
            <Head title="Profile settings" />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall
                        title={t('settings.profile.title')}
                        description={t('settings.profile.description')}
                    />

                    {/* Language Selection */}
                    <div className="grid gap-2 pb-6 border-b">
                        <Label htmlFor="language" className="flex items-center gap-2">
                            <Globe className="h-4 w-4" />
                            {t('settings.profile.language')}
                        </Label>
                        <Select
                            value={language}
                            onValueChange={(value: 'ms' | 'en') => setLanguage(value)}
                        >
                            <SelectTrigger className="w-full max-w-xs">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ms">Bahasa Melayu</SelectItem>
                                <SelectItem value="en">English</SelectItem>
                            </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">
                            {t('settings.profile.languageDescription')}
                        </p>
                    </div>

                    <Form
                        {...ProfileController.update.form()}
                        options={{
                            preserveScroll: true,
                        }}
                        className="space-y-6"
                    >
                        {({ processing, recentlySuccessful, errors }) => (
                            <>
                                {/* Profile Picture Upload */}
                                <div className="grid gap-2">
                                    <Label htmlFor="profile_picture">{t('settings.profile.profilePicture')}</Label>

                                    <div className="flex items-center gap-4">
                                        <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-muted">
                                            {profilePicturePreview ? (
                                                <img
                                                    src={profilePicturePreview}
                                                    alt="Profile"
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <User className="h-10 w-10 text-muted-foreground" />
                                            )}
                                        </div>

                                        <div className="flex-1">
                                            <Input
                                                id="profile_picture"
                                                type="file"
                                                name="profile_picture"
                                                accept="image/*"
                                                onChange={handleProfilePictureChange}
                                                className="cursor-pointer"
                                            />
                                            <p className="mt-1 text-xs text-muted-foreground">
                                                {t('settings.profile.profilePictureNote')}
                                            </p>
                                        </div>
                                    </div>

                                    <InputError
                                        className="mt-2"
                                        message={errors.profile_picture}
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="name">{t('settings.profile.name')}</Label>

                                    <Input
                                        id="name"
                                        className="mt-1 block w-full"
                                        defaultValue={auth.user.name}
                                        name="name"
                                        required
                                        autoComplete="name"
                                        placeholder={t('settings.profile.namePlaceholder')}
                                    />

                                    <InputError
                                        className="mt-2"
                                        message={errors.name}
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="email">{t('settings.profile.email')}</Label>

                                    <Input
                                        id="email"
                                        type="email"
                                        className="mt-1 block w-full"
                                        defaultValue={auth.user.email}
                                        name="email"
                                        required
                                        autoComplete="username"
                                        placeholder={t('settings.profile.emailPlaceholder')}
                                    />

                                    <InputError
                                        className="mt-2"
                                        message={errors.email}
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="phone" className="flex items-center gap-2">
                                        <Phone className="h-4 w-4" />
                                        Nombor Telefon
                                    </Label>

                                    <Input
                                        id="phone"
                                        type="tel"
                                        className="mt-1 block w-full"
                                        defaultValue={auth.user.phone || ''}
                                        name="phone"
                                        required
                                        autoComplete="tel"
                                        placeholder="012-3456789"
                                    />

                                    <InputError
                                        className="mt-2"
                                        message={errors.phone}
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="location">{t('settings.profile.location')}</Label>

                                    <Input
                                        id="location"
                                        className="mt-1 block w-full"
                                        defaultValue={auth.user.location || ''}
                                        name="location"
                                        autoComplete="address-level2"
                                        placeholder={t('settings.profile.locationPlaceholder')}
                                    />

                                    <InputError
                                        className="mt-2"
                                        message={errors.location}
                                    />
                                </div>

                                {mustVerifyEmail &&
                                    auth.user.email_verified_at === null && (
                                        <div>
                                            <p className="-mt-4 text-sm text-muted-foreground">
                                                {t('settings.profile.emailUnverified')}{' '}
                                                <Link
                                                    href={send()}
                                                    as="button"
                                                    className="text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500"
                                                >
                                                    {t('settings.profile.resendVerification')}
                                                </Link>
                                            </p>

                                            {status ===
                                                'verification-link-sent' && (
                                                <div className="mt-2 text-sm font-medium text-green-600">
                                                    {t('settings.profile.verificationSent')}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                <div className="flex items-center gap-4">
                                    <Button
                                        disabled={processing}
                                        data-test="update-profile-button"
                                        className="bg-green-600 hover:bg-green-700"
                                    >
                                        {t('settings.profile.save')}
                                    </Button>

                                    <Transition
                                        show={recentlySuccessful}
                                        enter="transition ease-in-out"
                                        enterFrom="opacity-0"
                                        leave="transition ease-in-out"
                                        leaveTo="opacity-0"
                                    >
                                        <p className="text-sm text-neutral-600">
                                            {t('settings.profile.saved')}
                                        </p>
                                    </Transition>
                                </div>
                            </>
                        )}
                    </Form>
                </div>

                <DeleteUser />
            </SettingsLayout>
        </>
    );
}
