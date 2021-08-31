<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class FormRow extends Model
{
    use LogsActivity, HasFactory;

    protected $fillable = ['count_form_id', 'sl_no', 'common_name', 'scientific_name', 'no_of_individuals', 'remarks', 'id_quality', 'flag'];

    protected $logAttributes = ['form.id', 'sl_no', 'common_name', 'scientific_name', 'no_of_individuals', 'remarks', 'id_quality', 'flag'];
    protected static $logFillable = true;
    protected static $logOnlyDirty = true;

    public function form()
    {
        return $this->belongsTo(CountForm::class, "count_form_id");
    }
}
