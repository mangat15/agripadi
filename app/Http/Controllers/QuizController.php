<?php

namespace App\Http\Controllers;

use App\Models\Quiz;
use App\Models\QuizQuestion;
use App\Models\QuizAttempt;
use App\Models\LearningMaterial;
use Illuminate\Http\Request;
use Inertia\Inertia;

/**
 * QuizController - Handles all quiz-related operations for both admin and farmers
 *
 * This controller manages:
 * - Admin: CRUD operations for quizzes and questions
 * - Farmer: Viewing quizzes, taking quizzes, submitting answers, and viewing results
 *
 * Route Examples:
 * - Admin: /admin/quiz, /admin/quiz/create, /admin/quiz/{id}/edit
 * - Farmer: /farmer/quiz, /farmer/quiz/{id}, /farmer/quiz/{id}/submit
 */
class QuizController extends Controller
{
    /**
     * ADMIN: Display all quizzes with statistics
     *
     * Purpose: Shows admin a list of all quizzes (active & inactive) with:
     * - Related questions, learning materials, and creator info
     * - Number of attempts by users
     * - Available categories for filtering
     *
     * Route: GET /admin/quiz
     * View: resources/js/pages/admin/quiz.tsx
     *
     * @return \Inertia\Response
     */
    public function adminIndex()
    {
        // Fetch all quizzes with related data
        // - 'questions': Get all questions for each quiz
        // - 'learningMaterial': Get linked learning material (if any)
        // - 'creator': Get the user who created this quiz
        // - 'withCount('attempts')': Count how many times users attempted this quiz
        // - 'latest()': Sort by newest first
        $quizzes = Quiz::with(['questions', 'learningMaterial', 'creator'])
            ->withCount('attempts')
            ->latest()
            ->get();

        // Get unique categories from learning materials for filtering
        // - 'distinct()': Get unique values only
        // - 'pluck('category')': Extract only the category column
        // - 'filter()': Remove null/empty values
        // - 'values()': Reset array keys
        $categories = LearningMaterial::distinct()
            ->pluck('category')
            ->filter()
            ->values();

        // Render the admin quiz page with data
        return Inertia::render('admin/quiz', [
            'quizzes' => $quizzes,
            'categories' => $categories,
        ]);
    }

    /**
     * ADMIN: Show the form to create a new quiz
     *
     * Purpose: Display empty form for creating quiz with:
     * - Available categories to choose from
     * - List of learning materials to optionally link
     *
     * Route: GET /admin/quiz/create
     * View: resources/js/pages/admin/quiz-create.tsx
     *
     * @return \Inertia\Response
     */
    public function create()
    {
        // Get unique categories from learning materials
        $categories = LearningMaterial::distinct()
            ->pluck('category')
            ->filter()
            ->values();

        // Get all learning materials sorted by category and title
        // Admin can optionally link quiz to a specific learning material
        $learningMaterials = LearningMaterial::select('id', 'title', 'category')
            ->orderBy('category')
            ->orderBy('title')
            ->get();

        // Render the create quiz form
        return Inertia::render('admin/quiz-create', [
            'categories' => $categories,
            'learningMaterials' => $learningMaterials,
        ]);
    }

