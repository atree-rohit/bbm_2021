<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class INat22 extends Model
{
    use HasFactory;

    public function taxa()
    {
        return $this->belongsTo(INatTaxa22::class, "id");
    }
}
