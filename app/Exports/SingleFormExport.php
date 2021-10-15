<?php

namespace App\Exports;

use App\Models\CountForm;
use Illuminate\Contracts\View\View;
use Maatwebsite\Excel\Concerns\FromView;

class SingleFormExport implements FromView
{

    private $sheet_no;
    private $email;
    private $forms;

    public function __construct(int $sheet_no, $email)
    {
        $forms = CountForm::where("email", $email)->with("rows")->get()->sortBy("date_cleaned")->toArray();
        foreach($forms as $k=>$f){
            $forms[$k]["date_created_cleaned"] .= " Sept, 2021";
        }
        $this->sheet_no  = $sheet_no;
        $this->email = $email;
        $this->forms = $forms;
        
    }
    /**
    * @return \Illuminate\Support\Collection
    */
    public function view(): View
    {
        return view('butterfly_count.export', [
            'form' => $this->forms[$this->sheet_no]
        ]);
    }
    
}
