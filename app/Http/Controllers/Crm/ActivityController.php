<?php

namespace App\Http\Controllers\Crm;

use App\Http\Controllers\Controller;
use App\Models\Activity;
use Illuminate\Http\Request;

class ActivityController extends Controller
{
    public function index(Request $request)
    {
        $query = Activity::with(['user', 'deal', 'contact']);

        if ($request->has('deal_id') && $request->deal_id) {
            $query->where('deal_id', $request->deal_id);
        }

        if ($request->has('contact_id') && $request->contact_id) {
            $query->where('contact_id', $request->contact_id);
        }

        $activities = $query->orderBy('created_at', 'desc')->limit(50)->get();

        return response()->json($activities);
    }
}
