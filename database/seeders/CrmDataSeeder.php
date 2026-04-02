<?php

namespace Database\Seeders;

use App\Models\Contact;
use App\Models\Deal;
use App\Models\Pipeline;
use App\Models\Stage;
use App\Models\Task;
use App\Models\User;
use Illuminate\Database\Seeder;

class CrmDataSeeder extends Seeder
{
    public function run(): void
    {
        $pipeline = Pipeline::where('is_default', true)->first();

        if (! $pipeline) {
            $pipeline = Pipeline::create([
                'name' => 'Sales Pipeline',
                'is_default' => true,
            ]);
        }

        $stages = Stage::where('pipeline_id', $pipeline->id)->get();

        if ($stages->isEmpty()) {
            $stagesData = [
                ['name' => 'Lead', 'order' => 1, 'color' => '#6366f1'],
                ['name' => 'Contacted', 'order' => 2, 'color' => '#8b5cf6'],
                ['name' => 'Qualified', 'order' => 3, 'color' => '#ec4899'],
                ['name' => 'Proposal', 'order' => 4, 'color' => '#f59e0b'],
                ['name' => 'Negotiation', 'order' => 5, 'color' => '#10b981'],
                ['name' => 'Won', 'order' => 6, 'color' => '#22c55e', 'is_win' => true],
                ['name' => 'Lost', 'order' => 7, 'color' => '#ef4444', 'is_loss' => true],
            ];

            foreach ($stagesData as $stageData) {
                $isWin = $stageData['is_win'] ?? false;
                $isLoss = $stageData['is_loss'] ?? false;
                unset($stageData['is_win'], $stageData['is_loss']);

                $stages[] = Stage::create([
                    'pipeline_id' => $pipeline->id,
                    ...$stageData,
                    'is_win' => $isWin,
                    'is_loss' => $isLoss,
                ]);
            }
        }

        $user = User::first();

        $contactsData = [
            ['first_name' => 'John', 'last_name' => 'Smith', 'email' => 'john.smith@techcorp.com', 'phone' => '+1 555-0101', 'company' => 'TechCorp Inc.', 'position' => 'CEO', 'source' => 'website', 'status' => 'customer'],
            ['first_name' => 'Sarah', 'last_name' => 'Johnson', 'email' => 'sarah.j@startup.io', 'phone' => '+1 555-0102', 'company' => 'Startup.io', 'position' => 'CTO', 'source' => 'referral', 'status' => 'customer'],
            ['first_name' => 'Michael', 'last_name' => 'Brown', 'email' => 'mbrown@enterprise.com', 'phone' => '+1 555-0103', 'company' => 'Enterprise Ltd.', 'position' => 'VP Sales', 'source' => 'cold_call', 'status' => 'prospect'],
            ['first_name' => 'Emily', 'last_name' => 'Davis', 'email' => 'emily.d@design.co', 'phone' => '+1 555-0104', 'company' => 'Design Co.', 'position' => 'Founder', 'source' => 'social', 'status' => 'lead'],
            ['first_name' => 'Robert', 'last_name' => 'Wilson', 'email' => 'r.wilson@global.net', 'phone' => '+1 555-0105', 'company' => 'Global Networks', 'position' => 'Procurement Manager', 'source' => 'website', 'status' => 'lead'],
            ['first_name' => 'Jennifer', 'last_name' => 'Martinez', 'email' => 'jmartinez@creative.com', 'phone' => '+1 555-0106', 'company' => 'Creative Studios', 'position' => 'Director', 'source' => 'referral', 'status' => 'prospect'],
            ['first_name' => 'David', 'last_name' => 'Lee', 'email' => 'dlee@innovate.tech', 'phone' => '+1 555-0107', 'company' => 'Innovate Tech', 'position' => 'Product Manager', 'source' => 'website', 'status' => 'lead'],
            ['first_name' => 'Lisa', 'last_name' => 'Anderson', 'email' => 'l.anderson@solutions.com', 'phone' => '+1 555-0108', 'company' => 'Solutions Inc.', 'position' => 'IT Manager', 'source' => 'cold_call', 'status' => 'prospect'],
            ['first_name' => 'James', 'last_name' => 'Taylor', 'email' => 'jtaylor@finance.group', 'phone' => '+1 555-0109', 'company' => 'Finance Group', 'position' => 'CFO', 'source' => 'referral', 'status' => 'churned'],
            ['first_name' => 'Amanda', 'last_name' => 'White', 'email' => 'awhite@retail.co', 'phone' => '+1 555-0110', 'company' => 'Retail Co.', 'position' => 'Operations Director', 'source' => 'social', 'status' => 'customer'],
        ];

        foreach ($contactsData as $contactData) {
            $contact = Contact::create([
                ...$contactData,
                'user_id' => $user->id,
            ]);

            if (in_array($contactData['status'], ['customer', 'prospect'])) {
                $stage = $stages->random();

                if ($contactData['status'] === 'customer') {
                    $wonStage = $stages->firstWhere('is_win', true);
                    if ($wonStage) {
                        $stage = $wonStage;
                    }
                }

                $dealValue = rand(5000, 50000);

                $deal = Deal::create([
                    'contact_id' => $contact->id,
                    'user_id' => $user->id,
                    'stage_id' => $stage->id,
                    'title' => $contactData['company'].' - '.($contactData['status'] === 'customer' ? 'Enterprise' : 'Standard').' Deal',
                    'value' => $dealValue,
                    'status' => $contactData['status'] === 'customer' ? 'won' : 'open',
                    'expected_close_date' => now()->addDays(rand(30, 90)),
                    'closed_at' => $contactData['status'] === 'customer' ? now()->subDays(rand(1, 60)) : null,
                ]);

                Task::create([
                    'deal_id' => $deal->id,
                    'user_id' => $user->id,
                    'title' => 'Follow up with '.$contactData['first_name'].' '.$contactData['last_name'],
                    'description' => 'Discuss '.$contactData['company'].' account and potential expansion opportunities.',
                    'priority' => ['low', 'medium', 'high'][rand(0, 2)],
                    'status' => ['pending', 'in_progress', 'completed'][rand(0, 2)],
                    'due_date' => now()->addDays(rand(1, 14)),
                ]);
            }
        }

        $openLeads = $stages->filter(fn ($s) => ! $s->is_win && ! $s->is_loss);

        $additionalDeals = [
            ['title' => 'Cloud Migration Project', 'value' => 35000],
            ['title' => 'Annual Support Contract', 'value' => 15000],
            ['title' => 'Security Audit Service', 'value' => 22000],
            ['title' => 'Digital Transformation', 'value' => 75000],
        ];

        foreach ($additionalDeals as $dealData) {
            $randomContact = Contact::whereIn('status', ['lead', 'prospect'])->inRandomOrder()->first();
            if ($randomContact) {
                Deal::create([
                    'contact_id' => $randomContact->id,
                    'user_id' => $user->id,
                    'stage_id' => $openLeads->random()->id,
                    'title' => $dealData['title'],
                    'value' => $dealData['value'],
                    'status' => 'open',
                    'expected_close_date' => now()->addDays(rand(30, 120)),
                ]);
            }
        }

        echo "CRM seed data created successfully!\n";
        echo '- '.Contact::count()." contacts\n";
        echo '- '.Deal::count()." deals\n";
        echo '- '.Task::count()." tasks\n";
    }
}
