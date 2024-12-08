<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class ModifyFormController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Pages/Feedbackform', []);
    }

    public function fetchData()
    {
        try {
            return response()->json([
                'client_types' => DB::table('client_type')->pluck('ClientType'),
                'offices' => DB::table('office')->pluck('office_name'),
                'questionnaires' => DB::table('question')->pluck('question_text'),
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch data: ' . $e->getMessage()], 500);
        }
    }

    //di nagana to
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'client_type' => 'required|string|max:255',
            'office' => 'required|string|max:255',
            'questionnaire' => 'required|string|max:255',
            'message' => 'required|string|max:255',
        ]);

        try {
            DB::table('submissions')->insert([
                'client_type' => $validated['client_type'],
                'office' => $validated['office'],
                'questionnaire' => $validated['questionnaire'],
                'message' => $validated['message'],
                'user_id' => $request->user() ? $request->user()->id : null,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            return redirect()->route('form.success')->with('status', 'Form submitted successfully!');
        } catch (\Exception $e) {
            return redirect()->route('form.index')->withErrors(['error' => 'Failed to store data: ' . $e->getMessage()]);
        }
    }
}
