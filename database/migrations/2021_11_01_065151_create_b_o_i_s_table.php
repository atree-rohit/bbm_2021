<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateBOISTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('b_o_i_s', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('boi_id')->nullable();
            $table->string('created_date')->nullable();
            $table->text('observed_date')->nullable();
            $table->string('media_code')->nullable();
            $table->string('species_name')->nullable();
            $table->string('user')->nullable();
            $table->string('life_stage')->nullable();
            $table->string('country')->nullable();
            $table->string('state')->nullable();
            $table->string('district')->nullable();
            $table->string('location_name')->nullable();
            $table->string('latitude')->nullable();
            $table->string('longitude')->nullable();
            $table->bigInteger('inat_taxa_id')->nullable();
            $table->boolean('flag')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('b_o_i_s');
    }
}
