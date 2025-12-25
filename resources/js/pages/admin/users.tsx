import { useState } from 'react';
import AdminSidebarLayout from '@/layouts/app/admin-sidebar-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { UserPlus, Trash2, Search, Edit } from 'lucide-react';
import { useForm, router } from '@inertiajs/react';

interface User {
    user_id: number;
    name: string;
    email: string;
    role: number; // 0 = farmer, 1 = admin
    role_label: 'admin' | 'farmer';
    location: string | null;
    created_at: string;
}

interface Props {
    users: User[];
}

export default function AdminUsers({ users }: Props) {
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        role: 'farmer' as 'admin' | 'farmer',
        location: '',
    });

    const editForm = useForm({
        name: '',
        email: '',
        password: '',
        role: 'farmer' as 'admin' | 'farmer',
        location: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        router.post('/admin/users', data, {
            onSuccess: () => {
                setIsCreateDialogOpen(false);
                reset();
            },
        });
    };

    const handleEdit = (user: User) => {
        setSelectedUser(user);
        editForm.setData({
            name: user.name,
            email: user.email,
            password: '',
            role: user.role_label,
            location: user.location || '',
        });
        setIsEditDialogOpen(true);
    };

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (selectedUser) {
            router.put(`/admin/users/${selectedUser.user_id}`, editForm.data, {
                onSuccess: () => {
                    setIsEditDialogOpen(false);
                    editForm.reset();
                },
            });
        }
    };

    const handleDelete = (userId: number) => {
        if (confirm('Adakah anda pasti mahu memadam pengguna ini?')) {
            router.delete(`/admin/users/${userId}`);
        }
    };

    const filteredUsers = users.filter(
        (user) =>
            user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (user.location && user.location.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('ms-MY', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <AdminSidebarLayout breadcrumbs={[{ title: 'Pengurusan Pengguna', href: '/admin/users' }]}>
            <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Pengurusan Pengguna</h1>
                        <p className="text-sm text-gray-600 mt-1">
                            Urus pengguna sistem AgriPadi
                        </p>
                    </div>
                    <Button
                        onClick={() => setIsCreateDialogOpen(true)}
                        className="bg-green-600 hover:bg-green-700"
                    >
                        <UserPlus className="h-4 w-4 mr-2" />
                        Tambah Pengguna
                    </Button>
                </div>

                {/* Search Bar */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Cari pengguna mengikut nama, e-mel atau lokasi..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Users Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Senarai Pengguna ({filteredUsers.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Pengguna</TableHead>
                                    <TableHead>E-mel</TableHead>
                                    <TableHead>Lokasi</TableHead>
                                    <TableHead>Peranan</TableHead>
                                    <TableHead>Tarikh Daftar</TableHead>
                                    <TableHead className="text-right">Tindakan</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredUsers.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                                            Tiada pengguna dijumpai
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredUsers.map((user) => (
                                        <TableRow key={user.user_id}>
                                            <TableCell className="font-medium">{user.name}</TableCell>
                                            <TableCell>{user.email}</TableCell>
                                            <TableCell>{user.location || '-'}</TableCell>
                                            <TableCell>
                                                <span
                                                    className={`px-2 py-1 rounded text-xs font-medium ${
                                                        user.role_label === 'admin'
                                                            ? 'bg-purple-100 text-purple-800'
                                                            : 'bg-green-100 text-green-800'
                                                    }`}
                                                >
                                                    {user.role_label === 'admin' ? 'Admin' : 'Petani'}
                                                </span>
                                            </TableCell>
                                            <TableCell>{formatDate(user.created_at)}</TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex gap-2 justify-end">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleEdit(user)}
                                                        className="hover:bg-blue-50 hover:text-blue-600"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleDelete(user.user_id)}
                                                        className="hover:bg-red-50 hover:text-red-600"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>

            {/* Add User Dialog */}
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Tambah Pengguna Baru</DialogTitle>
                        <DialogDescription>
                            Isikan maklumat pengguna baru untuk sistem AgriPadi
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nama Penuh *</Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="Masukkan nama penuh"
                                    required
                                />
                                {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Alamat E-mel *</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="Masukkan alamat e-mel"
                                    required
                                />
                                {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="role">Peranan *</Label>
                                <select
                                    id="role"
                                    value={data.role}
                                    onChange={(e) => setData('role', e.target.value as 'admin' | 'farmer')}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                    required
                                >
                                    <option value="farmer">Petani</option>
                                    <option value="admin">Admin</option>
                                </select>
                                {errors.role && <p className="text-sm text-red-600">{errors.role}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="location">Lokasi</Label>
                                <Input
                                    id="location"
                                    value={data.location}
                                    onChange={(e) => setData('location', e.target.value)}
                                    placeholder="Masukkan lokasi"
                                />
                                {errors.location && <p className="text-sm text-red-600">{errors.location}</p>}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Kata Laluan *</Label>
                            <Input
                                id="password"
                                type="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder="Masukkan kata laluan (minimum 8 aksara)"
                                required
                            />
                            {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    setIsCreateDialogOpen(false);
                                    reset();
                                }}
                            >
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                disabled={processing}
                                className="bg-green-600 hover:bg-green-700"
                            >
                                {processing ? 'Menambah...' : 'Tambah Pengguna'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit User Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Edit Pengguna</DialogTitle>
                        <DialogDescription>
                            Kemaskini maklumat pengguna
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleEditSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-name">Nama Penuh *</Label>
                                <Input
                                    id="edit-name"
                                    value={editForm.data.name}
                                    onChange={(e) => editForm.setData('name', e.target.value)}
                                    placeholder="Masukkan nama penuh"
                                    required
                                />
                                {editForm.errors.name && <p className="text-sm text-red-600">{editForm.errors.name}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="edit-email">Alamat E-mel *</Label>
                                <Input
                                    id="edit-email"
                                    type="email"
                                    value={editForm.data.email}
                                    onChange={(e) => editForm.setData('email', e.target.value)}
                                    placeholder="Masukkan alamat e-mel"
                                    required
                                />
                                {editForm.errors.email && <p className="text-sm text-red-600">{editForm.errors.email}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-role">Peranan *</Label>
                                <select
                                    id="edit-role"
                                    value={editForm.data.role}
                                    onChange={(e) => editForm.setData('role', e.target.value as 'admin' | 'farmer')}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                    required
                                >
                                    <option value="farmer">Petani</option>
                                    <option value="admin">Admin</option>
                                </select>
                                {editForm.errors.role && <p className="text-sm text-red-600">{editForm.errors.role}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="edit-location">Lokasi</Label>
                                <Input
                                    id="edit-location"
                                    value={editForm.data.location}
                                    onChange={(e) => editForm.setData('location', e.target.value)}
                                    placeholder="Masukkan lokasi"
                                />
                                {editForm.errors.location && <p className="text-sm text-red-600">{editForm.errors.location}</p>}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit-password">Kata Laluan Baru</Label>
                            <Input
                                id="edit-password"
                                type="password"
                                value={editForm.data.password}
                                onChange={(e) => editForm.setData('password', e.target.value)}
                                placeholder="Kosongkan jika tidak mahu tukar kata laluan"
                            />
                            <p className="text-xs text-gray-500">Kosongkan jika tidak mahu mengubah kata laluan</p>
                            {editForm.errors.password && <p className="text-sm text-red-600">{editForm.errors.password}</p>}
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    setIsEditDialogOpen(false);
                                    editForm.reset();
                                }}
                            >
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                disabled={editForm.processing}
                                className="bg-green-600 hover:bg-green-700"
                            >
                                {editForm.processing ? 'Mengemas kini...' : 'Kemas Kini'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AdminSidebarLayout>
    );
}