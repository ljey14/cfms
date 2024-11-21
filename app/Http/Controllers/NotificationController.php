<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        $num_per_page = 10;
        $page = $request->query('page', 1);

        $start_from = ($page - 1) * $num_per_page;

        // Fetch notifications from the database
        $notifications = DB::table('form_users')
            ->orderBy('Timestamp', 'DESC')
            ->offset($start_from)
            ->limit($num_per_page)
            ->get();

        $total_notifications = DB::table('form_users')->count();
        $total_page = ceil($total_notifications / $num_per_page);

        return response()->json([
            'notifications' => $notifications,
            'total_page' => $total_page,
            'current_page' => $page,
        ]);
    }

    public function markAsRead(Request $request)
    {
        $validated = $request->validate([
            'timestamp' => 'required',
            'office' => 'required',
        ]);

        DB::table('form_users')
            ->where('Timestamp', $validated['timestamp'])
            ->where('Office', $validated['office'])
            ->update(['status' => 'read']);

        return response()->json(['message' => 'Notification marked as read']);
    }
}
