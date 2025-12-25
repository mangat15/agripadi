import { Link } from '@inertiajs/react';
import { Check } from 'lucide-react';
import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    title?: string;
    description?: string;
}

export default function AgripadiAuthLayout({
    children,
    title,
    description,
}: PropsWithChildren<AuthLayoutProps>) {
    return (
        <div className="min-h-screen flex">
            {/* Left Side - Branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-green-50 to-green-100 p-12 flex-col justify-between">
                <div>
                    {/* Logo and Tagline */}
                    <div className="flex items-center gap-3 mb-12">
                        <img
                            src="/logo1.png"
                            alt="AgriPadi Logo"
                            className="h-16 w-16 rounded-full"
                        />
                        <div>
                            <h1 className="text-3xl font-bold text-green-800">AgriPadi</h1>
                            <p className="text-sm text-green-700">Empowering Farmers Through Technology 🌾</p>
                        </div>
                    </div>

                    {/* Title */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-green-900 mb-2">
                            Sertai Komuniti Petani Padi
                        </h2>
                        <p className="text-green-800">
                            Daftar sekarang untuk akses penuh kepada platform pembelajaran pertanian
                        </p>
                    </div>

                    {/* Features List */}
                    <div className="space-y-4">
                        <div className="bg-green-100 rounded-lg p-4">
                            <h3 className="font-semibold text-green-900 mb-3">Apa yang anda dapat:</h3>
                            <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <div className="bg-green-600 rounded-full p-1 mt-0.5">
                                        <Check className="h-4 w-4 text-white" />
                                    </div>
                                    <span className="text-green-900">Akses kepada bahan pembelajaran video dan dokumen</span>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="bg-green-600 rounded-full p-1 mt-0.5">
                                        <Check className="h-4 w-4 text-white" />
                                    </div>
                                    <span className="text-green-900">Lawatan maya ladang model 360°</span>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="bg-green-600 rounded-full p-1 mt-0.5">
                                        <Check className="h-4 w-4 text-white" />
                                    </div>
                                    <span className="text-green-900">Forum komuniti untuk berhubung dengan petani lain</span>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="bg-green-600 rounded-full p-1 mt-0.5">
                                        <Check className="h-4 w-4 text-white" />
                                    </div>
                                    <span className="text-green-900">Sistem pelaporan dan maklum balas</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
                <div className="w-full max-w-md">
                    {/* Mobile Logo */}
                    <div className="lg:hidden flex flex-col items-center mb-8">
                        <div className="flex items-center gap-3 mb-4">
                            <img
                                src="/logo1.png"
                                alt="AgriPadi Logo"
                                className="h-12 w-12 rounded-full"
                            />
                            <div>
                                <h1 className="text-2xl font-bold text-green-800">AgriPadi</h1>
                                <p className="text-xs text-green-700">Empowering Farmers Through Technology 🌾</p>
                            </div>
                        </div>
                    </div>

                    {/* Form Title */}
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            {title}
                        </h2>
                        <p className="text-sm text-gray-600">
                            {description}
                        </p>
                    </div>

                    {/* Form Content */}
                    {children}
                </div>
            </div>
        </div>
    );
}