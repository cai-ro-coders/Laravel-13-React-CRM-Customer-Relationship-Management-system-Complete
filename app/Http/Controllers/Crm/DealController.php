<?php

namespace App\Http\Controllers\Crm;

use App\Http\Controllers\Controller;
use App\Models\Activity;
use App\Models\Deal;
use App\Models\Stage;
use Illuminate\Http\Request;

class DealController extends Controller
{
    public function index()
    {
        return Deal::with(['contact', 'user', 'stage'])->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'value' => 'nullable|numeric|min:0',
            'contact_id' => 'required|exists:contacts,id',
            'stage_id' => 'required|exists:stages,id',
            'expected_close_date' => 'nullable|date',
            'notes' => 'nullable|string',
        ]);

        $deal = Deal::create([
            ...$validated,
            'user_id' => auth()->id(),
            'status' => 'open',
        ]);

        Activity::log(
            auth()->id(),
            'deal_created',
            "Created deal: {$deal->title}",
            $deal->id,
            $deal->contact_id
        );

        return response()->json($deal->load(['contact', 'user', 'stage']), 201);
    }

    public function show(Deal $deal)
    {
        return $deal->load(['contact', 'user', 'stage', 'tasks', 'invoices', 'activities']);
    }

    public function update(Request $request, Deal $deal)
    {
        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'value' => 'sometimes|numeric|min:0',
            'contact_id' => 'sometimes|exists:contacts,id',
            'stage_id' => 'sometimes|exists:stages,id',
            'status' => 'sometimes|in:open,won,lost,closed',
            'expected_close_date' => 'nullable|date',
            'notes' => 'nullable|string',
        ]);

        $oldStatus = $deal->status;
        $deal->update($validated);

        if (isset($validated['status']) && $validated['status'] !== $oldStatus) {
            if ($validated['status'] === 'won') {
                $deal->update(['closed_at' => now()]);
                Activity::log(
                    auth()->id(),
                    'deal_won',
                    "Deal won: {$deal->title}",
                    $deal->id,
                    $deal->contact_id
                );
            } elseif ($validated['status'] === 'lost') {
                $deal->update(['closed_at' => now()]);
                Activity::log(
                    auth()->id(),
                    'deal_lost',
                    "Deal lost: {$deal->title}",
                    $deal->id,
                    $deal->contact_id
                );
            }
        }

        return response()->json($deal->load(['contact', 'user', 'stage']));
    }

    public function destroy(Deal $deal)
    {
        $deal->delete();

        return response()->json(null, 204);
    }

    public function getByStage(Stage $stage)
    {
        return Deal::with(['contact', 'user'])
            ->where('stage_id', $stage->id)
            ->whereNotIn('status', ['closed', 'lost'])
            ->get();
    }

    public function updateStage(Request $request, Deal $deal)
    {
        $validated = $request->validate([
            'stage_id' => 'required|exists:stages,id',
        ]);

        $oldStage = $deal->stage;
        $deal->update(['stage_id' => $validated['stage_id']]);

        Activity::log(
            auth()->id(),
            'deal_moved',
            "Moved deal '{$deal->title}' to {$deal->stage->name}",
            $deal->id,
            $deal->contact_id
        );

        return response()->json($deal->load(['contact', 'user', 'stage']));
    }
}
