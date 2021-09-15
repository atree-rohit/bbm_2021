<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateINatTaxasTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('i_nat_taxas', function (Blueprint $table) {
            $table->id();
            $table->string('name')->nullable();
            $table->string('common_name')->nullable();
            $table->string('rank')->nullable();
            $table->text('ancestry')->nullable();

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
        Schema::dropIfExists('i_nat_taxas');
    }
}
