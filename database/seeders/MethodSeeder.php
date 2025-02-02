<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Method;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class MethodSeeder extends Seeder
{
    public function run(): void
    {
        $methods = [
            ['method' => '現金'],
            ['method' => 'カード'],
            ['method' => 'PayPay'],
            ['method' => '口座引き落とし'],
        ];
        foreach($methods as $method) {
            DB::table('methods')->insert([
                'method' => $method['method'],
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ]);
        }
    }
}
