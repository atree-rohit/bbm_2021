<?php

namespace App\Exports;

use App\Models\CountForm;
use Illuminate\Contracts\View\View;
use Maatwebsite\Excel\Concerns\FromView;
use Maatwebsite\Excel\Concerns\Exportable;
use Maatwebsite\Excel\Concerns\WithMultipleSheets;

class FormExport implements WithMultipleSheets
{

    use Exportable;

    protected $forms;
    protected $email;
    
    public function __construct($email)
    {
        $forms = CountForm::where("email", $email)->with("rows")->get()->toArray();
        
        $this->email = $email;
        $this->forms = $forms;

    }

    public function sheets(): array
    {
        $sheets = [];

        foreach($this->forms as $k=>$f)
            $sheets[] = new SingleFormExport($k, $this->email);
        

        return $sheets;
    }

    public function title(): string
    {
        return 'Count ' . $this->sheet_no;
    }
}
