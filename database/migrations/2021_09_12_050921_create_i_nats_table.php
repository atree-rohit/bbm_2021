<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateINatsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('i_nats', function (Blueprint $table) {
            $table->id();
            $table->string('uuid')->nullable();
            $table->string('observed_on')->nullable();
            $table->string('location')->nullable();
            $table->string('place_guess')->nullable();
            $table->integer('taxa_id')->nullable();
            $table->string('taxa_name')->nullable();
            $table->string('taxa_rank')->nullable();
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
        Schema::dropIfExists('i_nats');
    }
}
