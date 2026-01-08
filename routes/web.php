<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use App\Http\Controllers\LearningMaterialController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\FeedbackController;
use App\Http\Controllers\ForumController;
use App\Http\Controllers\AnnouncementController;
use App\Http\Controllers\VirtualTourController;

// Public routes - Landing page
Route::get('/', function () {
    $stats = [
        'totalFarmers' => \App\Models\User::where('role', 0)->count(), // 0 = farmer
        'totalLearningMaterials' => \App\Models\LearningMaterial::count(),
        'totalForums' => \App\Models\Forum::where('status', 'approved')->count(),
    ];

    return Inertia::render('landing', [
        'stats' => $stats,
    ]);
})->name('home');

// Authenticated routes
Route::middleware(['auth'])->group(function () {

    // Default dashboard - redirect based on user role
    Route::get('dashboard', function (\Illuminate\Http\Request $request) {
        if ($request->user()->role === 1) { // 1 = admin, 0 = farmer
            return redirect()->route('admin.dashboard');
        }
        return redirect()->route('farmer.dashboard');
    })->name('dashboard');

    // Farmer routes
    Route::prefix('farmer')->name('farmer.')->group(function () {
        Route::get('/dashboard', function () {
            $stats = [
                'learning_materials' => \App\Models\LearningMaterial::count(),
                'active_farmers' => \App\Models\User::where('role', 0)->count(), // 0 = farmer
                'forum_topics' => \App\Models\Forum::where('status', 'approved')->count(),
            ];

            $recentActivities = collect([]);

            // Get latest learning material
            $latestLearning = \App\Models\LearningMaterial::latest()->first();
            if ($latestLearning) {
                $recentActivities->push([
                    'title' => 'Bahan pembelajaran baru: ' . $latestLearning->title,
                    'time' => $latestLearning->created_at->diffForHumans(),
                    'type' => 'learning',
                ]);
            }

            // Get latest approved forum
            $latestForum = \App\Models\Forum::where('status', 'approved')->latest('approved_at')->first();
            if ($latestForum) {
                $recentActivities->push([
                    'title' => 'Forum baru: ' . $latestForum->title,
                    'time' => $latestForum->approved_at ? \Carbon\Carbon::parse($latestForum->approved_at)->diffForHumans() : $latestForum->created_at->diffForHumans(),
                    'type' => 'forum',
                ]);
            }

            // Get latest announcement
            $latestAnnouncement = \App\Models\Announcement::whereNotNull('published_at')->latest('published_at')->first();
            if ($latestAnnouncement) {
                $recentActivities->push([
                    'title' => 'Pengumuman: ' . $latestAnnouncement->title,
                    'time' => \Carbon\Carbon::parse($latestAnnouncement->published_at)->diffForHumans(),
                    'type' => 'announcement',
                ]);
            }

            return Inertia::render('farmer/dashboard', [
                'stats' => $stats,
                'recentActivities' => $recentActivities->sortByDesc('time')->take(3)->values(),
            ]);
        })->name('dashboard');

        Route::get('/announcements', [AnnouncementController::class, 'farmerIndex'])->name('announcements');

        Route::get('/learning', [LearningMaterialController::class, 'farmerIndex'])->name('learning');

        Route::get('/virtual-tour', [VirtualTourController::class, 'farmerIndex'])->name('virtual-tour');

        Route::get('/reports', [ReportController::class, 'farmerIndex'])->name('reports');
        Route::post('/reports', [ReportController::class, 'store'])->middleware('throttle:10,1')->name('reports.store');
        Route::put('/reports/{report}', [ReportController::class, 'update'])->name('reports.update');
        Route::delete('/reports/{report}', [ReportController::class, 'destroy'])->name('reports.destroy');

        Route::get('/forum', [ForumController::class, 'farmerIndex'])->name('forum');
        Route::get('/forum/{forum}', [ForumController::class, 'show'])->name('forum.show');
        Route::post('/forum', [ForumController::class, 'store'])->middleware('throttle:10,1')->name('forum.store');
        Route::put('/forum/{forum}', [ForumController::class, 'update'])->name('forum.update');
        Route::delete('/forum/{forum}', [ForumController::class, 'destroy'])->name('forum.destroy');
        Route::post('/forum/{forum}/comment', [ForumController::class, 'addComment'])->name('forum.comment');
        Route::delete('/forum/comment/{comment}', [ForumController::class, 'deleteComment'])->name('forum.comment.delete');
        Route::post('/forum/{forum}/like', [ForumController::class, 'toggleLike'])->name('forum.like');

        Route::get('/feedback', [FeedbackController::class, 'farmerIndex'])->name('feedback');
        Route::post('/feedback', [FeedbackController::class, 'store'])->middleware('throttle:5,1')->name('feedback.store');

        Route::get('/profile', function () {
            return Inertia::render('farmer/profile');
        })->name('profile');
    });

    // Admin routes
    Route::prefix('admin')->name('admin.')->middleware('admin')->group(function () {
        Route::get('/dashboard', function () {
            $systemStats = [
                'totalUsers' => \App\Models\User::count(),
                'totalFarmers' => \App\Models\User::where('role', 0)->count(), // 0 = farmer
                'totalAdmins' => \App\Models\User::where('role', 1)->count(), // 1 = admin
                'pendingReports' => \App\Models\Report::where('status', 'pending')->count(),
                'inReviewReports' => \App\Models\Report::where('status', 'under_review')->count(),
                'resolvedReports' => \App\Models\Report::where('status', 'resolved')->count(),
                'forumPosts' => \App\Models\Forum::count(),
                'learningMaterials' => \App\Models\LearningMaterial::count(),
                'pendingForumPosts' => \App\Models\Forum::where('status', 'pending')->count(),
                'publishedAnnouncements' => \App\Models\Announcement::whereNotNull('published_at')->count(),
            ];

            $pendingReports = \App\Models\Report::where('status', 'pending')
                ->with('user')
                ->latest()
                ->take(5)
                ->get()
                ->map(function ($report) {
                    return [
                        'id' => $report->id,
                        'title' => $report->title,
                        'farmer' => $report->user->name,
                        'priority' => $report->priority ?? 'Medium',
                        'date' => $report->created_at->format('Y-m-d'),
                    ];
                });

            $recentUsers = \App\Models\User::latest()
                ->take(5)
                ->get()
                ->map(function ($user) {
                    return [
                        'name' => $user->name,
                        'role' => $user->role === 1 ? 'Admin' : 'Farmer',
                        'date' => $user->created_at ? $user->created_at->format('Y-m-d') : 'N/A',
                    ];
                });

            return Inertia::render('admin/dashboard', [
                'systemStats' => $systemStats,
                'pendingReports' => $pendingReports,
                'recentUsers' => $recentUsers,
            ]);
        })->name('dashboard');

        Route::get('/users', [UserController::class, 'index'])->name('users');
        Route::post('/users', [UserController::class, 'store'])->name('users.store');
        Route::put('/users/{user}', [UserController::class, 'update'])->name('users.update');
        Route::delete('/users/{user}', [UserController::class, 'destroy'])->name('users.destroy');

        Route::get('/announcements', [AnnouncementController::class, 'adminIndex'])->name('announcements');
        Route::post('/announcements', [AnnouncementController::class, 'store'])->name('announcements.store');
        Route::put('/announcements/{announcement}', [AnnouncementController::class, 'update'])->name('announcements.update');
        Route::delete('/announcements/{announcement}', [AnnouncementController::class, 'destroy'])->name('announcements.destroy');
        Route::post('/announcements/{announcement}/toggle-publish', [AnnouncementController::class, 'togglePublish'])->name('announcements.toggle-publish');

        Route::get('/learning', [LearningMaterialController::class, 'adminIndex'])->name('learning');
        Route::post('/learning', [LearningMaterialController::class, 'store'])->name('learning.store');
        Route::delete('/learning/{material}', [LearningMaterialController::class, 'destroy'])->name('learning.destroy');

        Route::get('/virtual-tour', [VirtualTourController::class, 'adminIndex'])->name('virtual-tour');
        Route::post('/virtual-tour', [VirtualTourController::class, 'store'])->name('virtual-tour.store');
        Route::put('/virtual-tour/{tour}', [VirtualTourController::class, 'update'])->name('virtual-tour.update');
        Route::delete('/virtual-tour/{tour}', [VirtualTourController::class, 'destroy'])->name('virtual-tour.destroy');
        Route::post('/virtual-tour/{tour}/toggle-publish', [VirtualTourController::class, 'togglePublish'])->name('virtual-tour.toggle-publish');

        Route::get('/reports', [ReportController::class, 'adminIndex'])->name('reports');
        Route::get('/reports/{report}', [ReportController::class, 'show'])->name('reports.show');
        Route::post('/reports/{report}/respond', [ReportController::class, 'respond'])->name('reports.respond');
        Route::put('/reports/{report}/status', [ReportController::class, 'updateStatus'])->name('reports.status');

        Route::get('/forum', [ForumController::class, 'adminIndex'])->name('forum');
        Route::post('/forum/{forum}/approve', [ForumController::class, 'approve'])->name('forum.approve');
        Route::post('/forum/{forum}/reject', [ForumController::class, 'reject'])->name('forum.reject');
        Route::delete('/forum/{forum}', [ForumController::class, 'adminDelete'])->name('forum.delete');

        Route::get('/feedback', [FeedbackController::class, 'adminIndex'])->name('feedback');
        Route::put('/feedback/{feedback}/read', [FeedbackController::class, 'markAsRead'])->name('feedback.read');
        Route::post('/feedback/{feedback}/notes', [FeedbackController::class, 'addNotes'])->name('feedback.notes');
        Route::delete('/feedback/{feedback}', [FeedbackController::class, 'destroy'])->name('feedback.destroy');
    });
});

require __DIR__.'/settings.php';
