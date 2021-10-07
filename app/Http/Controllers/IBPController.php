<?php

namespace App\Http\Controllers;

use App\Models\IBP;
use App\Models\iNatTaxa;
use Illuminate\Http\Request;

class IBPController extends Controller
{
    /**
    * Display a listing of the resource.
    *
    * @return \Illuminate\Http\Response
    */
    public function index()
    {

    }

    /**
    * Show the form for creating a new resource.
    *
    * @return \Illuminate\Http\Response
    */


    public function create()
    {
        $fields = ['createdBy', 'placeName', 'flagNotes', 'createdOn', 'associatedMedia', 'locationLat', 'locationLon', 'fromDate', 'rank', 'scientificName', 'commonName', 'higherClassificationId', 'state', 'observedInMonth', 'lastRevised', 'uploadProtocol'];

        $json_string = file_get_contents(public_path("./data/ibp.json"));

        $ibp_observations = json_decode( preg_replace('/[\x00-\x1F\x80-\xFF]/', '', $json_string), true );
        $inat_taxa = iNatTaxa::get()->keyBy("name");

        foreach($ibp_observations as $o){
            $ibp = new IBP();
            $ibp->id = $o['catalogNumber'];
            foreach($fields as $f){
                $ibp->{$f} = $o[$f];
            }

            if($ibp->rank == "species"){
                $sci_name = explode(" " , $ibp->scientificName);
                if(isset($sci_name[1])){
                    $ibp->scientific_name_cleaned = $sci_name[0] . " " . $sci_name[1];
                }
            } else if($ibp->scientificName != null){
                $ibp->scientific_name_cleaned = $ibp->scientificName;
            }
            if(isset($inat_taxa[$ibp->scientific_name_cleaned])){
                $ibp->inat_taxa_id = $inat_taxa[$ibp->scientific_name_cleaned]->id;
            }

            $ibp->save();
        }

        $fields = ["id", "name", "rank", "ancestry"];

        $ibps = IBP::where("inat_taxa_id", null)->get();
        $taxa_url = "https://api.inaturalist.org/v1/taxa?q=";
        $added_count = 0;

        foreach(array_keys($ibps->groupBy("scientific_name_cleaned")->toArray()) as $name){
            $url = $taxa_url . str_replace(" ", "%20", $name);
            $data = json_decode(file_get_contents($url));

            if(count($data->results) > 0 && $data->results[0]->name == $name && !isset($inat_taxa[$name])){
                $taxon = new iNatTaxa();
                foreach ($fields as $f) {
                    $taxon->{$f} = $data->results[0]->{$f};
                }
                $taxon->common_name = $data->results[0]->preferred_common_name ?? null;

                $taxon->save();
                $added_count++;
            }
        }
        foreach($ibps as $ibp){
            if(isset($inat_taxa[$ibp->scientific_name_cleaned])){
                $ibp->inat_taxa_id = $inat_taxa[$ibp->scientific_name_cleaned]->id;
                $ibp->save();
            }
        }
        dd($added_count);
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
    * @param  \App\Models\IBP  $iBP
    * @return \Illuminate\Http\Response
    */
    public function show(IBP $iBP)
    {
        //
    }

    /**
    * Show the form for editing the specified resource.
    *
    * @param  \App\Models\IBP  $iBP
    * @return \Illuminate\Http\Response
    */
    public function edit(IBP $iBP)
    {
        //
    }

    /**
    * Update the specified resource in storage.
    *
    * @param  \Illuminate\Http\Request  $request
    * @param  \App\Models\IBP  $iBP
    * @return \Illuminate\Http\Response
    */
    public function update(Request $request, IBP $iBP)
    {
        //
    }

    /**
    * Remove the specified resource from storage.
    *
    * @param  \App\Models\IBP  $iBP
    * @return \Illuminate\Http\Response
    */
    public function destroy(IBP $iBP)
    {
        //
    }
}
