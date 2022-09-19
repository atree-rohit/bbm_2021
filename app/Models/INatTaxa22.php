<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class INatTaxa22 extends Model
{
    use HasFactory;

    public function records()
    {
        return $this->hasMany(INat22::class, "taxa_id");
    }
    
    public function ibp_records()
    {
        return $this->hasMany(IBP22::class, "taxa_id");
    }
}
