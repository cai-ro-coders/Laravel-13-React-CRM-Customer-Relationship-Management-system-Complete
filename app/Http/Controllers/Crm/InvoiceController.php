<?php

namespace App\Http\Controllers\Crm;

use App\Http\Controllers\Controller;
use App\Models\Activity;
use App\Models\Invoice;
use Illuminate\Http\Request;

class InvoiceController extends Controller
{
    public function index(Request $request)
    {
        $query = Invoice::with(['deal.contact', 'deal']);

        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('invoice_number', 'like', "%{$search}%")
                    ->orWhereHas('deal', function ($q) use ($search) {
                        $q->where('title', 'like', "%{$search}%")
                            ->orWhereHas('contact', function ($q) use ($search) {
                                $q->where('first_name', 'like', "%{$search}%")
                                    ->orWhere('last_name', 'like', "%{$search}%")
                                    ->orWhere('company', 'like', "%{$search}%");
                            });
                    });
            });
        }

        if ($request->has('status') && $request->status && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        if ($request->has('deal_id') && $request->deal_id) {
            $query->where('deal_id', $request->deal_id);
        }

        if ($request->has('all')) {
            $invoices = $query->orderBy('issue_date', 'desc')->get();

            return response()->json(['data' => $invoices]);
        }

        $invoices = $query->orderBy('issue_date', 'desc')->paginate(20);

        return response()->json($invoices);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'deal_id' => 'required|exists:deals,id',
            'amount' => 'required|numeric|min:0',
            'tax' => 'nullable|numeric|min:0',
            'issue_date' => 'required|date',
            'due_date' => 'required|date|after_or_equal:issue_date',
            'notes' => 'nullable|string',
        ]);

        $invoice = Invoice::create([
            ...$validated,
            'invoice_number' => Invoice::generateInvoiceNumber(),
            'tax' => $validated['tax'] ?? 0,
            'total' => $validated['amount'] + ($validated['tax'] ?? 0),
            'status' => 'draft',
        ]);

        return response()->json($invoice->load(['deal']), 201);
    }

    public function show(Invoice $invoice)
    {
        return $invoice->load(['deal.contact', 'deal']);
    }

    public function update(Request $request, Invoice $invoice)
    {
        $validated = $request->validate([
            'amount' => 'sometimes|numeric|min:0',
            'tax' => 'nullable|numeric|min:0',
            'status' => 'sometimes|in:draft,sent,paid,overdue,cancelled',
            'issue_date' => 'sometimes|date',
            'due_date' => 'sometimes|date',
            'notes' => 'nullable|string',
        ]);

        if (isset($validated['amount']) || isset($validated['tax'])) {
            $amount = $validated['amount'] ?? $invoice->amount;
            $tax = $validated['tax'] ?? $invoice->tax;
            $validated['total'] = $amount + $tax;
        }

        $oldStatus = $invoice->status;
        $invoice->update($validated);

        if (isset($validated['status']) && $validated['status'] !== $oldStatus) {
            if ($validated['status'] === 'paid') {
                $invoice->update(['paid_at' => now()]);
                Activity::log(
                    auth()->id(),
                    'invoice_paid',
                    "Invoice {$invoice->invoice_number} paid",
                    $invoice->deal_id,
                    null
                );
            }
        }

        return response()->json($invoice->load(['deal']));
    }

    public function destroy(Invoice $invoice)
    {
        $invoice->delete();

        return response()->json(null, 204);
    }

    public function updateStatus(Request $request, Invoice $invoice)
    {
        $validated = $request->validate([
            'status' => 'required|in:draft,sent,paid,overdue,cancelled',
        ]);

        $invoice->update(['status' => $validated['status']]);

        if ($validated['status'] === 'paid') {
            $invoice->update(['paid_at' => now()]);
        }

        return response()->json($invoice->load(['deal']));
    }
}
