<?php

namespace App\Http\Controllers;

use App\Models\LearningMaterial;
use App\Models\Quiz;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class LearningMaterialController extends Controller
{
    // Admin: View all learning materials
    public function adminIndex()
    {
        $materials = LearningMaterial::with('uploader')
            ->latest()
            ->get();

        $categories = LearningMaterial::distinct()
            ->pluck('category')
            ->filter()
            ->values();

        // Also fetch quizzes for the Kuiz tab
        $quizzes = Quiz::with(['questions', 'learningMaterial', 'creator'])
            ->withCount('attempts')
            ->latest()
            ->get();

        return Inertia::render('admin/learning', [
            'materials' => $materials,
            'categories' => $categories,
            'quizzes' => $quizzes,
        ]);
    }

    // Admin: Store new learning material
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'type' => 'required|in:pdf,video',
            'category' => 'required|string|max:255',
            'file' => 'required_if:type,pdf|file|mimes:pdf|max:51200', // 50MB max for PDF
            'video_url' => 'required_if:type,video|url',
            'thumbnail' => 'nullable|image|max:2048', // 2MB max for thumbnail
        ]);

        $data = [
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'type' => $validated['type'],
            'category' => $validated['category'],
            'uploaded_by' => $request->user()->user_id,
        ];

        // Handle PDF upload
        if ($validated['type'] === 'pdf' && $request->hasFile('file')) {
            $filePath = $request->file('file')->store('learning-materials/pdfs', 'public');
            $data['file_path'] = $filePath;
        }

        // Handle YouTube video
        if ($validated['type'] === 'video') {
            $data['video_url'] = $validated['video_url'];
        }

        // Handle thumbnail upload
        if ($request->hasFile('thumbnail')) {
            $thumbnailPath = $request->file('thumbnail')->store('learning-materials/thumbnails', 'public');
            $data['thumbnail'] = $thumbnailPath;
        }

        LearningMaterial::create($data);

        return redirect()->route('admin.learning')->with('success', 'Bahan pembelajaran berjaya ditambah!');
    }

    // Admin: Delete learning material
    public function destroy(LearningMaterial $material)
    {
        // Delete files from storage
        if ($material->file_path) {
            Storage::disk('public')->delete($material->file_path);
        }
        if ($material->thumbnail) {
            Storage::disk('public')->delete($material->thumbnail);
        }

        $material->delete();

        return redirect()->route('admin.learning')->with('success', 'Bahan pembelajaran berjaya dipadam!');
    }

    // Farmer: View all learning materials
    public function farmerIndex()
    {
        $materials = LearningMaterial::with('uploader')
            ->latest()
            ->get();

        $categories = LearningMaterial::distinct()
            ->pluck('category')
            ->filter()
            ->values();

        return Inertia::render('farmer/learning', [
            'materials' => $materials,
            'categories' => $categories,
        ]);
    }
}