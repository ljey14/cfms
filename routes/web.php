<?php

use App\http\Controllers\PostController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ShareController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Profile;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\DataController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\FeedbackController;
use App\Http\Controllers\ModifyFormController;


Route::get('/api/fetch-data', [ModifyFormController::class, 'fetchData'])->name('form.fetchData');


Route::get('/feedback', [FeedbackController::class, 'index'])->name('feedback.index');
Route::post('/feedback', [FeedbackController::class, 'store'])->name('feedback.store');



Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::get('/notification', function () {
    return Inertia::render('Notification');
})->middleware(['auth', 'verified'])->name('notification');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/notifications', [NotificationController::class, 'index'])->name('notifications');
    Route::post('/notifications/mark-read', [NotificationController::class, 'markAsRead']);
});

Route::get('/notifications', function () {
    return Inertia::render('Notification');
});


Route::get('/database', function () {
    return Inertia::render('Database');
})->middleware(['auth', 'verified'])->name('database');

Route::get('/feedbackForm', function () {
    return Inertia::render('Feedbackform');
})->middleware(['auth', 'verified'])->name('feedbackForm');

Route::get('/report', function () {
    return Inertia::render('Report');
})->middleware(['auth', 'verified'])->name('report');


Route::get('/notifications', [NotificationController::class, 'index']);


Route::post('/notifications/mark-as-read', [NotificationController::class, 'markAsRead']);

Route::get('/clients', [ReportController::class, 'index']);
Route::post('/report/send-feedback-summary', [ReportController::class, 'sendFeedbackSummary']);

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';

  
