<?php

namespace App\Http\Controllers;

use App\Models\FormRow;
use App\Models\iNatTaxa;
use Illuminate\Http\Request;

class FormRowController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    public function set_flag(Request $request)
    {
        $row = FormRow::find($request["id"]);
        $row->flag = $request["flag"];
        $row->save();

        return response()->json("success", 200);
    }

    public function add_inat_taxa_id()
    {
        $rows = FormRow::where("flag", 0)->where("inat_taxa_id", null)->get();
        $inat_taxa = iNatTaxa::get()->keyBy("name");
        $unmatched = [];
        foreach($rows as $row){
            if(isset($inat_taxa[$row->scientific_name_cleaned])){
                // dd($row, $inat_taxa[$row->scientific_name]);
                $row->inat_taxa_id = $inat_taxa[$row->scientific_name_cleaned]->id;
                $row->save();
            } else {
                $unmatched[] = $row;
            }
        }
        dd($unmatched);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
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
     * @param  \App\Models\FormRow  $formRow
     * @return \Illuminate\Http\Response
     */
    public function show(FormRow $formRow)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\FormRow  $formRow
     * @return \Illuminate\Http\Response
     */
    public function edit(FormRow $formRow)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\FormRow  $formRow
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, FormRow $formRow)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\FormRow  $formRow
     * @return \Illuminate\Http\Response
     */
    public function destroy(FormRow $formRow)
    {
        //
    }
}
