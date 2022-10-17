<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class CountForm extends Model
{
    use LogsActivity, HasFactory;

    protected $fillable = ['name', 'affilation', 'phone', 'email', 'team_members', 'photo_link', 'location', 'coordinates', 'date', 'altiutude', 'distance', 'weather', 'comments', 'file','original_filename', 'duplicate', 'flag'];

    protected static $logAttributes = ['name', 'affilation', 'phone', 'email', 'team_members', 'photo_link', 'location', 'coordinates', 'date', 'altiutude', 'distance', 'weather', 'comments', 'file','original_filename', 'duplicate', 'flag'];
    protected static $logFillable = true;
    protected static $logOnlyDirty = true;

    public function rows()
    {
        return $this->hasMany(FormRow::class);
    }

    public function rows_cleaned()
    {
        return $this
            ->hasMany(FormRow::class)
            ->select(["id","common_name", "scientific_name", "individuals", "flag", "id_quality", "count_form_id", "inat_taxa_id"]);
        // return $this->hasMany(FormRow::class)->select(["id","common_name", "scientific_name_cleaned as scientific_name", "no_of_individuals_cleaned as individuals","count_form_id"]);
    }
}
