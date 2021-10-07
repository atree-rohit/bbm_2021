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
        $ibps = IBP::get();

        foreach($ibps as $i){
            if($i->state == ""){
                $state = $this->get_point_state($i->locationLat, $i->locationLon);
                if($state){
                    $i->state = $state;
                    $i->save();
                }
            } else {
                $i->state = ucwords(strtolower($i->state));
                $i->save();
            }
        }

        $ibps = IBP::get()->groupBy("state");
        echo "<h1>" . count($ibps[""]) . "</h1>";
        $y = $ibps[""]->groupBy("placeName");
        dd($y);
        $known_states = ["Uttar Pradesh", "West Bengal", "Gujarat", "Karnataka"];

        foreach($y as $s => $obs){
            foreach($known_states as $ks){
                if(strpos($s, $ks)) {
                    foreach($obs as $o){
                        $o->state = $ks;
                        $o->save();
                    }
                }
            }
        }

    }

    public function get_point_state($lat, $long)
    {
        $point = [$lat, $long];
        $geojson = json_decode(file_get_contents(public_path('data/country.geojson')));
        $op = false;
        foreach ($geojson->features as $state) {
            $state_name = $state->properties->ST_NM;
            foreach ($state->geometry->coordinates as $polygon) {

                if ($this->in_polygon($polygon, $point)) {
                    $op = $state_name;
                }
            }
        }
        return $op;
    }

    // $points_polygon, $vertices_x, $vertices_y, $longitude_x, $latitude_y)
    public function in_polygon($polygon, $point)
    {
        $points_polygon = count($polygon);
        $longitude_x = $point[1];
        $latitude_y = $point[0];
        $vertices_x = array_column($polygon, 0);
        $vertices_y = array_column($polygon, 1);
        $i = $j = $c = 0;

        for ($i = 0, $j = $points_polygon-1 ; $i < $points_polygon; $j = $i++) {
            if ((($vertices_y[$i] > $latitude_y != ($vertices_y[$j] > $latitude_y)) &&
                ($longitude_x < ($vertices_x[$j] - $vertices_x[$i]) * ($latitude_y - $vertices_y[$i]) / ($vertices_y[$j] - $vertices_y[$i]) + $vertices_x[$i]))) {
                $c = !$c;
            }
        }
        return $c;
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

    public function missingTaxa()
    {
        $ibps = IBP::where("inat_taxa_id", null)->get()->groupBy("scientific_name_cleaned");
        $fields = ["id", "name", "rank", "ancestry"];
        $inat_taxa = iNatTaxa::get()->keyBy("name");
        $taxa_url = "https://api.inaturalist.org/v1/taxa?q=";
        $added_count = 0;

        echo "<h1>".count($ibps)."</h1>";
        // dd($ibps);
        foreach($ibps as $name => $obvs){
            $url = $taxa_url . str_replace(" ", "%20", $name);
            $data = json_decode(file_get_contents($url));

            if(count($data->results) > 0){
                if(!isset($inat_taxa[$data->results[0]->name])){
                    $taxon = new iNatTaxa();
                    foreach ($fields as $f) {
                        $taxon->{$f} = $data->results[0]->{$f};
                    }
                    $taxon->common_name = $data->results[0]->preferred_common_name ?? null;

                    $taxon->save();
                    $taxon_id = $taxon->id;
                    $added_count++;
                }else {
                    $taxon_id = $inat_taxa[$data->results[0]->name]->id;
                }
                foreach($obvs as $o){
                    $o->inat_taxa_id = $taxon_id;
                    $o->save();
                }
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
