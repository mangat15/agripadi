<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index()
    {
        $users = User::orderBy('created_at', 'desc')->get()->map(function ($user) {
            return [
                'user_id' => $user->user_id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role, // 0 = farmer, 1 = admin
                'role_label' => $user->role === 1 ? 'admin' : 'farmer', // For display
                'location' => $user->location ?? '-',
                'profile_picture' => $user->profile_picture,
                'created_at' => $user->created_at ? $user->created_at->toISOString() : null,
                'registered_at' => $user->registered_at ?? ($user->created_at ? $user->created_at->format('Y-m-d') : null),
            ];
        });

        return Inertia::render('admin/users', [
            'users' => $users
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
            'role' => 'required|in:0,1,admin,farmer', // Accept both formats
            'location' => 'nullable|string|max:255',
        ]);

        // Convert string role to integer if needed
        $role = $validated['role'];
        if ($role === 'admin') $role = 1;
        if ($role === 'farmer') $role = 0;

        User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $role,
            'location' => $validated['location'] ?? null,
            'email_verified_at' => now(),
        ]);

        return redirect()->back()->with('success', 'Pengguna berjaya ditambah');
    }

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->user_id . ',user_id',
            'password' => 'nullable|string|min:8',
            'role' => 'required|in:0,1,admin,farmer', // Accept both formats
            'location' => 'nullable|string|max:255',
        ]);

        // Convert string role to integer if needed
        $role = $validated['role'];
        if ($role === 'admin') $role = 1;
        if ($role === 'farmer') $role = 0;

        $updateData = [
            'name' => $validated['name'],
            'email' => $validated['email'],
            'role' => $role,
            'location' => $validated['location'] ?? null,
        ];

        // Only update password if provided
        if (!empty($validated['password'])) {
            $updateData['password'] = Hash::make($validated['password']);
        }

        $user->update($updateData);

        return redirect()->back()->with('success', 'Pengguna berjaya dikemaskini');
    }

    public function destroy(User $user, Request $request)
    {
        // Prevent deleting yourself
        if ($user->user_id === $request->user()->user_id) {
            return redirect()->back()->with('error', 'Anda tidak boleh memadam akaun anda sendiri');
        }

        $user->delete();

        return redirect()->back()->with('success', 'Pengguna berjaya dipadam');
    }
}
