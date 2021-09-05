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
        $forms = CountForm::where("flag", false)->count();
        $form_rows = FormRow::with("form")->get();
        $stats = $this->populate_sci_names($form_rows);
        
        $data = [
            [$forms,"Forms", "bg-warning"],
            [count($stats[0]),"Species", "bg-success"],
            [$stats[1],"Individuals", "bg-indigo"]
        ];
        // if(isset($_GET["new"]))
            return view('welcome-india', compact("data"));
        // return view('welcome', compact("data"));
    }

    public function populate_sci_names($rows){
        $names = [
            "synoptic" => json_decode(file_get_contents(public_path('/data/synoptic.json'))),
            "boi" => json_decode(file_get_contents(public_path('/data/boi.json'))),
        ];
        $scientific_names = [];
        $individuals = 0;
        $skipped = $sci_name_not_set = [];
        foreach($rows as $row){
            //ignore if row is flag, form is flag or duplicate
            if(!($row->flag || $row->form->flag || $row->form->duplicate)){
                if(is_numeric($row->individuals))
                    $individuals += $row->individuals;
                if(!$row->scientific_name){
                    $sci_name_flag = true;
                    foreach($names as $list_name=>$list){
                        foreach($list as $sp){
                            if($sp[1] == $row->common_name){
                                $sci_name_flag = false;
                                $row->scientific_name = $sp[0];
                                $row->save();
                                if(!in_array($sp[0], $scientific_names))
                                    $scientific_names[] = $sp[0];
                                break;
                            }
                        }

                    }
                    if($sci_name_flag){
                        $sci_name_not_set[] = $row;
                    }
                } else {
                    if(!in_array($row->scientific_name, $scientific_names))
                        $scientific_names[] = $row->scientific_name;
                }
            } else {
                $skipped[] = [$row->id, $row->flag, $row->form->flag, $row->form->duplicate];
            }
        }
        // dd($skipped, $sci_name_not_set);
        return ([$scientific_names, $individuals]);
        
    }
}
