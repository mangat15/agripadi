<?php

namespace App\Http\Controllers;

use App\Models\Report;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class ReportController extends Controller
{
    // Farmer: View all their reports
    public function farmerIndex(Request $request)
    {
        $reports = Report::where('user_id', $request->user()->user_id)
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('farmer/reports', [
            'reports' => $reports
        ]);
    }

    // Farmer: Create new report
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'type' => 'required|string|max:255',
            'description' => 'required|string',
            'location' => 'required|string|max:255',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:10240',
            'pdf_letter' => 'nullable|file|mimes:pdf|max:10240',
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('reports', 'public');
        }

        $pdfPath = null;
        if ($request->hasFile('pdf_letter')) {
            $pdfPath = $request->file('pdf_letter')->store('reports/letters', 'public');
        }

        Report::create([
            'user_id' => $request->user()->user_id,
            'title' => $validated['title'],
            'type' => $validated['type'],
            'description' => $validated['description'],
            'location' => $validated['location'],
            'image' => $imagePath,
            'pdf_letter' => $pdfPath,
            'status' => 'pending',
        ]);

        return redirect()->back()->with('success', 'Laporan berjaya dihantar');
    }

    // Farmer: Update their report
    public function update(Request $request, Report $report)
    {
        // Ensure user can only update their own report
        if ($report->user_id !== $request->user()->user_id) {
            return redirect()->back()->with('error', 'Anda tidak dibenarkan mengedit laporan ini');
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'type' => 'required|string|max:255',
            'description' => 'required|string',
            'location' => 'required|string|max:255',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:10240',
            'pdf_letter' => 'nullable|file|mimes:pdf|max:10240',
        ]);

        $updateData = [
            'title' => $validated['title'],
            'type' => $validated['type'],
            'description' => $validated['description'],
            'location' => $validated['location'],
        ];

        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($report->image) {
                Storage::disk('public')->delete($report->image);
            }
            $updateData['image'] = $request->file('image')->store('reports', 'public');
        }

        if ($request->hasFile('pdf_letter')) {
            // Delete old PDF if exists
            if ($report->pdf_letter) {
                Storage::disk('public')->delete($report->pdf_letter);
            }
            $updateData['pdf_letter'] = $request->file('pdf_letter')->store('reports/letters', 'public');
        }

        $report->update($updateData);

        return redirect()->back()->with('success', 'Laporan berjaya dikemaskini');
    }

    // Farmer: Delete their report
    public function destroy(Report $report, Request $request)
    {
        // Ensure user can only delete their own report
        if ($report->user_id !== $request->user()->user_id) {
            return redirect()->back()->with('error', 'Anda tidak dibenarkan memadam laporan ini');
        }

        // Delete image if exists
        if ($report->image) {
            Storage::disk('public')->delete($report->image);
        }

        // Delete PDF letter if exists
        if ($report->pdf_letter) {
            Storage::disk('public')->delete($report->pdf_letter);
        }

        $report->delete();

        return redirect()->back()->with('success', 'Laporan berjaya dipadam');
    }

    // Admin: View all reports
    public function adminIndex()
    {
        $reports = Report::with('user')->orderBy('created_at', 'desc')->get();

        return Inertia::render('admin/reports', [
            'reports' => $reports
        ]);
    }

    // Admin: View single report detail
    public function show(Report $report)
    {
        $report->load('user');

        return Inertia::render('admin/report-detail', [
            'report' => $report
        ]);
    }

    // Admin: Respond to report
    public function respond(Request $request, Report $report)
    {
        $validated = $request->validate([
            'admin_response' => 'required|string',
            'status' => 'required|in:pending,under_review,resolved',
        ]);

        $report->update([
            'admin_response' => $validated['admin_response'],
            'status' => $validated['status'],
            'responded_at' => now(),
        ]);

        return redirect()->back()->with('success', 'Maklum balas berjaya dihantar');
    }

    // Admin: Update report status
    public function updateStatus(Request $request, Report $report)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,under_review,resolved',
        ]);

        $report->update([
            'status' => $validated['status'],
        ]);

        return redirect()->back()->with('success', 'Status berjaya dikemaskini');
    }
}
