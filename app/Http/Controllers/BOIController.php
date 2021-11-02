<?php

namespace App\Http\Controllers;

use App\Models\BOI;
use App\Models\iNatTaxa;
use Illuminate\Http\Request;

class BOIController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $data = BOI::all();
        $not_bbm = $bbm = $bbm_no_taxa = $unmatched_taxa = [];
        $fields = ["boi_id", "created_date", "observed_date", "media_code", "species_name", "user", "life_stage", "country", "state", "district", "location_name", "latitude", "longitude", "inat_taxa_id"];
        foreach($data as $d){
            $exclude_flag = false;
            if(!strpos($d->created_date, '/09/21')){
                $exclude_flag = true;
            }
            if(!strpos($d->observed_date, '/09/21')){
                $exclude_flag = true;
            }
            if($d->country != "India"){
                $exclude_flag = true;
            }
            if($exclude_flag){
                $not_bbm[] = $d;
            } else {
                $bbm[] = $d;
                if($d->inat_taxa_id == null){
                    $bbm_no_taxa[] = $d;
                    if(!isset($unmatched_taxa[$d->species_name]))
                        $unmatched_taxa[$d->species_name] = 1;
                    else
                        $unmatched_taxa[$d->species_name]++;
                }
            }
        }

        echo "<h1>".count($bbm_no_taxa)."</h1>";
        echo "<table border=1>";
        echo "<tr>";
        foreach($fields as $f){
            echo "<th>".$f."</th>";
        }
        echo "</tr>";
        foreach($bbm_no_taxa as $b){
            echo "<tr>";
            foreach($fields as $f){
                echo "<td>".$b->{$f}."</td>";
            }
            echo "</tr>";
        }
        echo "</table>";
        ksort($unmatched_taxa);
        
        // dd(count(array_unique(array_column($not_bbm, 'boi_id'))));
        dd($unmatched_taxa);

    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        $fields = [ 'boi_id', 'created_date', 'observed_date', 'media_code', 'species_name', 'user', 'life_stage', 'country', 'state', 'district', 'location_name', 'latitude', 'inat_taxa_id', 'longitude'];
        $json_string = file_get_contents(public_path("./data/boi_data.json"));

        $boi_observations = json_decode( preg_replace('/[\x00-\x1F\x80-\xFF]/', '', $json_string), true );
        $inat_taxa = iNatTaxa::get()->keyBy("name");

        foreach($boi_observations as $bo){
            $date = explode(" ", $bo["created"]);
            $created_date = $date[0];
            $date = explode(" ", $bo["photo_date"]);
            $observed_date = $date[0];
            $species_name = $bo["genus"];
            if(substr($bo["species"], 0, 3) != "spp"){
                $species_name .= " " . $bo["species"];
            }



            $boi = new BOI();

            $boi->boi_id = $bo["id"];
            $boi->created_date = $created_date;
            $boi->observed_date = $observed_date;
            $boi->media_code = $bo["media_code"];
            $boi->species_name = $species_name;
            $boi->user = $bo["photographer"];
            $boi->life_stage = $bo["life_stage"];
            $boi->country = $bo["country"];
            $boi->state = $bo["state"];
            $boi->district = $bo["district"];
            $boi->location_name = $bo["spot_location"];
            $boi->latitude = $bo["lat"];
            $boi->longitude = $bo["lng"];

            if(isset($inat_taxa[$boi->species_name])){
                $boi->inat_taxa_id = $inat_taxa[$boi->species_name]->id;
            }

            $boi->save();
        }
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
     * @param  \App\Models\BOI  $bOI
     * @return \Illuminate\Http\Response
     */
    public function show(BOI $bOI)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\BOI  $bOI
     * @return \Illuminate\Http\Response
     */
    public function edit(BOI $bOI)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\BOI  $bOI
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, BOI $bOI)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\BOI  $bOI
     * @return \Illuminate\Http\Response
     */
    public function destroy(BOI $bOI)
    {
        //
    }
}
