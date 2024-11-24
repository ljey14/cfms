<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use App\FeedbackSummaryMail;

class ReportController extends Controller
{
    public function index(Request $request)
    {
        $perPage = 5;
        $page = $request->query('page', 1);
        $search = $request->query('search', '');
        $month = $request->query('month', '');

        $query = DB::table('form_users')
            ->select('Office', 'Feedback_message', 'Timestamp');

        if (!empty($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('Office', 'like', "%$search%")
                    ->orWhere('Feedback_message', 'like', "%$search%");
            });
        }

        if (!empty($month)) {
            $query->whereMonth('Timestamp', '=', date('m', strtotime($month)));
        }

        $clients = $query->paginate($perPage);

        return response()->json([
            'data' => $clients->items(),
            'last_page' => $clients->lastPage(),
            'current_page' => $clients->currentPage(),
            'total' => $clients->total(),
        ]);
    }

    public function sendFeedbackSummary(Request $request)
    {
        $office = $request->input('office');
        $month = $request->input('month');
        $email = $request->input('email');
        $strengths = $request->input('strengths', []);
        $weaknesses = $request->input('weaknesses', []);

        if (!$office || !$month || !$email) {
            return response()->json(['error' => 'Office, month, and email are required.'], 400);
        }

        $feedbacks = DB::table('form_users')
            ->select('Feedback_message', 'Rating')
            ->where('Office', $office)
            ->whereMonth('Timestamp', '=', date('m', strtotime($month)))
            ->get();

    }
}
