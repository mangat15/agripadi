import { Button } from '@/components/ui/button';
import { login, register } from '@/routes';
import { Head, Link } from '@inertiajs/react';
import { BookOpen, Camera, MessageSquare, Bell, FileText, ThumbsUp } from 'lucide-react';

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

            <div className="min-h-screen bg-white relative overflow-hidden">
                {/* Decorative background elements */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-green-50 to-emerald-50 rounded-full blur-3xl opacity-30 -z-10"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-green-50 to-lime-50 rounded-full blur-3xl opacity-30 -z-10"></div>

                {/* Rice stalk watermark */}
                <div className="absolute top-20 right-10 opacity-5 -z-10 hidden lg:block">
                    <svg width="200" height="300" viewBox="0 0 100 150" fill="currentColor" className="text-green-600">
                        <path d="M50 0 L50 100 M50 20 Q60 15 65 20 M50 30 Q40 25 35 30 M50 40 Q60 35 65 40 M50 50 Q40 45 35 50 M50 60 Q60 55 65 60 M50 70 Q40 65 35 70 M50 80 Q60 75 65 80 M50 90 Q40 85 35 90" stroke="currentColor" strokeWidth="2" fill="none"/>
                    </svg>
                </div>
                {/* Header/Navigation */}
                <header className="bg-gradient-to-r from-green-100 via-emerald-50 to-green-100 shadow-md sticky top-0 z-50 backdrop-blur-sm">
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
                <section className="container mx-auto px-6 py-8 md:py-12">
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                        <div className="space-y-5">
                            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
                                Platform Digital <br />
                                <span className="bg-gradient-to-r from-green-600 via-green-500 to-emerald-500 bg-clip-text text-transparent">
                                    Pembelajaran Padi
                                </span>
                            </h1>
                            <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
                                Kami membantu petani padi meningkatkan ilmu dan kemahiran melalui teknologi digital yang mesra pengguna dan mudah diakses.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-3 pt-2">
                                <Link href={register()}>
                                    <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-4 text-base font-bold shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 hover:-translate-y-1 w-full sm:w-auto">
                                        <span className="flex items-center gap-2">
                                            Mulakan Perjalanan Anda
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                            </svg>
                                        </span>
                                    </Button>
                                </Link>
                                <Link href={login()}>
                                    <Button variant="outline" className="border-2 border-green-600 text-green-600 hover:bg-green-50 hover:border-green-700 px-8 py-4 text-base font-bold transition-all w-full sm:w-auto">
                                        Log Masuk
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        <div className="relative group/image">
                            {/* Decorative border */}
                            <div className="absolute -inset-4 bg-gradient-to-r from-green-400 via-emerald-400 to-lime-400 rounded-3xl opacity-20 blur-2xl group-hover/image:opacity-30 transition-opacity"></div>

                            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white ring-4 ring-green-100 group-hover/image:ring-green-200 transition-all group-hover/image:shadow-3xl">
                                <img
                                    src="/images/images.jpg"
                                    alt="Sawah Padi di Sabah"
                                    className="w-full h-[320px] md:h-[380px] object-cover transition-transform duration-500 group-hover/image:scale-110"
                                />
                                <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-md text-white px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 shadow-lg border border-white/20">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    Kg. Sangkir, Kota Belud
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Stats Section */}
                <section className="relative bg-gradient-to-b from-green-100 via-emerald-100 to-green-100 py-12">
                    {/* Decorative background elements for stats section */}
                    <div className="absolute top-0 left-1/4 w-64 h-64 bg-gradient-to-br from-green-200 to-emerald-200 rounded-full blur-3xl opacity-50 -z-10"></div>
                    <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-gradient-to-tr from-green-200 to-lime-200 rounded-full blur-3xl opacity-50 -z-10"></div>

                    <div className="container mx-auto px-6">
                        <div className="grid md:grid-cols-3 gap-8 text-center">
                            <div className="group p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all border-2 border-green-100 hover:border-green-300">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl mb-4 group-hover:scale-110 transition-transform">
                                    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                                <div className="text-5xl font-extrabold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-3">Lebih {stats.totalFarmers}</div>
                                <p className="text-gray-700 font-semibold text-lg">Petani Berdaftar</p>
                                <p className="text-gray-500 text-sm mt-2">Dari seluruh Malaysia</p>
                            </div>
                            <div className="group p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all border-2 border-blue-100 hover:border-blue-300">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mb-4 group-hover:scale-110 transition-transform">
                                    <BookOpen className="w-8 h-8 text-white" />
                                </div>
                                <div className="text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent mb-3">Lebih {stats.totalLearningMaterials}</div>
                                <p className="text-gray-700 font-semibold text-lg">Ilmu & Panduan</p>
                                <p className="text-gray-500 text-sm mt-2">Video tutorial berkualiti</p>
                            </div>
                            <div className="group p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all border-2 border-purple-100 hover:border-purple-300">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl mb-4 group-hover:scale-110 transition-transform">
                                    <MessageSquare className="w-8 h-8 text-white" />
                                </div>
                                <div className="text-5xl font-extrabold bg-gradient-to-r from-purple-600 to-purple-500 bg-clip-text text-transparent mb-3">Lebih {stats.totalForums}</div>
                                <p className="text-gray-700 font-semibold text-lg">Forum Komuniti</p>
                                <p className="text-gray-500 text-sm mt-2">Perbincangan yang aktif</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="bg-gradient-to-b from-white to-green-50 py-16">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-20 px-4 py-10 bg-green-50 rounded-lg shadow-sm">
  <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-4">
    Platform maklumat dan sokongan<br className="hidden md:inline" /> untuk petani padi
  </h2>
  <div className="w-12 h-1 mx-auto bg-green-600 mb-6 rounded"></div>
  <p className="text-lg md:text-xl text-gray-700 leading-relaxed max-w-4xl mx-auto">
    Direka untuk memudahkan laporan kepada pegawai pertanian, penyampaian pengumuman rasmi, dan akses kepada bahan pembelajaran yang relevan.
  </p>
