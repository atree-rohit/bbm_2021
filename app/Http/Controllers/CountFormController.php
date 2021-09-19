<?php

namespace App\Http\Controllers;

use App\Models\FormRow;
use App\Models\CountForm;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;

class CountFormController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $forms = CountForm::with("rows")->get();
        return view('butterfly_count.index', compact("forms"));
    }

    public function forms()
    {
        $forms = CountForm::with("rows")->get();

        return view('butterfly_count.forms', compact("forms"));
    }

    public function set_flag(Request $request)
    {
        $form = CountForm::find($request["id"]);
        $form->flag = $request["flag"];
        $form->save();

        return response()->json("success", 200);
    }

    public function set_duplicate(Request $request)
    {
        $form = CountForm::find($request["id"]);
        $form->duplicate = $request["duplicate"];
        $form->save();

        return response()->json("success", 200);
    }

    public function pwa_app()
    {
        return \File::get(public_path() . '/bbm_pwa/index.html');
    }

    public function pwa_post(Request $request)
    {
        $form = new CountForm();
        foreach ($request->form as $k=>$v) {
            $form->$k = $v ?? null;
        }
        $form->save();

        foreach ($request->rows as $row) {
            $new_row = new FormRow();
            $new_row->count_form_id = $form->id;
            foreach ($row as $k=>$v) {
                $new_row->$k = $v ?? null;
            }
            $new_row->save();
        }
        return response()->json("success", 200);
    }

    public function import(Request $request)
    {
        $form_cols = ["id", "name", "affiliation", "phone", "email", "team_members", "photo_link", "location", "coordinates", "date", "altitude", "distance", "weather"];
        //move form_cols to the component instead of a prop
        $path = $request->file('count_file')->store('count_file');
        $original_name = $request->count_file->getClientOriginalName();
        $raw_file = Excel::toArray(new CountForm, $path);
        $form_id = $this->newFile($path, $original_name, $raw_file);
        if ($form_id){
            $form = CountForm::where("id", $form_id)->select($form_cols)->get()->first();
            $form_data = $form->toArray();
            $rows = $form->rows;
            return view('butterfly_count.validate', compact('form_data', 'rows', "form_cols"));            
        } else {
            $code = str_replace('count_file/', '', $path);
            $code = str_replace('.xlsx', '', $code);
            $code = str_replace('.xls', '', $code);
            return view('butterfly_count.invalid', compact('code'));
        }
    }

    public function newFile($file, $original_filename, $spreadsheet)
    {
        $formFields = [
            ["name", "Name of the Person taking the count*"],
            ["affiliation", "Affiliation (NGO/school, etc.)"],
            ["phone", "Contact Number"],
            ["email", "E Mail ID *"],
            ["team_members", "Name and/or number of team members"],
            ["photo_link", "Link to photo records uploaded"],
            ["location", "Location (Place name, nearest village/town) *"],
            ["state", "State *"],
            ["coordinates", "GPS Coordinates (from phone)"],
            ["date", "Date *"],
            ["start_time", "Start Time"],
            ["end_time", "End Time"],
            ["altitude", "Altitude, m"],
            ["distance", "Total distance covered, km (approx. estimated)"],
            ["weather", "Weather (sunny, clouded, windy, etc.)"],
            ["comments", "Comments"]
        ];
        $rowFields = [
            ['sl_no', 'Sl No'],
            ['common_name', 'Common Name'],
            ['scientific_name', 'Binomial Name (if known)'],
            ['individuals', 'No. of individuals'],
            ['remarks', 'Remarks (Male/Female/seasonal form etc.)']
        ];
        
        foreach ($spreadsheet as $sheet) {
            if (isset($sheet[5][2])) {
                $form = new CountForm();
                $form->file = $file;
                $form->original_filename = $original_filename;
                $count_row = -1;
                foreach ($sheet as $k => $f) {
                    foreach ($formFields as $ff) {
                        if ($sheet[$k][0] == $ff[1]) {
                            $form->{$ff[0]} = $sheet[$k][2];
                        }
                    }
                    if ($sheet[$k][0] == $rowFields[0][1]) {
                        $count_row = $k;
                    }
                }
                // dd($form);
                $form->save();
                for ($i = $count_row +1 ; $i < count($sheet); $i++) {
                    $nullFlag = false;
                    foreach ($sheet[$i] as $k=>$ele) {
                        if ($ele != null and $k>0) {
                            $nullFlag = true;
                            break;
                        }
                    }
                    if ($nullFlag) {
                        $form_row = new FormRow();
                        $form_row->count_form_id = $form->id;
                        foreach ($rowFields as $k => $rf) {
                            if ($k == 1) {
                                $form_row->{$rf[0]} = trim(ucwords(strtolower($sheet[$i][$k])));
                            } elseif ($k == 2) {
                                $form_row->{$rf[0]} = trim(ucfirst(strtolower($sheet[$i][$k])));
                            } else {
                                $form_row->{$rf[0]} = trim($sheet[$i][$k]);
                            }
                        }
                        $form_row->save();
                    } else {
                    }
                }
            } else {
                return false;
            }
        }
        return $form->id;
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */


    public function validate_form(Request $request)
    {
        $row_cols = ["sl_no", "common_name", "scientific_name", "individuals", "remarks"];
        $form = CountForm::find($request["form"]["id"]);
        foreach ($request["form"] as $k => $v) {
            if ($k != "id") {
                $form->$k = $request["form"][$k];
            }
        }
        if ($form->isDirty()) {
            $form->save();
        }

        foreach ($request["rows"] as $r) {
            $r = FormRow::find($r["id"]);
            foreach ($row_cols as $c) {
                $r->$c = $r[$c];
            }
            if ($r->isDirty()) {
                $r->save();
            }
        }

        return response()->json("success", 200);
    }
    
    public function calendar(){
        return view('butterfly_count.calendar');
    }
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\CountForm  $countForm
     * @return \Illuminate\Http\Response
     */
    public function show(CountForm $countForm)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\CountForm  $countForm
     * @return \Illuminate\Http\Response
     */
    public function edit(CountForm $countForm)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\CountForm  $countForm
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, CountForm $countForm)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\CountForm  $countForm
     * @return \Illuminate\Http\Response
     */
    public function destroy(CountForm $countForm)
    {
        //
    }
}
