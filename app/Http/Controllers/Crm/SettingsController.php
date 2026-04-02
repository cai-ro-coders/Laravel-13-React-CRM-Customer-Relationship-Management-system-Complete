<?php

namespace App\Http\Controllers\Crm;

use App\Http\Controllers\Controller;
use App\Models\Pipeline;
use App\Models\Stage;
use Illuminate\Http\Request;

class SettingsController extends Controller
{
    public function pipeline()
    {
        $pipeline = Pipeline::with('stages')->where('is_default', true)->first();

        return response()->json([
            'pipeline' => $pipeline,
            'stages' => $pipeline?->stages->sortBy('order')->values(),
        ]);
    }

    public function storeStage(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'color' => 'nullable|string|max:20',
            'is_win' => 'nullable|boolean',
            'is_loss' => 'nullable|boolean',
        ]);

        $pipeline = Pipeline::where('is_default', true)->firstOrFail();

        $maxOrder = Stage::where('pipeline_id', $pipeline->id)->max('order') ?? 0;

        $stage = Stage::create([
            'pipeline_id' => $pipeline->id,
            'name' => $validated['name'],
            'color' => $validated['color'] ?? '#6366f1',
            'order' => $maxOrder + 1,
            'is_win' => $validated['is_win'] ?? false,
            'is_loss' => $validated['is_loss'] ?? false,
        ]);

        return response()->json($stage, 201);
    }

    public function updateStage(Request $request, Stage $stage)
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'color' => 'nullable|string|max:20',
            'is_win' => 'nullable|boolean',
            'is_loss' => 'nullable|boolean',
        ]);

        $stage->update($validated);

        return response()->json($stage);
    }

    public function deleteStage(Stage $stage)
    {
        $dealsCount = $stage->deals()->count();

        if ($dealsCount > 0) {
            return response()->json(['error' => 'Cannot delete stage with deals. Move or delete deals first.'], 422);
        }

        $stage->delete();

        return response()->json(null, 204);
    }

    public function reorderStages(Request $request)
    {
        $validated = $request->validate([
            'stages' => 'required|array',
            'stages.*.id' => 'required|exists:stages,id',
            'stages.*.order' => 'required|integer',
        ]);

        foreach ($validated['stages'] as $stageData) {
            Stage::where('id', $stageData['id'])->update(['order' => $stageData['order']]);
        }

        return response()->json(['success' => true]);
    }
}
