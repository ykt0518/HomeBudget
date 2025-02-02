<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Expense;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ExpenseSeeder extends Seeder
{
    public function run(): void
    {
        $expenses = [
            ['date' => '20250118', 'method_id' => 3, 'category_id' => 1, 'detail' => 'ランチ', 'payment' => '430'],
            ['date' => '20250118', 'method_id' => 3, 'category_id' => 2, 'detail' => 'ウェルパーク', 'payment' => '987'],
            ['date' => '20250117', 'method_id' => 2, 'category_id' => 3, 'detail' => 'Suica', 'payment' => '10000'],
            ['date' => '20250117', 'method_id' => 2, 'category_id' => 4, 'detail' => '皮膚科', 'payment' => '2190'],
            ['date' => '20250111', 'method_id' => 1, 'category_id' => 5, 'detail' => 'ゲーセン', 'payment' => '800'],
        ];
        foreach($expenses as $expense) {
            DB::table('expenses')->insert([
                'date' => $expense['date'],
                'method_id' => $expense['method_id'],
                'category_id' => $expense['category_id'],
                'detail' => $expense['detail'],
                'payment' => $expense['payment'],
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ]);
        }
    }
}
