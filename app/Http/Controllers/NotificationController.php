<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        $num_per_page = 10;

        // Get the requested page number, default to 1
        $page = $request->query('page', 1);

        // Fetch notifications from the database with pagination
        $notifications = DB::table('form_users')
            ->orderBy('Timestamp', 'DESC')
            ->paginate($num_per_page, ['*'], 'page', $page);

        return response()->json([
            'notifications' => $notifications->items(),
            'total_pages' => $notifications->lastPage(),
            'current_page' => $notifications->currentPage(),
        ]);
    }

    public function markAsRead(Request $request)
    {
        // Validate the incoming request
        $validated = $request->validate([
            'timestamp' => 'required|string',
            'office' => 'required|string',
        ]);

        // Update the notification's status in the database
        $updated = DB::table('form_users')
            ->where('Timestamp', $validated['timestamp'])
            ->where('Office', $validated['office'])
            ->update(['status' => 'read']); // Ensure you have a 'status' column in your database

        if ($updated) {
            return response()->json(['success' => true, 'message' => 'Notification marked as read']);
        }

        return response()->json(['success' => false, 'message' => 'Failed to mark notification as read'], 400);
    }
}