</div>



                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all border-2 border-transparent hover:border-green-200">
                                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                                    <BookOpen className="h-7 w-7 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    Bahan Pembelajaran
                                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M9 3L7 1H3v2l2 2-2 2v2h4L9 7l2 2h2V7L9 3zm0 4.5L7.5 6 9 4.5 10.5 6 9 7.5z"/>
                                    </svg>
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    Akses kepada bahan rujukan dan video tutorial tentang pertanian padi.
                                </p>
                            </div>

                            <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all border-2 border-transparent hover:border-purple-200">
                                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                                    <Camera className="h-7 w-7 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    Lawatan Maya 360°
                                    <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                                    </svg>
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    Terokai ladang padi secara interaktif dengan teknologi 360 darjah yang menakjubkan.
                                </p>
                            </div>

                            <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all border-2 border-transparent hover:border-blue-200">
                                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                                    <MessageSquare className="h-7 w-7 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    Forum Perbincangan
                                    <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
                                    </svg>
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    Berkongsi pengalaman dan bertanya soalan dengan komuniti petani seluruh negara.
                                </p>
                            </div>

                            <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all border-2 border-transparent hover:border-yellow-200">
                                <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                                    <Bell className="h-7 w-7 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    Pengumuman Penting
                                    <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                    </svg>
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    Dapatkan maklumat terkini tentang program bantuan, subsidi dan inisiatif kerajaan.
                                </p>
                            </div>

                            <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all border-2 border-transparent hover:border-red-200">
                                <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                                    <FileText className="h-7 w-7 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    Sistem Laporan
                                    <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6z"/>
                                    </svg>
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    Hantar laporan masalah ladang dengan mudah dan dapatkan bantuan pakar dengan segera.
                                </p>
                            </div>

                            <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all border-2 border-transparent hover:border-indigo-200">
                                <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                                    <ThumbsUp className="h-7 w-7 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    Maklum Balas
                                    <svg className="w-5 h-5 text-indigo-600" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                                    </svg>
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    Suara anda penting! Kongsi cadangan untuk penambahbaikan platform ini.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="container mx-auto px-6 py-12">
                    <div className="relative bg-gradient-to-r from-green-600 via-emerald-600 to-green-500 rounded-3xl p-10 md:p-12 text-center text-white shadow-2xl overflow-hidden">
                        {/* Decorative elements */}
                        <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 w-72 h-72 bg-emerald-400/10 rounded-full blur-3xl"></div>

                        {/* Rice stalk decorations */}
                        <div className="absolute top-4 left-4 opacity-10">
                            <svg width="100" height="100" viewBox="0 0 50 75" fill="white">
                                <path d="M25 0 L25 50 M25 10 Q30 7.5 32.5 10 M25 15 Q20 12.5 17.5 15 M25 20 Q30 17.5 32.5 20 M25 25 Q20 22.5 17.5 25" stroke="white" strokeWidth="2" fill="none"/>
                            </svg>
                        </div>
                        <div className="absolute bottom-4 right-4 opacity-10">
                            <svg width="100" height="100" viewBox="0 0 50 75" fill="white">
                                <path d="M25 0 L25 50 M25 10 Q30 7.5 32.5 10 M25 15 Q20 12.5 17.5 15 M25 20 Q30 17.5 32.5 20 M25 25 Q20 22.5 17.5 25" stroke="white" strokeWidth="2" fill="none"/>
                            </svg>
                        </div>

                        <div className="relative z-10 space-y-8">
                            <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
                               Mulakan perjalanan digital anda dalam pertanian padi
                            </h2>
                            <p className="text-xl md:text-2xl mb-8 text-green-50 max-w-2xl mx-auto leading-relaxed font-light">
                               Pendaftaran percuma membolehkan anda menghantar laporan, menerima pengumuman, dan mengakses bahan rujukan dengan mudah.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                                <Link href={register()}>
                                    <Button className="bg-white text-green-600 hover:bg-green-50 px-12 py-6 text-xl font-extrabold shadow-2xl hover:shadow-3xl transition-all transform hover:scale-110 hover:-translate-y-1">
                                        <span className="flex items-center gap-3">
                                            Terokai Sekarang
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                            </svg>
                                        </span>
                                    </Button>
                                </Link>
                            </div>
                        </div>
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
                                <h3 className="text-white font-bold mb-4">Hubungi Kami agripadihelpdesk@gmail.com</h3>
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