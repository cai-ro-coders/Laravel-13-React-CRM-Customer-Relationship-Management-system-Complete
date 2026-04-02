<?php

namespace App\Http\Controllers\Crm;

use App\Http\Controllers\Controller;
use App\Models\Contact;
use App\Models\Deal;
use App\Models\Pipeline;

class PipelineController extends Controller
{
    public function index()
    {
        $pipeline = Pipeline::with(['stages' => function ($query) {
            $query->orderBy('order');
        }])->where('is_default', true)->first();

        if (! $pipeline) {
            return response()->json(['error' => 'No default pipeline found'], 404);
        }

        $stages = $pipeline->stages->map(function ($stage) {
            $stage->deals = Deal::with(['contact', 'user'])
                ->where('stage_id', $stage->id)
                ->whereNotIn('status', ['closed', 'lost'])
                ->orderBy('created_at', 'desc')
                ->get();

            return $stage;
        });

        return response()->json([
            'pipeline' => $pipeline,
            'stages' => $stages,
            'contacts' => Contact::select('id', 'first_name', 'last_name', 'email', 'company')->get(),
        ]);
    }
}
