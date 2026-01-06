<?php

namespace App\Http\Controllers;

use App\Mail\NewAnnouncementMail;
use App\Models\Announcement;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class AnnouncementController extends Controller
{
    // FARMER METHODS

    // Farmer: View all published announcements
    public function farmerIndex()
    {
        $announcements = Announcement::published()
            ->orderBy('published_at', 'desc')
            ->get();

        return Inertia::render('farmer/announcements', [
            'announcements' => $announcements
        ]);
    }

    // ADMIN METHODS

    // Admin: View all announcements
    public function adminIndex()
    {
        $announcements = Announcement::orderBy('created_at', 'desc')->get();

        $stats = [
            'total' => Announcement::count(),
            'published' => Announcement::published()->count(),
            'draft' => Announcement::whereNull('published_at')->count(),
        ];

        return Inertia::render('admin/announcements', [
            'announcements' => $announcements,
            'stats' => $stats,
        ]);
    }

    // Admin: Create announcement
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'category' => 'nullable|string|max:255',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:5120', // max 5MB
            'publish_now' => 'boolean',
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('announcements', 'public');
        }

        $announcement = Announcement::create([
            'user_id' => $request->user()->user_id,
            'title' => $validated['title'],
            'content' => $validated['content'],
            'category' => $validated['category'] ?? null,
            'image' => $imagePath,
            'published_at' => ($validated['publish_now'] ?? true) ? now() : null,
        ]);

        // Send email to all farmers if announcement is published
        if ($announcement->published_at) {
            $this->sendAnnouncementEmails($announcement);
        }

        return redirect()->back()->with('success', 'Pengumuman berjaya dicipta');
    }

    // Admin: Update announcement
    public function update(Request $request, Announcement $announcement)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'category' => 'nullable|string|max:255',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:5120',
            'publish_now' => 'boolean',
        ]);

        $imagePath = $announcement->image;
        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($announcement->image) {
                Storage::disk('public')->delete($announcement->image);
            }
            $imagePath = $request->file('image')->store('announcements', 'public');
        }

        $announcement->update([
            'title' => $validated['title'],
            'content' => $validated['content'],
            'category' => $validated['category'] ?? null,
            'image' => $imagePath,
            'published_at' => ($validated['publish_now'] ?? true) ? ($announcement->published_at ?? now()) : null,
        ]);

        return redirect()->back()->with('success', 'Pengumuman berjaya dikemaskini');
    }

    // Admin: Delete announcement
    public function destroy(Announcement $announcement)
    {
        // Delete image if exists
        if ($announcement->image) {
            Storage::disk('public')->delete($announcement->image);
        }

        $announcement->delete();

        return redirect()->back()->with('success', 'Pengumuman berjaya dipadam');
    }

    // Admin: Publish/Unpublish announcement
    public function togglePublish(Announcement $announcement)
    {
        $wasPublished = $announcement->published_at !== null;

        $announcement->update([
            'published_at' => $announcement->published_at ? null : now(),
        ]);

        // Send email to all farmers if announcement is being published (not unpublished)
        if (!$wasPublished && $announcement->published_at) {
            $this->sendAnnouncementEmails($announcement);
        }

        $message = $announcement->published_at ? 'Pengumuman berjaya diterbitkan' : 'Pengumuman berjaya dinyahterbitkan';
        return redirect()->back()->with('success', $message);
    }

    /**
     * Send announcement emails to all farmers
     */
    private function sendAnnouncementEmails(Announcement $announcement)
    {
        // Get all farmers (role = 2)
        $farmers = User::where('role', 2)
            ->whereNotNull('email')
            ->whereNotNull('email_verified_at')
            ->get();

        // Send email to each farmer
        foreach ($farmers as $farmer) {
            try {
                Mail::to($farmer->email)->send(new NewAnnouncementMail($announcement));
            } catch (\Exception $e) {
                // Log error but don't stop the process
                Log::error('Failed to send announcement email to ' . $farmer->email . ': ' . $e->getMessage());
            }
        }
    }
}