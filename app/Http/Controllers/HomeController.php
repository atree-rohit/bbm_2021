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
        $species = count($form_rows->groupBy("common_name"));
        // dd($form_rows->groupBy("scientific_name"));
        $individuals = 0;
        foreach($form_rows as $f){
            if(is_numeric($f->individuals))
                $individuals += $f->individuals;
        }
        $data = [
            [$forms,"Forms", "bg-warning"],
            [$species,"Species", "bg-success"],
            [$individuals,"Individuals", "bg-indigo"]
        ];
        return view('welcome', compact("data"));
    }
}
