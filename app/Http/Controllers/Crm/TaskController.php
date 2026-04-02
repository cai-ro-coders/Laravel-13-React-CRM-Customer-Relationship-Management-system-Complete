<?php

namespace App\Http\Controllers\Crm;

use App\Http\Controllers\Controller;
use App\Models\Activity;
use App\Models\Task;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    public function index(Request $request)
    {
        $query = Task::with(['deal.contact', 'user']);

        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if ($request->has('status') && $request->status && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        if ($request->has('priority') && $request->priority && $request->priority !== 'all') {
            $query->where('priority', $request->priority);
        }

        if ($request->has('user_id') && $request->user_id) {
            $query->where('user_id', $request->user_id);
        }

        if ($request->has('deal_id') && $request->deal_id) {
            $query->where('deal_id', $request->deal_id);
        }

        $tasks = $query->orderBy('due_date', 'asc')->orderBy('priority', 'desc')->paginate(20);

        return response()->json($tasks);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'deal_id' => 'nullable|exists:deals,id',
            'priority' => 'nullable|in:low,medium,high',
            'status' => 'nullable|in:pending,in_progress,completed,cancelled',
            'due_date' => 'nullable|date',
        ]);

        $task = Task::create([
            ...$validated,
            'user_id' => auth()->id(),
            'priority' => $validated['priority'] ?? 'medium',
            'status' => $validated['status'] ?? 'pending',
        ]);

        Activity::log(
            auth()->id(),
            'task_created',
            "Created task: {$task->title}",
            $task->deal_id ?? null,
            null
        );

        return response()->json($task->load(['deal', 'user']), 201);
    }

    public function show(Task $task)
    {
        return $task->load(['deal.contact', 'user']);
    }

    public function update(Request $request, Task $task)
    {
        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'deal_id' => 'nullable|exists:deals,id',
            'user_id' => 'nullable|exists:users,id',
            'priority' => 'sometimes|in:low,medium,high',
            'status' => 'sometimes|in:pending,in_progress,completed,cancelled',
            'due_date' => 'nullable|date',
        ]);

        $oldStatus = $task->status;
        $task->update($validated);

        if (isset($validated['status']) && $validated['status'] !== $oldStatus) {
            if ($validated['status'] === 'completed') {
                $task->update(['completed_at' => now()]);
                Activity::log(
                    auth()->id(),
                    'task_completed',
                    "Completed task: {$task->title}",
                    $task->deal_id ?? null,
                    null
                );
            }
        }

        return response()->json($task->load(['deal', 'user']));
    }

    public function destroy(Task $task)
    {
        $task->delete();

        return response()->json(null, 204);
    }

    public function updateStatus(Request $request, Task $task)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,in_progress,completed,cancelled',
        ]);

        $task->update(['status' => $validated['status']]);

        if ($validated['status'] === 'completed') {
            $task->update(['completed_at' => now()]);
            Activity::log(
                auth()->id(),
                'task_completed',
                "Completed task: {$task->title}",
                $task->deal_id ?? null,
                null
            );
        }

        return response()->json($task->load(['deal', 'user']));
    }
}