    /**
     * ADMIN: Store a newly created quiz with questions
     *
     * Purpose: Save quiz to database with all questions
     *
     * Process:
     * 1. Validate incoming data (title, category, questions, etc.)
     * 2. Create quiz record
     * 3. Loop through questions and create each one
     * 4. Redirect back to quiz list
     *
     * Route: POST /admin/quiz
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request)
    {
        // Validate all incoming data
        $validated = $request->validate([
            'title' => 'required|string|max:255',                          // Quiz title (required)
            'description' => 'nullable|string',                            // Quiz description (optional)
            'category' => 'required|string|max:255',                       // Category like "Serangga Perosak" (required)
            'learning_material_id' => 'nullable|exists:learning_materials,id', // Link to material (optional)
            'passing_score' => 'required|integer|min:0|max:100',          // Percentage needed to pass (required)
            'time_limit' => 'nullable|integer|min:1',                     // Time limit in minutes (optional)
            'is_active' => 'boolean',                                     // Is quiz active for farmers? (optional)
            'questions' => 'required|array|min:1',                        // Must have at least 1 question (required)
            'questions.*.question' => 'required|string',                  // Question text (required)
            'questions.*.options' => 'required|array|size:4',             // Must have exactly 4 options (required)
            'questions.*.options.*' => 'required|string',                 // Each option must be text (required)
            'questions.*.correct_answer' => 'required|integer|min:0|max:3', // Index of correct answer 0-3 (required)
            'questions.*.explanation' => 'nullable|string',               // Explanation for answer (optional)
        ]);

        // Create the quiz record in database
        $quiz = Quiz::create([
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,           // Use null if not provided
            'category' => $validated['category'],
            'learning_material_id' => $validated['learning_material_id'] ?? null,
            'passing_score' => $validated['passing_score'],
            'time_limit' => $validated['time_limit'] ?? null,
            'is_active' => $validated['is_active'] ?? true,               // Default to true (active)
            'created_by' => $request->user()->user_id,                    // Current admin user ID
        ]);

        // Create each question and link to the quiz
        // $index is used to set the question order (0, 1, 2, etc.)
        foreach ($validated['questions'] as $index => $questionData) {
            QuizQuestion::create([
                'quiz_id' => $quiz->id,                                   // Link to the quiz we just created
                'question' => $questionData['question'],
                'options' => $questionData['options'],                    // Array of 4 options
                'correct_answer' => $questionData['correct_answer'],      // Index 0-3
                'explanation' => $questionData['explanation'] ?? null,
                'order' => $index,                                        // 0, 1, 2, 3... (question order)
            ]);
        }

        // Redirect to quiz list with success message
        return redirect()->route('admin.quiz')->with('success', 'Kuiz berjaya dicipta!');
    }

    /**
     * ADMIN: Show the form to edit an existing quiz
     *
     * Purpose: Display form pre-filled with quiz data for editing
     *
     * Route: GET /admin/quiz/{quiz}/edit
     * View: resources/js/pages/admin/quiz-edit.tsx
     *
     * @param \App\Models\Quiz $quiz - Laravel auto-finds quiz by ID from URL
     * @return \Inertia\Response
     */
    public function edit(Quiz $quiz)
    {
        // Load quiz questions (eager loading for better performance)
        $quiz->load('questions');

        // Get available categories for dropdown
        $categories = LearningMaterial::distinct()
            ->pluck('category')
            ->filter()
            ->values();

        // Get all learning materials for linking
        $learningMaterials = LearningMaterial::select('id', 'title', 'category')
            ->orderBy('category')
            ->orderBy('title')
            ->get();

        // Render edit form with existing quiz data
        return Inertia::render('admin/quiz-edit', [
            'quiz' => $quiz,                           // Existing quiz with questions
            'categories' => $categories,
            'learningMaterials' => $learningMaterials,
        ]);
    }

