<?php

namespace App\Http\Controllers;

use App\Models\CountForm;
use App\Models\FormRow;
use Illuminate\Http\Request;

class HomeController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    // public function __construct()
    // {
    //     $this->middleware('auth');
    // }

    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Contracts\Support\Renderable
     */

    public function welcome()
    {
        $forms = CountForm::count();
        $form_rows = FormRow::all();
        $species = count($form_rows->groupBy("scientific_name"));
        $individuals = $form_rows->sum("no_of_individuals_cleaned");
        $data = [
            [$forms,"Forms", "bg-warning"],
            [$species,"Species", "bg-success"],
            [$individuals,"Individuals", "bg-indigo"]
        ];
        return view('welcome', compact("data"));
    }
}
