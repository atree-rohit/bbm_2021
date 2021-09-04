<?php

use App\Http\Controllers\CountFormController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\SpeciesController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', [HomeController::class, 'welcome']);
Route::get('/home', function () {
    return view('home');
});

Auth::routes();

Route::post('/butterfly_count/import', [CountFormController::class, 'import']);
Route::post('/butterfly_count/validate', [CountFormController::class, 'validate_form']);
Route::post('/butterfly_count/pwa_post', [CountFormController::class, 'pwa_post']);
Route::get('/butterfly_count/pwa_app', [CountFormController::class, 'pwa_app']);

Route::resource('/butterfly_count', CountFormController::class);
// Route::resource('/species', FormRowController::class);
Route::resource('/species', SpeciesController::class);
