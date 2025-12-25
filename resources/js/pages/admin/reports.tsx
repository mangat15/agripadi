import { useState } from 'react';
import AdminSidebarLayout from '@/layouts/app/admin-sidebar-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Eye } from 'lucide-react';
import { router } from '@inertiajs/react';

interface User {
    id: number;
    name: string;
    email: string;
}

interface Report {
    id: number;
    user_id: number;
    title: string;
    type: string;
    description: string;
    location: string;
    image: string | null;
    status: 'pending' | 'under_review' | 'resolved';
    admin_response: string | null;
    responded_at: string | null;
    created_at: string;
    updated_at: string;
    user: User;
}

interface Props {
    reports: Report[];
}

export default function AdminReports({ reports }: Props) {
    const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'resolved'>('all');

    const filteredReports = reports.filter((report) => {
        if (activeTab === 'all') return true;
        if (activeTab === 'pending') return report.status === 'pending';
        if (activeTab === 'resolved') return report.status === 'resolved';
        return true;
    });

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('ms-MY', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return (
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded">
                        Menunggu
                    </span>
                );
            case 'under_review':
                return (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                        Dalam Semakan
                    </span>
                );
            case 'resolved':
                return (
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                        Selesai
                    </span>
                );
            default:
                return null;
        }
    };

    const handleViewDetails = (reportId: number) => {
        router.get(`/admin/reports/${reportId}`);
    };

    const pendingCount = reports.filter((r) => r.status === 'pending').length;
    const resolvedCount = reports.filter((r) => r.status === 'resolved').length;

    return (
        <AdminSidebarLayout breadcrumbs={[{ title: 'Pengurusan Laporan', href: '/admin/reports' }]}>
            <div className="p-6 space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Pengurusan Laporan Petani</h1>
                    <p className="text-sm text-gray-600 mt-1">
                        Urus dan balas laporan daripada petani
                    </p>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200">
                    <nav className="flex space-x-8">
                        <button
                            onClick={() => setActiveTab('all')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                activeTab === 'all'
                                    ? 'border-green-500 text-green-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            Semua Laporan ({reports.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('pending')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                activeTab === 'pending'
                                    ? 'border-green-500 text-green-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            Menunggu ({pendingCount})
                        </button>
                        <button
                            onClick={() => setActiveTab('resolved')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                activeTab === 'resolved'
                                    ? 'border-green-500 text-green-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            Selesai ({resolvedCount})
                        </button>
                    </nav>
                </div>

                {/* Reports Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>
                            {activeTab === 'all' && 'Semua Laporan'}
                            {activeTab === 'pending' && 'Laporan Menunggu'}
                            {activeTab === 'resolved' && 'Laporan Selesai'}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Laporan</TableHead>
                                    <TableHead>Petani</TableHead>
                                    <TableHead>Jenis</TableHead>
                                    <TableHead>Tarikh</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Tindakan</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredReports.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                                            Tiada laporan dijumpai
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredReports.map((report) => (
                                        <TableRow key={report.id}>
                                            <TableCell className="font-medium">{report.title}</TableCell>
                                            <TableCell>{report.user.name}</TableCell>
                                            <TableCell>{report.type}</TableCell>
                                            <TableCell>{formatDate(report.created_at)}</TableCell>
                                            <TableCell>{getStatusBadge(report.status)}</TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleViewDetails(report.id)}
                                                    className="hover:bg-green-50 hover:text-green-600"
                                                >
                                                    <Eye className="h-4 w-4 mr-2" />
                                                    Lihat Butiran
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </AdminSidebarLayout>
    );
}