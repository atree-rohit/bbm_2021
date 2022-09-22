<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateINat22sTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('i_nat22s', function (Blueprint $table) {
            $table->id();
            $table->string('uuid')->nullable();
            $table->string('observed_on')->nullable();
            $table->string('location')->nullable();
            $table->string('place_guess')->nullable();
            $table->string('state')->nullable();
            $table->string('district')->nullable();
            $table->unsignedBigInteger('taxa_id')->nullable();
            $table->text('img_url')->nullable();
            $table->boolean('is_lepidoptera')->nullable();
            $table->boolean('is_selected')->nullable();
            $table->string('user_id')->nullable();
            $table->string('user_name')->nullable();
            $table->text('description')->nullable();
            $table->string('quality_grade');
            $table->string('license_code')->nullable();
            $table->string('oauth_application_id')->nullable();
            $table->string('inat_created_at')->nullable();
            $table->string('inat_updated_at')->nullable();

            $table->timestamps();

            $table->foreign('taxa_id')->references('id')->on('i_nat_taxa22s');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('i_nat22s');
    }
}
