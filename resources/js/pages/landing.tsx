import { Button } from '@/components/ui/button';
import { login, register } from '@/routes';
import { Head, Link } from '@inertiajs/react';
import { BookOpen, Camera, MessageSquare, Bell, FileText, ThumbsUp, CheckCircle } from 'lucide-react';

interface Props {
    stats: {
        totalFarmers: number;
        totalLearningMaterials: number;
        totalForums: number;
    };
}

export default function Landing({ stats }: Props) {
    return (
        <>
            <Head title="Selamat Datang ke AgriPadi" />

            <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
                {/* Header/Navigation */}
                <header className="bg-white shadow-md sticky top-0 z-50">
                    <div className="container mx-auto px-6 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <img
                                    src="/logo1.png"
                                    alt="AgriPadi Logo"
                                    className="h-14 w-14 rounded-full object-cover shadow-lg ring-2 ring-green-500"
                                />
                                <span className="text-xl font-bold text-gray-900">Empowering Farmers Through Technology 🌾</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <Link href={login()}>
                                    <Button variant="ghost" className="text-gray-700 hover:text-green-600 text-base px-6 py-2">
                                        Log Masuk
                                    </Button>
                                </Link>
                                <Link href={register()}>
                                    <Button className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white text-base px-6 py-2 shadow-lg hover:shadow-xl transition-all">
                                        Daftar
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Hero Section */}
                <section className="container mx-auto px-6 py-12">
                    <div className="grid md:grid-cols-2 gap-10 items-center min-h-[calc(100vh-120px)]">
                        <div className="flex flex-col justify-center space-y-6">
                            <div className="space-y-5">
                                <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight">
                                    Platform Pembelajaran <br />
                                    <span className="bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
                                        Pertanian Padi
                                    </span>
                                </h1>
                                <p className="text-lg text-gray-600 leading-relaxed">
                                    Tingkatkan kemahiran pertanian anda dengan akses kepada bahan pembelajaran, lawatan maya ladang model, dan komuniti petani yang aktif.
                                </p>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link href={register()}>
                                    <Button className="bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 text-white px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 w-full sm:w-auto">
                                        Mula Sekarang →
                                    </Button>
                                </Link>
                                <Link href={login()}>
                                    <Button variant="outline" className="border-2 border-green-600 text-green-600 hover:bg-green-50 px-8 py-4 text-lg font-semibold hover:shadow-lg transition-all w-full sm:w-auto">
                                        Log Masuk
                                    </Button>
                                </Link>
                            </div>
                        </div>
                        <div className="relative h-full flex items-center">
                            {/* Decorative background */}
                            <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 to-emerald-500/20 rounded-3xl blur-3xl"></div>

                            {/* Main image */}
                            <div className="relative w-full transform hover:scale-105 transition-transform duration-500">
                                <div className="absolute -inset-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-3xl opacity-20 blur-xl"></div>
                                <img
                                    src="/images/images.jpg"
                                    alt="Pertanian Padi"
                                    className="relative rounded-3xl shadow-2xl w-full h-[420px] object-cover border-4 border-white/50 ring-2 ring-green-500/30"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Stats Section */}
                <section className="bg-white py-16">
                    <div className="container mx-auto px-6">
                        <div className="grid md:grid-cols-3 gap-8 text-center">
                            <div className="p-6">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                                    <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-4xl font-bold text-gray-900 mb-2">{stats.totalFarmers}+</h3>
                                <p className="text-gray-600">Petani Aktif</p>
                            </div>
                            <div className="p-6">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                                    <BookOpen className="h-8 w-8 text-green-600" />
                                </div>
                                <h3 className="text-4xl font-bold text-gray-900 mb-2">{stats.totalLearningMaterials}+</h3>
                                <p className="text-gray-600">Bahan Pembelajaran</p>
                            </div>
                            <div className="p-6">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                                    <MessageSquare className="h-8 w-8 text-green-600" />
                                </div>
                                <h3 className="text-4xl font-bold text-gray-900 mb-2">{stats.totalForums}+</h3>
                                <p className="text-gray-600">Forum Komuniti</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="container mx-auto px-6 py-16">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Ciri-ciri Utama Platform</h2>
                        <p className="text-xl text-gray-600">
                            AgriPadi menyediakan pelbagai kemudahan untuk membantu petani meningkatkan hasil dan kemahiran
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-lg mb-6">
                                <BookOpen className="h-8 w-8 text-blue-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">Bahan Pembelajaran</h3>
                            <p className="text-gray-600">
                                Akses kepada video tutorial, dokumen panduan, dan bahan pembelajaran yang komprehensif tentang pertanian padi moden.
                            </p>
                        </div>

                        <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-lg mb-6">
                                <Camera className="h-8 w-8 text-purple-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">Lawatan Maya 360°</h3>
                            <p className="text-gray-600">
                                Jelajahi ladang model dengan teknologi 360° untuk melihat teknik pertanian terbaik secara interaktif.
                            </p>
                        </div>

                        <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-lg mb-6">
                                <MessageSquare className="h-8 w-8 text-green-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">Forum Komuniti</h3>
                            <p className="text-gray-600">
                                Berhubung dengan petani lain, kongsi pengalaman, dan dapatkan nasihat daripada komuniti pertanian yang aktif.
                            </p>
                        </div>

                        <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-lg mb-6">
                                <Bell className="h-8 w-8 text-yellow-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">Pengumuman & Berita</h3>
                            <p className="text-gray-600">
                                Terima kemas kini terkini tentang program kerajaan, subsidi, dan berita pertanian penting.
                            </p>
                        </div>

                        <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-lg mb-6">
                                <FileText className="h-8 w-8 text-red-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">Sistem Pelaporan</h3>
                            <p className="text-gray-600">
                                Laporkan masalah, dapatkan bantuan teknikal, dan jejaki kemajuan pertanian anda dengan mudah.
                            </p>
                        </div>

                        <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-lg mb-6">
                                <ThumbsUp className="h-8 w-8 text-blue-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">Maklum Balas</h3>
                            <p className="text-gray-600">
                                Berikan maklum balas dan cadangan untuk memperbaiki sistem dan perkhidmatan platform.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Why Choose Section */}
                <section className="bg-green-600 text-white py-16">
                    <div className="container mx-auto px-6">
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div>
                                <h2 className="text-4xl font-bold mb-8">Mengapa Pilih AgriPadi?</h2>
                                <div className="space-y-6">
                                    <div className="flex items-start gap-4">
                                        <CheckCircle className="h-8 w-8 flex-shrink-0 mt-1" />
                                        <div>
                                            <h3 className="text-xl font-bold mb-2">Pembelajaran Fleksibel</h3>
                                            <p className="text-green-100">
                                                Belajar pada masa anda sendiri dengan akses 24/7 kepada semua bahan pembelajaran.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <CheckCircle className="h-8 w-8 flex-shrink-0 mt-1" />
                                        <div>
                                            <h3 className="text-xl font-bold mb-2">Sokongan Pakar</h3>
                                            <p className="text-green-100">
                                                Dapatkan nasihat dan panduan daripada pegawai pertanian dan petani berpengalaman.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <CheckCircle className="h-8 w-8 flex-shrink-0 mt-1" />
                                        <div>
                                            <h3 className="text-xl font-bold mb-2">Teknologi Terkini</h3>
                                            <p className="text-green-100">
                                                Gunakan teknologi moden seperti lawatan maya 360° untuk pengalaman pembelajaran yang lebih baik.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <CheckCircle className="h-8 w-8 flex-shrink-0 mt-1" />
                                        <div>
                                            <h3 className="text-xl font-bold mb-2">Percuma Sepenuhnya</h3>
                                            <p className="text-green-100">
                                                Semua ciri dan bahan pembelajaran disediakan secara percuma untuk semua petani.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="relative">
                                {/* Decorative glow effect */}
                                <div className="absolute -inset-4 bg-gradient-to-r from-white/20 to-green-300/20 rounded-3xl blur-2xl opacity-50"></div>

                                {/* Image with frame */}
                                <div className="relative">
                                    <img
                                        src="/images/landing-2.jpg"
                                        alt="Petani di ladang padi"
                                        className="rounded-3xl shadow-2xl w-full h-auto border-4 border-white/30"
                                    />
                                    {/* Glass overlay effect */}
                                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/10 via-transparent to-transparent"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="container mx-auto px-6 py-16">
                    <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-3xl p-12 text-center text-white shadow-2xl">
                        <h2 className="text-4xl font-bold mb-6">
                            Sertai Komuniti Petani Hari Ini
                        </h2>
                        <p className="text-xl mb-8 text-green-50">
                            Daftar sekarang dan mulakan perjalanan anda untuk menjadi petani padi yang lebih berjaya dan berpengetahuan.
                        </p>
                        <Link href={register()}>
                            <Button className="bg-white text-green-600 hover:bg-green-50 px-8 py-6 text-lg font-semibold">
                                Daftar Percuma →
                            </Button>
                        </Link>
                    </div>
                </section>

                {/* Footer */}
                <footer className="bg-gray-900 text-gray-300 py-12">
                    <div className="container mx-auto px-6">
                        <div className="grid md:grid-cols-3 gap-8">
                            <div>
                                <div className="flex items-center gap-3 mb-4">
                                    <img
                                        src="/logo1.png"
                                        alt="AgriPadi Logo"
                                        className="h-10 w-10 rounded-full object-cover"
                                    />
                                    <span className="text-xl font-bold text-white">AgriPadi</span>
                                </div>
                                <p className="text-gray-400">
                                    Platform pembelajaran pertanian padi untuk meningkatkan kemahiran dan hasil petani.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-white font-bold mb-4">Pautan Pantas</h3>
                                <div className="space-y-2">
                                    <Link href={login()} className="block hover:text-green-400 transition-colors">
                                        Log Masuk
                                    </Link>
                                    <Link href={register()} className="block hover:text-green-400 transition-colors">
                                        Daftar
                                    </Link>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-white font-bold mb-4">Hubungi Kami</h3>
                                <p className="text-gray-400">
                                    Untuk sebarang pertanyaan atau bantuan, sila hubungi pasukan sokongan kami.
                                </p>
                            </div>
                        </div>
                        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500">
                            © 2025 AgriPadi. Hak Cipta Terpelihara.
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}