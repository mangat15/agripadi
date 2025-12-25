import { useState } from 'react';
import AppHeaderLayout from '@/layouts/app/app-header-layout';
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
    Mail,
    Phone,
    MapPin,
    Edit,
    Calendar,
    Leaf,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface FarmerProfile {
    name: string;
    email: string;
    phone: string;
    location: string;
    farmSize: string;
    joinedDate: string;
    totalReports: number;
    resolvedReports: number;
    forumPosts: number;
    avatar?: string;
}

const profile: FarmerProfile = {
    name: 'Ahmad Ibrahim',
    email: 'ahmad@example.com',
    phone: '011-23456789',
    location: 'Alor Setar, Kedah',
    farmSize: '2.5 acres',
    joinedDate: '2023-01-15',
    totalReports: 12,
    resolvedReports: 10,
    forumPosts: 24,
};

export default function FarmerProfile() {
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <AppHeaderLayout
            breadcrumbs={[
                { title: 'Home', href: '/dashboard' },
                { title: 'My Profile', href: '/farmer/profile' },
            ]}
        >
            <div className="mx-auto w-full max-w-5xl space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            My Profile
                        </h1>
                        <p className="text-muted-foreground mt-2">
                            View and manage your account information
                        </p>
                    </div>
                </div>

                {/* Profile Header */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex flex-col items-center gap-6 md:flex-row">
                            <Avatar className="h-32 w-32">
                                <AvatarImage
                                    src={profile.avatar}
                                    alt={profile.name}
                                />
                                <AvatarFallback className="bg-primary/10 text-primary text-3xl">
                                    {getInitials(profile.name)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 space-y-3 text-center md:text-left">
                                <div>
                                    <h2 className="text-2xl font-bold">
                                        {profile.name}
                                    </h2>
                                    <p className="text-muted-foreground">
                                        Farmer
                                    </p>
                                </div>
                                <div className="flex flex-col gap-2 text-sm md:flex-row md:gap-4">
                                    <div className="flex items-center justify-center gap-1 md:justify-start">
                                        <MapPin className="h-4 w-4" />
                                        <span>{profile.location}</span>
                                    </div>
                                    <div className="flex items-center justify-center gap-1 md:justify-start">
                                        <Calendar className="h-4 w-4" />
                                        <span>
                                            Joined {profile.joinedDate}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-center gap-1 md:justify-start">
                                        <Leaf className="h-4 w-4" />
                                        <span>
                                            Farm Size: {profile.farmSize}
                                        </span>
                                    </div>
                                </div>
                                <Button
                                    onClick={() => setIsEditDialogOpen(true)}
                                    className="mt-4"
                                >
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit Profile
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Statistics */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Reports
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {profile.totalReports}
                            </div>
                            <p className="text-muted-foreground text-xs">
                                {profile.resolvedReports} resolved
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Forum Posts
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {profile.forumPosts}
                            </div>
                            <p className="text-muted-foreground text-xs">
                                Community contributions
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Farm Size
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {profile.farmSize}
                            </div>
                            <p className="text-muted-foreground text-xs">
                                Total area
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Contact Information */}
                <Card>
                    <CardHeader>
                        <CardTitle>Contact Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                    <Mail className="h-4 w-4" />
                                    <span>Email</span>
                                </div>
                                <p className="font-medium">{profile.email}</p>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                    <Phone className="h-4 w-4" />
                                    <span>Phone</span>
                                </div>
                                <p className="font-medium">{profile.phone}</p>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                    <MapPin className="h-4 w-4" />
                                    <span>Location</span>
                                </div>
                                <p className="font-medium">{profile.location}</p>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                    <Leaf className="h-4 w-4" />
                                    <span>Farm Size</span>
                                </div>
                                <p className="font-medium">{profile.farmSize}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Edit Profile Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Edit Profile</DialogTitle>
                        <DialogDescription>
                            Update your profile information
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                                id="name"
                                defaultValue={profile.name}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                defaultValue={profile.email}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input
                                id="phone"
                                defaultValue={profile.phone}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="location">Location</Label>
                            <Input
                                id="location"
                                defaultValue={profile.location}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="farmSize">Farm Size</Label>
                            <Input
                                id="farmSize"
                                defaultValue={profile.farmSize}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsEditDialogOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button>Save Changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppHeaderLayout>
    );
}
