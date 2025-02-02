<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Method extends Model
{
    use HasFactory;

    Protected $fillable = [
        'id',
        'method',
    ];
    
    public function expenses()
    {
        return $this->hasMany(Expense::class, 'method_id', 'id');
    }
}
