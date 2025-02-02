<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Category;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            ['category' => '食費'],
            ['category' => '日用品'],
            ['category' => '交通費'],
            ['category' => '医療費'],
            ['category' => '交際費'],
            ['category' => '固定費'],
            ['category' => 'その他'],
        ];
        foreach($categories as $category) {
            DB::table('categories')->insert([
                'category' => $category['category'],
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ]);
        }
    }
}
