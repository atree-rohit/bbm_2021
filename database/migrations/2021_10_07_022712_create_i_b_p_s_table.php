<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateIBPSTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('i_b_p_s', function (Blueprint $table) {
            $table->id();
            $table->string('createdBy')->nullable();
            $table->text('placeName')->nullable();
            $table->string('flagNotes')->nullable();
            $table->string('createdOn')->nullable();
            $table->text('associatedMedia')->nullable();
            $table->string('locationLat')->nullable();
            $table->string('locationLon')->nullable();
            $table->string('fromDate')->nullable();
            $table->string('rank')->nullable();
            $table->string('scientificName')->nullable();
            $table->string('scientific_name_cleaned')->nullable();
            $table->string('commonName')->nullable();
            $table->bigInteger('inat_taxa_id')->nullable();
            $table->text('higherClassificationId')->nullable();
            $table->string('state')->nullable();
            $table->string('observedInMonth')->nullable();
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
        Schema::dropIfExists('i_b_p_s');
    }
}
