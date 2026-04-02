<?php

namespace App\Http\Controllers\Crm;

use App\Http\Controllers\Controller;
use App\Models\Activity;
use App\Models\Contact;
use Illuminate\Http\Request;

class ContactController extends Controller
{
    public function index(Request $request)
    {
        $query = Contact::with(['user', 'deals']);

        if ($request->has('status') && $request->status) {
            $query->where('status', $request->status);
        }

        if ($request->has('source') && $request->source) {
            $query->where('source', $request->source);
        }

        if ($request->has('user_id') && $request->user_id) {
            $query->where('user_id', $request->user_id);
        }

        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                    ->orWhere('last_name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('company', 'like', "%{$search}%");
            });
        }

        $contacts = $query->orderBy('created_at', 'desc')->paginate(20);

        return response()->json($contacts);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'nullable|email',
            'phone' => 'nullable|string|max:50',
            'company' => 'nullable|string|max:255',
            'position' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
            'source' => 'nullable|in:website,referral,social,cold_call,other',
            'status' => 'nullable|in:lead,prospect,customer,churned',
        ]);

        $contact = Contact::create([
            ...$validated,
            'user_id' => auth()->id(),
            'status' => $validated['status'] ?? 'lead',
        ]);

        Activity::log(
            auth()->id(),
            'lead_created',
            "Created contact: {$contact->first_name} {$contact->last_name}",
            null,
            $contact->id
        );

        return response()->json($contact->load(['user', 'deals']), 201);
    }

    public function show(Contact $contact)
    {
        return $contact->load(['user', 'deals', 'activities']);
    }

    public function update(Request $request, Contact $contact)
    {
        $validated = $request->validate([
            'first_name' => 'sometimes|string|max:255',
            'last_name' => 'sometimes|string|max:255',
            'email' => 'nullable|email',
            'phone' => 'nullable|string|max:50',
            'company' => 'nullable|string|max:255',
            'position' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
            'source' => 'sometimes|in:website,referral,social,cold_call,other',
            'status' => 'sometimes|in:lead,prospect,customer,churned',
        ]);

        $contact->update($validated);

        return response()->json($contact->load(['user', 'deals']));
    }

    public function destroy(Contact $contact)
    {
        $contact->delete();

        return response()->json(null, 204);
    }

    public function updateStatus(Request $request, Contact $contact)
    {
        $validated = $request->validate([
            'status' => 'required|in:lead,prospect,customer,churned',
        ]);

        $contact->update(['status' => $validated['status']]);

        Activity::log(
            auth()->id(),
            'contact_status_changed',
            "Changed status to {$validated['status']} for {$contact->first_name} {$contact->last_name}",
            null,
            $contact->id
        );

        return response()->json($contact->load(['user']));
    }
}
