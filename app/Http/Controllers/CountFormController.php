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
        // $forms = CountForm::with("rows")->get();

        // return view('butterfly_count.index');
        return \File::get(public_path() . '/bbm_pwa/index.html');
    }

    public function pwa_post(Request $request)
    {
        $form = new CountForm();
        foreach($request->form as $k=>$v){
            $form->$k = $v ?? null;
        }
        $form->save();

        foreach($request->rows as $row){
            $new_row = new FormRow();
            $new_row->count_form_id = $form->id;
            foreach($row as $k=>$v){
                $new_row->$k = $v ?? null;
            }
            $new_row->save();
            
        }

        return response()->json("success", 200);

    }
    public function import(Request $request)
    {
        $form_cols = ["id", "name", "affilation", "phone", "email", "team_members", "photo_link", "location", "coordinates", "date", "altitude", "distance", "weather"];
        //move form_cols to the component instead of a prop
        $path = $request->file('count_file')->store('count_file');
        $original_name = $request->count_file->getClientOriginalName();
        $raw_file = Excel::toArray(new CountForm, $path);
        $form_id = $this->newFile($path, $original_name, $raw_file);
        $form = CountForm::where("id", $form_id)->select($form_cols)->get()->first();
        $form_data = $form->toArray();
        $rows = $form->rows;
        return view('butterfly_count.validate', compact('form_data', 'rows', "form_cols"));
    }

    public function newFile($file, $original_filename, $spreadsheet)
    {
        $formFields = [
            ['name', 'Name of the Person taking the count'],
            ['affilation', 'Affiliation (NGO/school, etc.)'],
            ['phone', 'Contact Number'],
            ['email', 'E Mail ID'],
            ['team_members', 'Name and/or number of team members, if any'],
            ['photo_link', 'Link to photo records uploaded'],
            ['location', 'Location (Location name, nearest village/town, state)'],
            ['coordinates', 'GPS Coordinates (from phone)'],
            ['date', 'Date, start time and end time'],
            ['altitude', 'Altitude, m'],
            ['distance', 'Total distance covered on trail, km (approx. estimated)'],
            ['weather', 'Weather (sunny, clouded, windy, etc.)'],
            ['comments', 'Comments'],
        ];
        $rowFields = [
            [ 'sl_no', 'Sl #'],
            [ 'common_name', 'Common Name'],
            [ 'scientific_name', 'Binomial Name (if known)'],
            [ 'no_of_individuals', 'No. of individuals'],
            [ 'remarks', 'Remarks (Male/Female/seasonal form, etc.)']
        ];
        foreach ($spreadsheet as $sheet) {
            if (isset($sheet[11][2])) {
                $form = new CountForm();
                $form->file = $file;
                $form->original_filename = $original_filename;
                $count_row = -1;
                foreach ($sheet as $k => $f) {
                    foreach ($formFields as $ff) {
                        if (str_replace("\n", " ", $sheet[$k][0]) == $ff[1]) {
                            $form->{$ff[0]} = $sheet[$k][2];
                        }
                    }
                    if (str_replace("\n", " ", $sheet[$k][0]) == $rowFields[0][1]) {
                        $count_row = $k;
                    }
                }
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
        $row_cols = ["sl_no", "common_name", "scientific_name", "no_of_individuals", "remarks"];
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
