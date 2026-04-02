<?php

use App\Http\Controllers\Crm\ActivityController;
use App\Http\Controllers\Crm\ContactController;
use App\Http\Controllers\Crm\DashboardController;
use App\Http\Controllers\Crm\DealController;
use App\Http\Controllers\Crm\InvoiceController;
use App\Http\Controllers\Crm\PipelineController;
use App\Http\Controllers\Crm\SettingsController;
use App\Http\Controllers\Crm\TaskController;
use App\Http\Controllers\Crm\UserController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
    Route::get('api/dashboard', [DashboardController::class, 'index']);

    Route::inertia('pipeline', 'pipeline')->name('pipeline');
    Route::get('api/pipeline', [PipelineController::class, 'index']);
    Route::inertia('contacts', 'contacts')->name('contacts');
    Route::inertia('tasks', 'tasks')->name('tasks');
    Route::inertia('billing', 'billing')->name('billing');
    Route::inertia('settings/crm', 'settings/crm')->name('settings.crm');

    Route::apiResource('api/deals', DealController::class)->parameters(['deals' => 'deal']);
    Route::get('api/pipeline/stages/{stage}/deals', [DealController::class, 'getByStage']);
    Route::patch('api/deals/{deal}/stage', [DealController::class, 'updateStage']);

    Route::apiResource('api/contacts', ContactController::class);
    Route::patch('api/contacts/{contact}/status', [ContactController::class, 'updateStatus']);

    Route::apiResource('api/tasks', TaskController::class);
    Route::patch('api/tasks/{task}/status', [TaskController::class, 'updateStatus']);

    Route::apiResource('api/invoices', InvoiceController::class);
    Route::patch('api/invoices/{invoice}/status', [InvoiceController::class, 'updateStatus']);

    Route::get('api/settings/pipeline', [SettingsController::class, 'pipeline']);
    Route::post('api/settings/pipeline/stages', [SettingsController::class, 'storeStage']);
    Route::put('api/settings/pipeline/stages/{stage}', [SettingsController::class, 'updateStage']);
    Route::delete('api/settings/pipeline/stages/{stage}', [SettingsController::class, 'deleteStage']);
    Route::post('api/settings/pipeline/stages/reorder', [SettingsController::class, 'reorderStages']);

    Route::get('api/settings/users', [UserController::class, 'index']);
    Route::put('api/settings/users/{user}/role', [UserController::class, 'updateRole']);

    Route::get('api/activities', [ActivityController::class, 'index']);
});

require __DIR__.'/settings.php';
