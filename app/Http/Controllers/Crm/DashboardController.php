<?php

namespace App\Http\Controllers\Crm;

use App\Http\Controllers\Controller;
use App\Models\Activity;
use App\Models\Deal;
use App\Models\Stage;

class DashboardController extends Controller
{
    public function index()
    {
        $totalRevenue = Deal::where('status', 'won')->sum('value');

        $winStageIds = Stage::where('is_win', true)->pluck('id');
        $lossStageIds = Stage::where('is_loss', true)->pluck('id');
        $activeStageIds = Stage::whereNotIn('id', $winStageIds->merge($lossStageIds))->pluck('id');

        $activeLeads = Deal::whereIn('stage_id', $activeStageIds)
            ->whereNotIn('status', ['closed', 'lost'])
            ->count();

        $wonDeals = Deal::where('status', 'won')
            ->whereNotNull('closed_at')
            ->get();

        if ($wonDeals->isNotEmpty()) {
            $totalDays = 0;
            $count = 0;
            foreach ($wonDeals as $deal) {
                if ($deal->created_at && $deal->closed_at) {
                    $totalDays += $deal->created_at->diffInDays($deal->closed_at);
                    $count++;
                }
            }
            $dealVelocity = $count > 0 ? round($totalDays / $count, 1) : 0;
        } else {
            $dealVelocity = 0;
        }

        $revenueProjection = $this->getRevenueProjection();

        $activities = Activity::with(['user', 'deal', 'contact'])
            ->orderBy('created_at', 'desc')
            ->limit(20)
            ->get();

        return response()->json([
            'totalRevenue' => $totalRevenue,
            'activeLeads' => $activeLeads,
            'dealVelocity' => $dealVelocity,
            'revenueProjection' => $revenueProjection,
            'activities' => $activities->map(function ($activity) {
                return [
                    'id' => $activity->id,
                    'type' => $activity->type,
                    'title' => $activity->title,
                    'description' => $activity->description,
                    'user' => $activity->user ? $activity->user->name : null,
                    'deal' => $activity->deal ? $activity->deal->title : null,
                    'contact' => $activity->contact ? $activity->contact->full_name : null,
                    'created_at' => $activity->created_at->toIso8601String(),
                ];
            }),
        ]);
    }

    private function getRevenueProjection()
    {
        $projection = [];

        for ($i = 11; $i >= 0; $i--) {
            $date = now()->subMonths($i)->startOfMonth();
            $endDate = $date->copy()->endOfMonth();

            $revenue = Deal::where('status', 'won')
                ->whereBetween('closed_at', [$date, $endDate])
                ->sum('value');

            $projection[] = [
                'month' => $date->format('M Y'),
                'revenue' => $revenue,
            ];
        }

        return $projection;
    }
}
