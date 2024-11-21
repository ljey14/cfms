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

        
        $notifications = DB::table('form_users')
            ->orderBy('Timestamp', 'DESC')
            ->paginate($num_per_page, ['*'], 'page', $page);

    
        return response()->json([
            'notifications' => $notifications->items(),
            'total_pages' => $notifications->lastPage(), 
            'current_page' => $notifications->currentPage(), 
        ]);
    }
}