    /**
     * ADMIN: Update an existing quiz and its questions
     *
     * Purpose: Save changes to quiz
     *
     * Process:
     * 1. Validate incoming data
     * 2. Update quiz record
     * 3. Delete all old questions
     * 4. Create new questions from form
     * 5. Redirect back to quiz list
     *
     * Note: We delete and recreate questions instead of updating them
     *       because it's simpler and questions may be added/removed
     *
     * Route: PUT /admin/quiz/{quiz}
     *
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\Quiz $quiz
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(Request $request, Quiz $quiz)
    {
        // Validate all incoming data (same rules as store)
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category' => 'required|string|max:255',
            'learning_material_id' => 'nullable|exists:learning_materials,id',
            'passing_score' => 'required|integer|min:0|max:100',
            'time_limit' => 'nullable|integer|min:1',
            'is_active' => 'boolean',
            'questions' => 'required|array|min:1',
            'questions.*.question' => 'required|string',
            'questions.*.options' => 'required|array|size:4',
            'questions.*.options.*' => 'required|string',
            'questions.*.correct_answer' => 'required|integer|min:0|max:3',
            'questions.*.explanation' => 'nullable|string',
        ]);

        // Update the quiz record (basic info only)
        $quiz->update([
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'category' => $validated['category'],
            'learning_material_id' => $validated['learning_material_id'] ?? null,
            'passing_score' => $validated['passing_score'],
            'time_limit' => $validated['time_limit'] ?? null,
            'is_active' => $validated['is_active'] ?? true,
        ]);

        // Delete all existing questions for this quiz
        // This is simpler than trying to update/add/remove individual questions
        // Due to cascade delete in database, this is safe
        $quiz->questions()->delete();

        // Create new questions from the form
        foreach ($validated['questions'] as $index => $questionData) {
            QuizQuestion::create([
                'quiz_id' => $quiz->id,
                'question' => $questionData['question'],
                'options' => $questionData['options'],
                'correct_answer' => $questionData['correct_answer'],
                'explanation' => $questionData['explanation'] ?? null,
                'order' => $index,
            ]);
        }

        // Redirect to quiz list with success message
        return redirect()->route('admin.quiz')->with('success', 'Kuiz berjaya dikemaskini!');
    }

    /**
     * ADMIN: Delete a quiz
     *
     * Purpose: Remove quiz and all related questions and attempts from database
     *
     * Note: Due to cascade delete in database:
     * - All quiz questions will be deleted automatically
     * - All quiz attempts will be deleted automatically
     *
     * Route: DELETE /admin/quiz/{quiz}
     *
     * @param \App\Models\Quiz $quiz
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(Quiz $quiz)
    {
        // Delete quiz (questions and attempts will be deleted automatically due to cascade)
        $quiz->delete();

        // Redirect back with success message
        return redirect()->route('admin.quiz')->with('success', 'Kuiz berjaya dipadam!');
    }

    /**
     * FARMER: Display all active quizzes with user's attempt history
     *
     * Purpose: Show farmers list of available quizzes to take
     *
     * Features:
     * - Only shows active quizzes (is_active = true)
     * - Shows user's previous attempts and scores
     * - Shows which quizzes they passed/failed
     * - Category filtering available
     *
     * Route: GET /farmer/quiz
     * View: resources/js/pages/farmer/quiz.tsx
     *
     * @return \Inertia\Response
     */
    public function farmerIndex()
    {
        // Get only active quizzes with related learning material and question count
        $quizzes = Quiz::with('learningMaterial')              // Get linked material
            ->where('is_active', true)                         // Only show active quizzes
            ->withCount('questions')                           // Count how many questions
            ->latest()                                         // Sort by newest first
            ->get();

        // Get categories for filtering
        $categories = LearningMaterial::distinct()
            ->pluck('category')
            ->filter()
            ->values();

        // Get current user's quiz attempts
        $userId = auth()->user()->user_id;

        // Fetch all attempts by this user
        // Group by quiz_id and get only the most recent attempt for each quiz
        $attempts = QuizAttempt::where('user_id', $userId)
            ->select('quiz_id', 'score', 'passed', 'completed_at')
            ->get()
            ->groupBy('quiz_id')                               // Group by quiz
            ->map(function ($attempts) {
                // For each quiz, return only the latest attempt
                return $attempts->sortByDesc('completed_at')->first();
            });

        // Render farmer quiz list page
        return Inertia::render('farmer/quiz', [
            'quizzes' => $quizzes,
            'categories' => $categories,
            'attempts' => $attempts,                           // User's previous attempts
        ]);
    }

    /**
     * FARMER: Start taking a quiz
     *
     * Purpose: Display quiz questions for farmer to answer
     *
     * Security:
     * - Checks if quiz is active
     * - Hides correct answers from questions (only shows question and options)
     *
     * Route: GET /farmer/quiz/{quiz}
     * View: resources/js/pages/farmer/quiz-take.tsx
     *
     * @param \App\Models\Quiz $quiz
     * @return \Inertia\Response|\Illuminate\Http\RedirectResponse
     */
    public function show(Quiz $quiz)
    {
        // Security check: Only allow active quizzes
        if (!$quiz->is_active) {
            return redirect()->route('farmer.quiz')->with('error', 'Kuiz ini tidak aktif.');
        }

        // Load all questions for this quiz
        $quiz->load('questions');

        // IMPORTANT: Hide correct answers from farmers!
        // Transform questions to only include safe data
        // This prevents farmers from seeing the correct answer in browser console
        $quiz->questions->transform(function ($question) {
            return [
                'id' => $question->id,                         // Question ID (needed for submission)
                'question' => $question->question,             // Question text
                'options' => $question->options,               // Array of 4 options
                'order' => $question->order,                   // Question order
                // NOT included: 'correct_answer', 'explanation'
            ];
        });

        // Render quiz taking page
        return Inertia::render('farmer/quiz-take', [
            'quiz' => $quiz,                                   // Quiz with questions (no answers)
        ]);
    }

