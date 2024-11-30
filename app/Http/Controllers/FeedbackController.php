<?php

namespace App\Http\Controllers;


use Illuminate\Http\Request;
use App\Models\Feedback;
class FeedbackController extends Controller
{
    //
    public function index()
{
    // Render the feedback view
    return view('feedback'); // This assumes feedback.blade.php is in the resources/views directory
}

    public function store(Request $request)
{
    $validated = $request->validate([
        'name' => 'nullable|string|max:255',
        'email' => 'nullable|email|max:255',
        'message' => 'required|string|max:1000',
        'type' => 'required|in:Complaint,Suggestion,Praise',
        'rating' => 'nullable|integer|min:1|max:5',
    ]);

    Feedback::create($validated);

    return redirect()->back()->with('success', 'Thank you for your feedback!');
}

}
