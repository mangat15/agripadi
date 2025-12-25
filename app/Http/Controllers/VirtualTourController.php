<?php

namespace App\Http\Controllers;

use App\Models\VirtualTour;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class VirtualTourController extends Controller
{
    // FARMER METHODS

    // Farmer: View all published virtual tours
    public function farmerIndex()
    {
        $tours = VirtualTour::published()
            ->orderBy('published_at', 'desc')
            ->get();

        return Inertia::render('farmer/virtual-tour', [
            'tours' => $tours
        ]);
    }

    // ADMIN METHODS

    // Admin: View all virtual tours
    public function adminIndex()
    {
        $tours = VirtualTour::orderBy('created_at', 'desc')->get();

        $stats = [
            'total' => VirtualTour::count(),
            'published' => VirtualTour::published()->count(),
            'draft' => VirtualTour::whereNull('published_at')->count(),
        ];

        return Inertia::render('admin/virtual-tour', [
            'tours' => $tours,
            'stats' => $stats,
        ]);
    }

    // Admin: Create virtual tour
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'thumbnail' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:5120',
            'tour_url' => 'required|string',
            'tour_type' => 'required|in:iframe,redirect',
            'publish_now' => 'boolean',
        ]);

        $thumbnailPath = null;
        if ($request->hasFile('thumbnail')) {
            $thumbnailPath = $request->file('thumbnail')->store('virtual-tours', 'public');
        }

        VirtualTour::create([
            'user_id' => $request->user()->user_id,
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'thumbnail' => $thumbnailPath,
            'tour_url' => $validated['tour_url'],
            'tour_type' => $validated['tour_type'],
            'published_at' => ($validated['publish_now'] ?? true) ? now() : null,
        ]);

        return redirect()->back()->with('success', 'Lawatan maya berjaya dicipta');
    }

    // Admin: Update virtual tour
    public function update(Request $request, VirtualTour $tour)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'thumbnail' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:5120',
            'tour_url' => 'required|string',
            'tour_type' => 'required|in:iframe,redirect',
            'publish_now' => 'boolean',
        ]);

        $thumbnailPath = $tour->thumbnail;
        if ($request->hasFile('thumbnail')) {
            // Delete old thumbnail if exists
            if ($tour->thumbnail) {
                Storage::disk('public')->delete($tour->thumbnail);
            }
            $thumbnailPath = $request->file('thumbnail')->store('virtual-tours', 'public');
        }

        $tour->update([
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'thumbnail' => $thumbnailPath,
            'tour_url' => $validated['tour_url'],
            'tour_type' => $validated['tour_type'],
            'published_at' => ($validated['publish_now'] ?? true) ? ($tour->published_at ?? now()) : null,
        ]);

        return redirect()->back()->with('success', 'Lawatan maya berjaya dikemaskini');
    }

    // Admin: Delete virtual tour
    public function destroy(VirtualTour $tour)
    {
        // Delete thumbnail if exists
        if ($tour->thumbnail) {
            Storage::disk('public')->delete($tour->thumbnail);
        }

        $tour->delete();

        return redirect()->back()->with('success', 'Lawatan maya berjaya dipadam');
    }

    // Admin: Publish/Unpublish virtual tour
    public function togglePublish(VirtualTour $tour)
    {
        $tour->update([
            'published_at' => $tour->published_at ? null : now(),
        ]);

        $message = $tour->published_at ? 'Lawatan maya berjaya diterbitkan' : 'Lawatan maya berjaya dinyahterbitkan';
        return redirect()->back()->with('success', $message);
    }
}