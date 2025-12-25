# Quiz System Documentation

## Table of Contents
1. [System Overview](#system-overview)
2. [Database Structure](#database-structure)
3. [How It Works](#how-it-works)
4. [Backend Explanation](#backend-explanation)
5. [Frontend Explanation](#frontend-explanation)
6. [Code Flow Examples](#code-flow-examples)

---

## System Overview

The Quiz System allows admins to create interactive quizzes for farmers to test their agricultural knowledge.

### Key Features:
- **Admin Features:**
  - Create quizzes with multiple-choice questions (4 options each)
  - Organize quizzes by categories (e.g., "Serangga Perosak", "Pengurusan Tanaman")
  - Set passing score percentage (e.g., 70% to pass)
  - Set time limits (optional)
  - Enable/disable quizzes
  - View quiz attempt statistics

- **Farmer Features:**
  - Browse available quizzes by category
  - Take timed quizzes with countdown timer
  - See previous attempt scores
  - Retry quizzes unlimited times
  - View detailed results with explanations

---

## Database Structure

### 1. `quizzes` Table
Stores quiz information

| Column | Type | Description | Example |
|--------|------|-------------|---------|
| `id` | bigint | Primary key | 1 |
| `title` | string | Quiz title | "Kuiz Serangga Perosak" |
| `description` | text (nullable) | Quiz description | "Uji pengetahuan anda..." |
| `category` | string | Category name | "Serangga Perosak" |
| `learning_material_id` | bigint (nullable) | FK to learning_materials | 5 |
| `passing_score` | integer | Percentage to pass | 70 |
| `time_limit` | integer (nullable) | Minutes allowed | 30 |
| `is_active` | boolean | Is quiz active? | true |
| `created_by` | bigint | FK to users (admin) | 2 |
| `created_at` | timestamp | When created | 2025-11-23 19:30:00 |
| `updated_at` | timestamp | Last updated | 2025-11-23 19:30:00 |

### 2. `quiz_questions` Table
Stores questions for each quiz

| Column | Type | Description | Example |
|--------|------|-------------|---------|
| `id` | bigint | Primary key | 1 |
| `quiz_id` | bigint | FK to quizzes | 1 |
| `question` | text | Question text | "Apakah serangga perosak utama padi?" |
| `options` | json | Array of 4 options | `["Anai-anai", "Wereng", "Lalat", "Lipas"]` |
| `correct_answer` | integer | Index of correct answer (0-3) | 1 (means "Wereng" is correct) |
| `explanation` | text (nullable) | Why answer is correct | "Wereng adalah..." |
| `order` | integer | Question order | 0, 1, 2, 3... |
| `created_at` | timestamp | When created | 2025-11-23 19:30:00 |
| `updated_at` | timestamp | Last updated | 2025-11-23 19:30:00 |

**Important:** The `correct_answer` field stores the **index** (0-3) of the correct option:
- 0 = First option (A)
- 1 = Second option (B)
- 2 = Third option (C)
- 3 = Fourth option (D)

### 3. `quiz_attempts` Table
Stores user quiz attempts and results

| Column | Type | Description | Example |
|--------|------|-------------|---------|
| `id` | bigint | Primary key | 1 |
| `quiz_id` | bigint | FK to quizzes | 1 |
| `user_id` | bigint | FK to users (farmer) | 10 |
| `answers` | json | User's answers | `{"1": 1, "2": 0, "3": 2}` |
| `score` | integer | Score percentage | 80 |
| `passed` | boolean | Did user pass? | true |
| `started_at` | timestamp | When quiz started | 2025-11-23 20:00:00 |
| `completed_at` | timestamp | When quiz completed | 2025-11-23 20:25:00 |
| `created_at` | timestamp | Record created | 2025-11-23 20:25:00 |
| `updated_at` | timestamp | Record updated | 2025-11-23 20:25:00 |

**Answers JSON Format:**
```json
{
  "1": 1,  // Question ID 1: User selected option B (index 1)
  "2": 0,  // Question ID 2: User selected option A (index 0)
  "3": 2   // Question ID 3: User selected option C (index 2)
}
```

---

## How It Works

### Admin Creates a Quiz

1. **Admin opens create quiz form** (`/admin/quiz/create`)
   - Form loads with categories from learning materials
   - Form loads list of learning materials to optionally link

2. **Admin fills in quiz details:**
   - Title: "Kuiz Serangga Perosak"
   - Description: "Uji pengetahuan tentang serangga..."
   - Category: Select "Serangga Perosak" or create new
   - Passing score: 70%
   - Time limit: 30 minutes (optional)
   - Is active: ✓ (checked)

3. **Admin adds questions:**
   - Click "Tambah Soalan" to add question
   - Enter question text
   - Enter 4 options (A, B, C, D)
   - Click ✓ button on correct answer
   - Optionally add explanation
   - Can add unlimited questions

4. **Admin clicks "Cipta Kuiz"**
   - Frontend sends data to `POST /admin/quiz`
   - Backend validates all data
   - Backend creates quiz record in `quizzes` table
   - Backend creates question records in `quiz_questions` table
   - Redirects to quiz list page

### Farmer Takes a Quiz

1. **Farmer browses quizzes** (`/farmer/quiz`)
   - Sees list of active quizzes
   - Sees their previous attempt scores (if any)
   - Can filter by category

2. **Farmer clicks "Mula Kuiz"**
   - Navigates to `/farmer/quiz/{id}`
   - Backend loads quiz with questions
   - **IMPORTANT:** Backend removes `correct_answer` field before sending to frontend (security)
   - Frontend shows first question with 4 options

3. **Farmer answers questions:**
   - Timer starts counting down (if time limit set)
   - Farmer selects option A, B, C, or D
   - Can navigate between questions using prev/next buttons
   - Can jump to any question using numbered buttons
   - Progress bar shows completion percentage

4. **Farmer clicks "Hantar Jawapan"**
   - Frontend sends answers to `POST /farmer/quiz/{id}/submit`
   - Answers format: `{ "1": 1, "2": 0, "3": 2 }` (question ID: selected option index)
   - Backend loads correct answers from database
   - Backend compares user answers with correct answers
   - Backend calculates score: `(correct / total) * 100`
   - Backend checks if score >= passing_score
   - Backend saves attempt to `quiz_attempts` table
   - Redirects to results page

5. **Farmer views results** (`/farmer/quiz-result/{attempt_id}`)
   - Shows score percentage
   - Shows pass/fail status
   - Shows all questions with:
     - User's selected answer (highlighted in red if wrong)
     - Correct answer (highlighted in green)
     - Explanation (if admin provided one)
   - Can click "Cuba Lagi" to retake quiz

---

## Backend Explanation

### Models (Database Classes)

#### Quiz Model (`app/Models/Quiz.php`)
Represents a quiz record in the database.

```php
// Create a quiz
$quiz = Quiz::create([
    'title' => 'Kuiz Serangga Perosak',
    'category' => 'Serangga Perosak',
    'passing_score' => 70,
    'is_active' => true,
]);

// Get quiz with all questions
$quiz = Quiz::with('questions')->find(1);

// Get all active quizzes
$activeQuizzes = Quiz::where('is_active', true)->get();

// Count total attempts
$attemptCount = $quiz->attempts()->count();
```

**Relationships:**
- `$quiz->questions` - Get all questions for this quiz
- `$quiz->attempts` - Get all user attempts
- `$quiz->learningMaterial` - Get linked learning material (if any)
- `$quiz->creator` - Get admin who created quiz

#### QuizQuestion Model (`app/Models/QuizQuestion.php`)
Represents a question in a quiz.

```php
// Create a question
QuizQuestion::create([
    'quiz_id' => 1,
    'question' => 'Apakah serangga perosak utama padi?',
    'options' => ['Anai-anai', 'Wereng', 'Lalat', 'Lipas'],
    'correct_answer' => 1,  // Index 1 = "Wereng"
    'explanation' => 'Wereng adalah...',
    'order' => 0,
]);

// Get question for a quiz
$questions = QuizQuestion::where('quiz_id', 1)->orderBy('order')->get();
```

**Important Fields:**
- `options` - JSON array with 4 options, automatically converted to PHP array
- `correct_answer` - Integer 0-3 indicating which option is correct
- `order` - Integer to control question order (0, 1, 2, 3...)

#### QuizAttempt Model (`app/Models/QuizAttempt.php`)
Represents a user's quiz attempt.

```php
// Save user's attempt
QuizAttempt::create([
    'quiz_id' => 1,
    'user_id' => 10,
    'answers' => ['1' => 1, '2' => 0],  // Question ID => Selected option
    'score' => 80,
    'passed' => true,
    'started_at' => now(),
    'completed_at' => now(),
]);

// Get all attempts by a user
$userAttempts = QuizAttempt::where('user_id', 10)->get();

// Get latest attempt for each quiz
$latestAttempts = QuizAttempt::where('user_id', 10)
    ->get()
    ->groupBy('quiz_id')
    ->map(fn($attempts) => $attempts->sortByDesc('completed_at')->first());
```

### Controller (`app/Http/Controllers/QuizController.php`)

The controller handles all quiz operations.

#### Admin Methods:

**`adminIndex()`** - Show all quizzes
```php
// What it does:
// 1. Fetch all quizzes with questions, learning materials, and creators
// 2. Count attempts for each quiz
// 3. Get unique categories
// 4. Return data to admin/quiz.tsx page
```

**`create()`** - Show create quiz form
```php
// What it does:
// 1. Get all categories from learning materials
// 2. Get all learning materials
// 3. Return data to admin/quiz-create.tsx page
```

**`store(Request $request)`** - Save new quiz
```php
// What it does:
// 1. Validate all incoming data (title, questions, etc.)
// 2. Create quiz record in database
// 3. Loop through questions and create each one
// 4. Redirect to quiz list
```

**`edit(Quiz $quiz)`** - Show edit quiz form
```php
// What it does:
// 1. Load quiz with questions
// 2. Get categories and learning materials
// 3. Return data to admin/quiz-edit.tsx page
```

**`update(Request $request, Quiz $quiz)`** - Update quiz
```php
// What it does:
// 1. Validate incoming data
// 2. Update quiz record
// 3. Delete all old questions
// 4. Create new questions from form
// 5. Redirect to quiz list
```

**`destroy(Quiz $quiz)`** - Delete quiz
```php
// What it does:
// 1. Delete quiz (questions and attempts cascade delete automatically)
// 2. Redirect back with success message
```

#### Farmer Methods:

**`farmerIndex()`** - Show available quizzes
```php
// What it does:
// 1. Get only active quizzes
// 2. Get categories
// 3. Get current user's previous attempts
// 4. Return data to farmer/quiz.tsx page
```

**`show(Quiz $quiz)`** - Start quiz
```php
// What it does:
// 1. Check if quiz is active
// 2. Load quiz with questions
// 3. REMOVE correct_answer field from questions (security!)
// 4. Return data to farmer/quiz-take.tsx page
```

**`submit(Request $request, Quiz $quiz)`** - Submit answers
```php
// What it does:
// 1. Validate submitted answers
// 2. Load correct answers from database
// 3. Compare answers and count correct ones
// 4. Calculate score percentage
// 5. Determine pass/fail
// 6. Save attempt to database
// 7. Redirect to results page
```

**`result(QuizAttempt $attempt)`** - Show results
```php
// What it does:
// 1. Check user can only view their own attempts
// 2. Load quiz and questions
// 3. Compare user answers with correct answers
// 4. Return detailed results to farmer/quiz-result.tsx page
```

---

## Frontend Explanation

### Admin Pages

#### 1. Quiz List Page (`resources/js/pages/admin/quiz.tsx`)

**Purpose:** Display all quizzes with statistics

**Key Components:**
- Statistics cards (total quizzes, active, inactive, attempts)
- Category filter buttons
- Quiz cards showing:
  - Title, description, category
  - Number of questions
  - Passing score, time limit
  - Number of attempts
  - Edit and delete buttons

**State Management:**
```typescript
const [selectedCategory, setSelectedCategory] = useState<string>('Semua');

// Filter quizzes by category
const filteredQuizzes = selectedCategory === 'Semua'
    ? quizzes
    : quizzes.filter(q => q.category === selectedCategory);
```

#### 2. Quiz Create Page (`resources/js/pages/admin/quiz-create.tsx`)

**Purpose:** Form to create new quiz with questions

**Key State:**
```typescript
const [questions, setQuestions] = useState<Question[]>([
    { question: '', options: ['', '', '', ''], correct_answer: 0, explanation: '' }
]);
```

**Key Functions:**

`addQuestion()` - Add new empty question
```typescript
const addQuestion = () => {
    const newQuestion = {
        question: '',
        options: ['', '', '', ''],
        correct_answer: 0,
        explanation: ''
    };
    setQuestions([...questions, newQuestion]);
};
```

`updateQuestion()` - Update a question field
```typescript
const updateQuestion = (index: number, field: keyof Question, value: any) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], [field]: value };
    setQuestions(updated);
};
```

`updateOption()` - Update a specific option
```typescript
const updateOption = (questionIndex: number, optionIndex: number, value: string) => {
    const updated = [...questions];
    const options = [...updated[questionIndex].options];
    options[optionIndex] = value;
    updated[questionIndex] = { ...updated[questionIndex], options };
    setQuestions(updated);
};
```

`handleSubmit()` - Submit form to backend
```typescript
const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    post('/admin/quiz', {
        data: {
            ...data,
            questions: questions,  // Include all questions
        },
    });
};
```

### Farmer Pages

#### 1. Quiz List Page (`resources/js/pages/farmer/quiz.tsx`)

**Purpose:** Browse available quizzes

**Key Features:**
- Shows only active quizzes
- Displays previous attempt scores
- Shows pass/fail status with color coding
- Category filtering

**Attempt Display Logic:**
```typescript
const attempt = getAttempt(quiz.id);

{attempt && (
    <div className={attempt.passed ? 'bg-green-50' : 'bg-red-50'}>
        Score: {attempt.score}%
        {attempt.passed ? 'Tahniah!' : 'Cuba lagi'}
    </div>
)}
```

#### 2. Quiz Taking Page (`resources/js/pages/farmer/quiz-take.tsx`)

**Purpose:** Interactive quiz interface with timer

**Key State:**
```typescript
const [currentQuestion, setCurrentQuestion] = useState(0);  // Which question showing
const [answers, setAnswers] = useState<Record<number, number>>({});  // User's answers
const [timeLeft, setTimeLeft] = useState<number | null>(quiz.time_limit * 60);  // Seconds left
```

**Timer Logic:**
```typescript
useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return;

    const timer = setInterval(() => {
        setTimeLeft((prev) => {
            if (prev === null || prev <= 1) {
                handleAutoSubmit();  // Auto-submit when time runs out
                return 0;
            }
            return prev - 1;
        });
    }, 1000);

    return () => clearInterval(timer);
}, [timeLeft]);
```

**Answer Selection:**
```typescript
const handleAnswerSelect = (questionId: number, optionIndex: number) => {
    setAnswers({
        ...answers,
        [questionId]: optionIndex,  // Store: questionId => selected option (0-3)
    });
};
```

**Submit Logic:**
```typescript
const handleSubmit = () => {
    post(`/farmer/quiz/${quiz.id}/submit`, {
        data: {
            answers: answers,           // { "1": 1, "2": 0, "3": 2 }
            started_at: startedAt,      // When quiz was started
        },
    });
};
```

#### 3. Results Page (`resources/js/pages/farmer/quiz-result.tsx`)

**Purpose:** Show detailed quiz results

**Key Features:**
- Pass/fail status with trophy/X icon
- Score percentage display
- Detailed question review:
  - Green highlight for correct answers
  - Red highlight for wrong answers
  - Gray for unanswered questions
  - Explanation display

**Question Review Display:**
```typescript
{questions.map((question, index) => (
    <div className={question.is_correct ? 'border-green-200' : 'border-red-200'}>
        {question.options.map((option, oIndex) => {
            const isCorrect = oIndex === question.correct_answer;
            const isUserAnswer = oIndex === question.user_answer;

            return (
                <div className={
                    isCorrect ? 'bg-green-50' :     // Correct answer
                    isUserAnswer ? 'bg-red-50' :    // Wrong answer selected
                    'bg-white'                       // Not selected
                }>
                    {option}
                    {isCorrect && <CheckIcon />}
                    {isUserAnswer && !isCorrect && <XIcon />}
                </div>
            );
        })}

        {question.explanation && (
            <div className="bg-blue-50">
                Penjelasan: {question.explanation}
            </div>
        )}
    </div>
))}
```

---

## Code Flow Examples

### Example 1: Creating a Quiz

**Step-by-step flow:**

1. **Admin clicks "Tambah Kuiz" button**
   ```typescript
   // admin/quiz.tsx
   <Button onClick={() => router.visit('/admin/quiz/create')}>
       Tambah Kuiz
   </Button>
   ```

2. **Browser navigates to `/admin/quiz/create`**
   ```php
   // routes/web.php
   Route::get('/quiz/create', [QuizController::class, 'create']);
   ```

3. **Backend loads create form**
   ```php
   // QuizController.php -> create()
   $categories = LearningMaterial::distinct()->pluck('category');
   $learningMaterials = LearningMaterial::all();

   return Inertia::render('admin/quiz-create', [
       'categories' => $categories,
       'learningMaterials' => $learningMaterials,
   ]);
   ```

4. **Frontend renders create form**
   ```typescript
   // admin/quiz-create.tsx
   <form onSubmit={handleSubmit}>
       <Input name="title" />
       <Select name="category" options={categories} />
       {/* Question builder */}
   </form>
   ```

5. **Admin fills form and clicks "Cipta Kuiz"**
   ```typescript
   const handleSubmit = (e) => {
       post('/admin/quiz', {
           data: {
               title: 'Kuiz Serangga Perosak',
               category: 'Serangga Perosak',
               passing_score: 70,
               questions: [
                   {
                       question: 'Apakah...',
                       options: ['A', 'B', 'C', 'D'],
                       correct_answer: 1,
                   }
               ]
           }
       });
   };
   ```

6. **Backend receives POST request**
   ```php
   // QuizController.php -> store()
   $validated = $request->validate([...]);  // Validate data

   $quiz = Quiz::create([...]);  // Create quiz

   foreach ($validated['questions'] as $index => $questionData) {
       QuizQuestion::create([...]);  // Create each question
   }

   return redirect('/admin/quiz');  // Redirect to list
   ```

### Example 2: Taking a Quiz

**Step-by-step flow:**

1. **Farmer browses quizzes** (`/farmer/quiz`)
   - Sees "Kuiz Serangga Perosak" with 10 questions
   - Sees they haven't taken it before
   - Clicks "Mula Kuiz"

2. **Backend loads quiz** (`QuizController@show`)
   ```php
   $quiz = Quiz::find(1);
   $quiz->load('questions');

   // SECURITY: Remove correct answers
   $quiz->questions->transform(function ($question) {
       return [
           'id' => $question->id,
           'question' => $question->question,
           'options' => $question->options,
           // NOT included: 'correct_answer'
       ];
   });
   ```

3. **Frontend displays quiz** (`farmer/quiz-take.tsx`)
   - Timer starts: 30:00
   - Shows question 1 of 10
   - Shows 4 options (A, B, C, D)

4. **Farmer selects answers**
   ```typescript
   // They select option B (index 1) for question 1
   handleAnswerSelect(1, 1);
   // State now: { "1": 1 }

   // They move to question 2, select option A (index 0)
   handleAnswerSelect(2, 0);
   // State now: { "1": 1, "2": 0 }
   ```

5. **Farmer clicks "Hantar Jawapan"**
   ```typescript
   post('/farmer/quiz/1/submit', {
       data: {
           answers: { "1": 1, "2": 0, "3": 2, ... },
           started_at: '2025-11-23 20:00:00'
       }
   });
   ```

6. **Backend calculates score** (`QuizController@submit`)
   ```php
   $quiz->load('questions');  // Load correct answers

   $correctAnswers = 0;
   foreach ($quiz->questions as $question) {
       $userAnswer = $validated['answers'][$question->id] ?? null;
       if ($userAnswer === $question->correct_answer) {
           $correctAnswers++;  // Count correct
       }
   }

   $score = ($correctAnswers / $totalQuestions) * 100;  // Calculate %
   $passed = $score >= $quiz->passing_score;  // Did they pass?

   QuizAttempt::create([
       'quiz_id' => 1,
       'user_id' => 10,
       'answers' => $validated['answers'],
       'score' => 80,
       'passed' => true,
   ]);

   return redirect('/farmer/quiz-result/' . $attempt->id);
   ```

7. **Frontend shows results** (`farmer/quiz-result.tsx`)
   - Big trophy icon (because they passed)
   - Score: 80%
   - Shows all 10 questions with:
     - Their answer (red if wrong, green if right)
     - Correct answer
     - Explanation

---

## Summary

This quiz system provides a complete e-learning solution with:

✅ **Admin can:**
- Create quizzes with unlimited questions
- Organize by categories
- Set passing criteria
- View attempt statistics

✅ **Farmers can:**
- Browse quizzes by category
- Take timed quizzes
- See previous scores
- Review detailed results
- Retry unlimited times

✅ **Security features:**
- Correct answers never sent to farmer's browser
- Users can only view their own attempts
- Answer validation on backend

✅ **Database design:**
- Proper relationships (Quiz → Questions → Attempts)
- Cascade deletes (deleting quiz removes questions and attempts)
- JSON storage for options and answers (flexible and efficient)

The system is production-ready and fully documented!
