<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Invoice extends Model
{
    protected $fillable = [
        'deal_id', 'invoice_number', 'amount', 'tax', 'total',
        'status', 'issue_date', 'due_date', 'paid_at', 'notes',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'tax' => 'decimal:2',
        'total' => 'decimal:2',
        'issue_date' => 'date',
        'due_date' => 'date',
        'paid_at' => 'date',
    ];

    public function deal(): BelongsTo
    {
        return $this->belongsTo(Deal::class);
    }

    public static function generateInvoiceNumber(): string
    {
        $lastInvoice = self::orderBy('id', 'desc')->first();
        $number = $lastInvoice ? (int) substr($lastInvoice->invoice_number, -6) + 1 : 1;

        return 'INV-'.str_pad($number, 6, '0', STR_PAD_LEFT);
    }
}
