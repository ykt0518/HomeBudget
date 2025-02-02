<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\Relation;
use App\Models\Category;
use App\Models\Method;

class Expense extends Model
{
    Protected $fillable = [
        'date',
        'method_id',
        'category_id',
        'detail',
        'payment',
    ];

    protected $casts = [
        'date' => 'datetime',
    ];

    // public function category()
    // {
    //     return $this->belongsTo(Category::class, 'category_id', 'id');
    // }

    public function category() : Relation {
        return $this->belongsTo(Category::class);
    }

    // public function method()
    // {
    //     return $this->belongsTo(Method::class, 'method_id', 'id');
    // }
    
    public function method() : Relation {
        return $this->belongsTo(Method::class);
    }
}