    /**
     * FARMER: Submit quiz answers and calculate score
     *
     * Purpose: Process farmer's answers and save attempt to database
     *
     * Process:
     * 1. Validate submitted answers
     * 2. Load correct answers from database
     * 3. Compare user answers with correct answers
     * 4. Calculate score percentage
     * 5. Determine pass/fail based on passing_score
     * 6. Save attempt to database
     * 7. Redirect to results page
     *
     * Route: POST /farmer/quiz/{quiz}/submit
     *
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\Quiz $quiz
     * @return \Illuminate\Http\RedirectResponse
     */
    public function submit(Request $request, Quiz $quiz)
    {
        // Validate submitted answers
        $validated = $request->validate([
            'answers' => 'required|array',                     // Array of answers
            'answers.*' => 'required|integer|min:0|max:3',    // Each answer must be 0-3 (A,B,C,D)
            'started_at' => 'required|date',                  // When user started quiz
        ]);

        // Load questions with correct answers from database
        $quiz->load('questions');

        // Calculate how many questions they got correct
        $totalQuestions = $quiz->questions->count();
        $correctAnswers = 0;

        // Loop through each question and check if answer is correct
        foreach ($quiz->questions as $question) {
            // Get user's answer for this question (null if not answered)
            $userAnswer = $validated['answers'][$question->id] ?? null;

            // Compare with correct answer
            if ($userAnswer === $question->correct_answer) {
                $correctAnswers++;                             // Increment correct count
            }
        }

        // Calculate score as percentage
        // Example: 8 correct out of 10 = (8/10) * 100 = 80%
        $score = ($correctAnswers / $totalQuestions) * 100;

        // Determine if user passed
        // Example: If passing_score is 70% and user got 80%, they passed
        $passed = $score >= $quiz->passing_score;

        // Save attempt to database
        $attempt = QuizAttempt::create([
            'quiz_id' => $quiz->id,
            'user_id' => $request->user()->user_id,
            'answers' => $validated['answers'],                // Store user's answers
            'score' => round($score),                          // Round to nearest whole number
            'passed' => $passed,                               // true or false
            'started_at' => $validated['started_at'],
            'completed_at' => now(),                           // Current timestamp
        ]);

        // Redirect to results page to show how they did
        return redirect()->route('farmer.quiz.result', $attempt->id);
    }

    /**
     * FARMER: View quiz results with detailed feedback
     *
     * Purpose: Show farmer their score and review all questions with answers
     *
     * Features:
     * - Shows score and pass/fail status
     * - Shows all questions with:
     *   - User's selected answer
     *   - Correct answer
     *   - Whether they got it right/wrong
     *   - Explanation (if provided by admin)
     *
     * Security:
     * - Users can only view their own attempts (not others')
     *
     * Route: GET /farmer/quiz-result/{attempt}
     * View: resources/js/pages/farmer/quiz-result.tsx
     *
     * @param \App\Models\QuizAttempt $attempt
     * @return \Inertia\Response
     */
    public function result(QuizAttempt $attempt)
    {
        // Security check: Ensure user can only view their own attempts
        if ($attempt->user_id !== auth()->user()->user_id) {
            abort(403);                                        // Return "403 Forbidden" error
        }

        // Load quiz and all questions
        $attempt->load(['quiz.questions']);

        // Add detailed results to each question
        // Compare user's answers with correct answers
        $questionsWithResults = $attempt->quiz->questions->map(function ($question) use ($attempt) {
            // Get user's answer for this question from attempt data
            $userAnswer = $attempt->answers[$question->id] ?? null;

            return [
                'id' => $question->id,
                'question' => $question->question,             // Question text
                'options' => $question->options,               // 4 options
                'correct_answer' => $question->correct_answer, // Which option is correct (0-3)
                'user_answer' => $userAnswer,                  // Which option user selected
                'is_correct' => $userAnswer === $question->correct_answer, // Did they get it right?
                'explanation' => $question->explanation,       // Why this answer is correct
            ];
        });

        // Render results page
        return Inertia::render('farmer/quiz-result', [
            'attempt' => $attempt,                             // Attempt with score, passed, etc.
            'questions' => $questionsWithResults,              // Questions with correct/incorrect info
        ]);
    }
}
