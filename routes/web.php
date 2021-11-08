<?php

use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\CountFormController;
use App\Http\Controllers\FormRowController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\INatController;
use App\Http\Controllers\IBPController;
use App\Http\Controllers\BOIController;
use App\Http\Controllers\SpeciesController;
use App\Http\Controllers\ResultController;
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
Route::get('/butterfly_count/forms', [CountFormController::class, 'forms'])->middleware('auth');

Route::get('/calendar', [CountFormController::class, 'calendar']);
Route::post('/butterfly_count/set_flag', [CountFormController::class, 'set_flag'])->middleware('auth');
Route::post('/butterfly_count/set_flag', [CountFormController::class, 'set_flag'])->middleware('auth');
Route::post('/butterfly_count/set_duplicate', [CountFormController::class, 'set_duplicate'])->middleware('auth');
Route::post('/butterfly_count/set_row_flag', [FormRowController::class, 'set_flag'])->middleware('auth');
Route::get('/butterfly_count/set_taxa_id', [FormRowController::class, 'add_inat_taxa_id'])->middleware('auth');
// Route::get('/butterfly_count/clean', [CountFormController::class, 'clean'])->middleware('auth');
// Route::post('/butterfly_count/update_count', [CountFormController::class, 'update_count'])->middleware('auth');
// Route::post('/butterfly_count/update_row', [CountFormController::class, 'update_row'])->middleware('auth');
// Route::get('/butterfly_count/clean_rows', [CountFormController::class, 'clean_rows'])->middleware('auth');

Route::post('/inat/store_observation', [INatController::class, 'store_observation'])->name('inat.store_observation');
Route::post('/inat/update_observation', [INatController::class, 'update_observation'])->name('inat.update_observation');
Route::post('/inat/update_state', [INatController::class, 'update_state'])->name('inat.update_state');
Route::post('/inat/store_taxon', [INatController::class, 'store_taxon'])->name('inat.store_taxon')->middleware('auth');
Route::get('/inat/pull', [INatController::class, 'pull'])->name('inat.pull')->middleware('auth');

Route::get('/result', [ResultController::class, 'index'])->name('result.index');
Route::get('/ibp/missing_taxa', [IBPController::class, 'missingTaxa'])->middleware('auth');

Route::get('/boi/fix_taxa', [BOIController::class, 'fix_taxa'])->middleware('auth');

Route::resource('/butterfly_count', CountFormController::class);
// Route::resource('/inat', INatController::class);
Route::resource('/ibp', IBPController::class)->middleware('auth');
Route::resource('/boi', BOIController::class)->middleware('auth');
// Route::resource('/species', SpeciesController::class);
