<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    /**
     * Fetch feedback count for each office.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function fetchOfficeData()
    {
        try {
            // Query to count feedback per office
            $officeData = DB::table('form_users') // Replace 'form_users' with your actual table name
                ->select('Office as office', DB::raw('COUNT(*) as feedback_count'))
                ->groupBy('Office')
                ->get();

            // Return the data as a JSON response
            return response()->json($officeData, 200);
        } catch (\Exception $e) {
            // Handle errors
            return response()->json([
                'error' => 'Failed to fetch office data',
                'details' => $e->getMessage()
            ], 500);
        }
    }
    public function fetchSASData()
    {
        try {
            // Query to count feedback only for SAS office
            $officeData = DB::table('form_users') // Replace 'form_users' with your actual table name
                ->select('Office', DB::raw('COUNT(*) as feedback_count'))
                ->where('Office', 'SAS') // Filter only for SAS office
                ->groupBy('Office')
                ->get();
    
            // Return the data as a JSON response
            return response()->json($officeData, 200);
        } catch (\Exception $e) {
            // Handle errors
            return response()->json([
                'error' => 'Failed to fetch office data',
                'details' => $e->getMessage()
            ], 500);
        }
    }
    
}
