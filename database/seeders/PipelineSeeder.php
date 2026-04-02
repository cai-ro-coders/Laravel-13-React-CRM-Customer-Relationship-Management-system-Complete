<?php

namespace Database\Seeders;

use App\Models\Pipeline;
use App\Models\Stage;
use Illuminate\Database\Seeder;

class PipelineSeeder extends Seeder
{
    public function run(): void
    {
        $pipeline = Pipeline::create([
            'name' => 'Sales Pipeline',
            'is_default' => true,
        ]);

        $stages = [
            ['name' => 'Lead', 'order' => 1, 'color' => '#6366f1', 'is_win' => false, 'is_loss' => false],
            ['name' => 'Contacted', 'order' => 2, 'color' => '#8b5cf6', 'is_win' => false, 'is_loss' => false],
            ['name' => 'Qualified', 'order' => 3, 'color' => '#ec4899', 'is_win' => false, 'is_loss' => false],
            ['name' => 'Proposal', 'order' => 4, 'color' => '#f59e0b', 'is_win' => false, 'is_loss' => false],
            ['name' => 'Negotiation', 'order' => 5, 'color' => '#10b981', 'is_win' => false, 'is_loss' => false],
            ['name' => 'Won', 'order' => 6, 'color' => '#22c55e', 'is_win' => true, 'is_loss' => false],
            ['name' => 'Lost', 'order' => 7, 'color' => '#ef4444', 'is_win' => false, 'is_loss' => true],
        ];

        foreach ($stages as $stage) {
            Stage::create([
                'pipeline_id' => $pipeline->id,
                'name' => $stage['name'],
                'order' => $stage['order'],
                'color' => $stage['color'],
                'is_win' => $stage['is_win'],
                'is_loss' => $stage['is_loss'],
            ]);
        }
    }
}
