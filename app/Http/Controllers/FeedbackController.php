<?php

namespace App\Http\Controllers;

use App\Models\Feedback;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FeedbackController extends Controller
{
    // Farmer: View feedback page
    public function farmerIndex()
    {
        return Inertia::render('farmer/feedback');
    }

    // Farmer: Submit feedback
    public function store(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|in:positive,improvement',
            'message' => 'required|string',
            'rating' => 'nullable|integer|min:1|max:5',
            'feature' => 'nullable|string|max:255',
        ]);

        // Automatically categorize based on rating if provided
        $type = $validated['type'];
        if (isset($validated['rating']) && $validated['rating'] !== null) {
            // 4 and 5 stars = positive, 1-3 stars = improvement
            $type = $validated['rating'] >= 4 ? 'positive' : 'improvement';
        }

        Feedback::create([
            'user_id' => $request->user()->user_id,
            'type' => $type,
            'message' => $validated['message'],
            'rating' => $validated['rating'] ?? null,
            'feature' => $validated['feature'] ?? null,
        ]);

        return redirect()->back()->with('success', 'Terima kasih atas maklum balas anda!');
    }

    // Admin: View all feedback
    public function adminIndex(Request $request)
    {
        $query = Feedback::with('user')->orderBy('created_at', 'desc');

        // Filter by type if specified
        if ($request->has('type') && in_array($request->type, ['positive', 'improvement'])) {
            $query->where('type', $request->type);
        }

        // Filter by read status
        if ($request->has('is_read')) {
            $query->where('is_read', $request->is_read === 'true');
        }

        $feedback = $query->get()->map(function ($item) {
            return [
                'id' => $item->id,
                'type' => $item->type,
                'message' => $item->message,
                'rating' => $item->rating,
                'feature' => $item->feature,
                'is_read' => $item->is_read,
                'admin_notes' => $item->admin_notes,
                'created_at' => $item->created_at ? $item->created_at->toISOString() : null,
                'user' => $item->user ? [
                    'user_id' => $item->user->user_id,
                    'name' => $item->user->name,
                    'email' => $item->user->email,
                ] : null,
            ];
        });

        // Calculate statistics
        $stats = [
            'total' => Feedback::count(),
            'positive' => Feedback::where('type', 'positive')->count(),
            'improvement' => Feedback::where('type', 'improvement')->count(),
            'unread' => Feedback::where('is_read', false)->count(),
            'average_rating' => round(Feedback::whereNotNull('rating')->avg('rating') ?? 0, 1),
        ];

        // Feature satisfaction breakdown
        $featureSatisfaction = Feedback::whereNotNull('feature')
            ->whereNotNull('rating')
            ->selectRaw('feature, AVG(rating) as avg_rating, COUNT(*) as count')
            ->groupBy('feature')
            ->get()
            ->map(function ($item) {
                return [
                    'feature' => $item->feature,
                    'avg_rating' => round($item->avg_rating, 1),
                    'count' => $item->count,
                ];
            });

        return Inertia::render('admin/feedback', [
            'feedback' => $feedback,
            'stats' => $stats,
            'featureSatisfaction' => $featureSatisfaction,
        ]);
    }

    // Admin: Mark feedback as read
    public function markAsRead(Feedback $feedback)
    {
        $feedback->update(['is_read' => true]);

        return redirect()->back();
    }

    // Admin: Add notes to feedback
    public function addNotes(Request $request, Feedback $feedback)
    {
        $validated = $request->validate([
            'admin_notes' => 'required|string',
        ]);

        $feedback->update([
            'admin_notes' => $validated['admin_notes'],
            'is_read' => true,
        ]);

        return redirect()->back()->with('success', 'Nota berjaya ditambah');
    }

    // Admin: Delete feedback
    public function destroy(Feedback $feedback)
    {
        $feedback->delete();

        return redirect()->back()->with('success', 'Maklum balas berjaya dipadam');
    }
}