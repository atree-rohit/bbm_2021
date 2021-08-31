<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Species extends Model
{
    use LogsActivity, HasFactory;

    protected $fillable = ['scientific_name', 'common_name', 'family', 'source'];

    protected $logAttributes = ['scientific_name', 'common_name', 'family', 'source'];
    protected static $logFillable = true;
    protected static $logOnlyDirty = true;
}
