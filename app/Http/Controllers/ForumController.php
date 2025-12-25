<?php

namespace App\Http\Controllers;

use App\Models\Forum;
use App\Models\ForumComment;
use App\Models\ForumLike;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ForumController extends Controller
{
    // FARMER METHODS

    // Farmer: View all approved forums
    public function farmerIndex(Request $request)
    {
        $forums = Forum::approved()
            ->withCount('comments', 'likes')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($forum) use ($request) {
                $forum->is_liked = $forum->isLikedBy($request->user());
                return $forum;
            });

        return Inertia::render('farmer/forum', [
            'forums' => $forums
        ]);
    }

    // Farmer: View single forum with comments
    public function show(Forum $forum, Request $request)
    {
        // Only allow viewing approved forums
        if ($forum->status !== 'approved' && $forum->user_id !== $request->user()->user_id) {
            abort(404);
        }

        $forum->load('comments.user');
        $forum->is_liked = $forum->isLikedBy($request->user());

        return Inertia::render('farmer/forum-detail', [
            'forum' => $forum
        ]);
    }

    // Farmer: Create new forum post
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'category' => 'nullable|string|max:255',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:5120', // max 5MB
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('forum-images', 'public');
        }

        Forum::create([
            'user_id' => $request->user()->user_id,
            'title' => $validated['title'],
            'content' => $validated['content'],
            'image' => $imagePath,
            'category' => $validated['category'] ?? null,
            'status' => 'pending', // Needs admin approval
        ]);

        return redirect()->back()->with('success', 'Forum anda telah dihantar untuk semakan pentadbir');
    }

    // Farmer: Update their forum post (only if pending)
    public function update(Request $request, Forum $forum)
    {
        // Only allow update if it's their own forum and status is pending
        if ($forum->user_id !== $request->user()->user_id) {
            return redirect()->back()->with('error', 'Anda tidak dibenarkan mengedit forum ini');
        }

        if ($forum->status !== 'pending') {
            return redirect()->back()->with('error', 'Hanya forum yang belum diluluskan boleh diedit');
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'category' => 'nullable|string|max:255',
        ]);

        $forum->update([
            'title' => $validated['title'],
            'content' => $validated['content'],
            'category' => $validated['category'] ?? null,
        ]);

        return redirect()->back()->with('success', 'Forum berjaya dikemaskini');
    }

    // Farmer: Delete their forum post
    public function destroy(Forum $forum, Request $request)
    {
        // Only allow delete if it's their own forum
        if ($forum->user_id !== $request->user()->user_id) {
            return redirect()->back()->with('error', 'Anda tidak dibenarkan memadam forum ini');
        }

        $forum->delete();

        return redirect()->route('farmer.forum')->with('success', 'Forum berjaya dipadam');
    }

    // Farmer: Add comment to forum
    public function addComment(Request $request, Forum $forum)
    {
        // Only allow comments on approved forums
        if ($forum->status !== 'approved') {
            return redirect()->back()->with('error', 'Tidak boleh komen pada forum yang belum diluluskan');
        }

        $validated = $request->validate([
            'content' => 'required|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:5120', // max 5MB
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('forum-comments', 'public');
        }

        ForumComment::create([
            'forum_id' => $forum->id,
            'user_id' => $request->user()->user_id,
            'content' => $validated['content'],
            'image' => $imagePath,
        ]);

        // Increment comments count
        $forum->increment('comments_count');

        return redirect()->back();
    }

    // Farmer: Delete their own comment
    public function deleteComment(ForumComment $comment, Request $request)
    {
        // Only allow delete if it's their own comment
        if ($comment->user_id !== $request->user()->user_id) {
            return redirect()->back()->with('error', 'Anda tidak dibenarkan memadam komen ini');
        }

        $forumId = $comment->forum_id;
        $comment->delete();

        // Decrement comments count
        Forum::find($forumId)?->decrement('comments_count');

        return redirect()->back()->with('success', 'Komen berjaya dipadam');
    }

    // Farmer: Like/Unlike forum
    public function toggleLike(Forum $forum, Request $request)
    {
        // Only allow likes on approved forums
        if ($forum->status !== 'approved') {
            return redirect()->back()->with('error', 'Tidak boleh like forum yang belum diluluskan');
        }

        $user = $request->user();
        $existingLike = ForumLike::where('forum_id', $forum->id)
            ->where('user_id', $user->user_id)
            ->first();

        if ($existingLike) {
            // Unlike
            $existingLike->delete();
            $forum->decrement('likes_count');
        } else {
            // Like
            ForumLike::create([
                'forum_id' => $forum->id,
                'user_id' => $user->user_id,
            ]);
            $forum->increment('likes_count');
        }

        return redirect()->back();
    }

    // ADMIN METHODS

    // Admin: View all forums (pending, approved, rejected)
    public function adminIndex()
    {
        $forums = Forum::withCount('comments', 'likes')
            ->orderBy('created_at', 'desc')
            ->get();

        $stats = [
            'total' => Forum::count(),
            'pending' => Forum::where('status', 'pending')->count(),
            'approved' => Forum::where('status', 'approved')->count(),
            'rejected' => Forum::where('status', 'rejected')->count(),
        ];

        return Inertia::render('admin/forum', [
            'forums' => $forums,
            'stats' => $stats,
        ]);
    }

    // Admin: Approve forum
    public function approve(Forum $forum, Request $request)
    {
        $forum->update([
            'status' => 'approved',
            'approved_at' => now(),
            'approved_by' => $request->user()->user_id,
        ]);

        return redirect()->back()->with('success', 'Forum berjaya diluluskan');
    }

    // Admin: Reject forum
    public function reject(Request $request, Forum $forum)
    {
        $validated = $request->validate([
            'rejection_reason' => 'nullable|string',
        ]);

        $forum->update([
            'status' => 'rejected',
            'rejection_reason' => $validated['rejection_reason'] ?? null,
        ]);

        return redirect()->back()->with('success', 'Forum telah ditolak');
    }

    // Admin: Delete forum
    public function adminDelete(Forum $forum)
    {
        $forum->delete();

        return redirect()->back()->with('success', 'Forum berjaya dipadam');
    }
}