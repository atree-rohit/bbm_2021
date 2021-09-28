<?php

namespace App\Http\Controllers;

use App\Models\iNat;
use App\Models\iNatTaxa;
use Illuminate\Http\Request;

class INatController extends Controller
{
    private $inat_taxa;
    private $inat_tree;
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function pull()
    {
        $inat_data = iNat::select("id", "taxa_id")->get();
        $all_taxa = iNat::select("taxa_id")->distinct()->get()->pluck("taxa_id")->toArray();
        $taxa = iNatTaxa::all();
        $saved_taxa = $ancestors = [];

        array_multisort($all_taxa);
        if (($key = array_search(null, $all_taxa)) !== false) {
            unset($all_taxa[$key]);
        }
        foreach ($taxa as $t) {
            $saved_taxa[] = $t->id;
            $ancestry = explode("/", $t->ancestry);
            foreach ($ancestry as $a) {
                if (($a != "") && (!in_array($a, $ancestors))) {
                    $ancestors[] = (int) $a;
                }
            }
        }
        array_multisort($ancestors);
        if (($key = array_search(null, $ancestors)) !== false) {
            unset($ancestors[$key]);
        }

        return view("inat.pull", compact("inat_data", "all_taxa", "saved_taxa", "ancestors"));
    }

    public function index()
    {
        $last_update = strtotime(iNat::latest('updated_at')->first()->updated_at) + 5.5*60*60;
        $last_update = date("d M Y, h:i:s A", $last_update);
        $inat_data = iNat::select("id", "uuid", "observed_on", "location", "place_guess", "state", "taxa_id", "taxa_name", "taxa_rank", "img_url", "user_id", "user_name", "quality_grade", "license_code", "inat_created_at")
                        // ->where("taxa_rank", "family")
                        ->limit(-1)
                        ->get()->toArray();
        $inat_taxa = iNatTaxa::limit(-1)->get()->keyBy("id");
        $this->inat_taxa = $inat_taxa;
        $this->inat_tree = [];
        $ancestors = [];

        foreach ($inat_data as $k=>$id) {
            $timestamp = strtotime($inat_data[$k]["inat_created_at"]);
            $inat_data[$k]["inat_created_at"] = (int) date('d', strtotime('+5 hours +30 minutes', $timestamp));
            // echo $inat_data[$k]["inat_created_at"] . '<br>';
            // $inat_data[$k]["inat_created_at"] = date('D, d M', $timestamp);
            // $this->add_to_tree($id);
        }
        // usort($this->inat_tree, function ($a, $b) {
        //     return count($a) - count($b);
        // });
        // $op = [];
        // foreach ($this->inat_tree as $it) {
        //     switch (count($it)) {
        //         case 1:
        //             $op[$it["superfamily"]] = [];
        //             break;
        //         case 2:
        //             $op[$it["superfamily"]][$it["family"]] = [];
        //             break;
        //         case 3:
        //             $op[$it["superfamily"]][$it["family"]][$it["subfamily"]] = [];
        //             break;
        //         case 4:
        //             $op[$it["superfamily"]][$it["family"]][$it["subfamily"]][$it["tribe"]] = [];
        //             break;
        //         case 5:
        //             $op[$it["superfamily"]][$it["family"]][$it["subfamily"]][$it["tribe"]][$it["genus"]] = [];
        //             break;
        //         case 6:
        //             $op[$it["superfamily"]][$it["family"]][$it["subfamily"]][$it["tribe"]][$it["genus"]] = $it["species"];
        //             break;
        //     }
        // }
        // echo "<pre>";
        // print_r($this->generateTree($op)[0]);
        // echo "</pre>";
        // dd();
        // $inat_tree = $this->inat_tree;

        // dd($op);
        // $inat_tree = $this->generateTree($op);
        $inat_tree = [];

        return view('inat.index', compact("inat_data", "inat_taxa", "inat_tree", "last_update"));
    }

    public function generateTree($op)
    {
        $x = [];
        foreach ($op as $k => $v) {
            if (is_array($v)) {
                $x[] = (object) [
                    "name" => $k,
                    "children" => $this->generateTree($v)
                ];
            } else {
                $x["name"] = $v;
            }
        }
        return $x;
    }

    public function get_ancestry($taxa_id)
    {
        $current = $this->inat_taxa[$taxa_id];
        $ancestry_levels = [ "superfamily", "family", "subfamily", "tribe", "genus", "species"];
        $ancestors_ids = [];
        if ($current) {
            $ancestors_ids = explode("/", $current["ancestry"]);
        }
        $ancestors = [];
        foreach ($ancestry_levels as $a) {
            $ancestors[$a] = "none";
        }
        foreach ($ancestors_ids as $a) {
            if (in_array($this->inat_taxa[$a]["rank"], $ancestry_levels)) {
                $ancestors[$this->inat_taxa[$a]["rank"]] = $this->inat_taxa[$a]["name"];
            }
        }
        $ancestors[$current["rank"]] = $current["name"];

        $erase_flag = true;
        foreach (array_reverse($ancestors) as $l=>$n) {
            if ($n != "none") {
                $erase_flag = false;
            }
            if ($erase_flag && $n == "none") {
                unset($ancestors[$l]);
            }
        }

        return $ancestors;
    }
    public function generateTree0($id_tree)
    {
        $op = [];
        foreach ($id_tree as $row) {
            $parts = explode("+", $row[0]);
            foreach ($parts as $k => $p) {

                // $op[];
            }
        }
        dd($op);
    }

    public function add_to_tree($observation)
    {
        // $ancestry = $this->inat_taxa[$observation["taxa_id"]]->ancestry;
        // $ancestry = str_replace("48460/1/47120/372739/47158/184884/", "", $ancestry);
        // $ancestry = str_replace("/", ",", $ancestry);
        $ancestry = $this->get_ancestry($observation["taxa_id"]);
        // dd($ancestry);
        if (!in_array($ancestry, $this->inat_tree)) {
            $this->inat_tree[] = $ancestry;
        }
    }


    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        $geojson = json_decode(file_get_contents(public_path('data/country.geojson')));
        $inat_data = iNat::where("state", null)->
                        limit(-1)
                        ->get();
        $state_names = [];
        $state_saved = 0;
        foreach ($inat_data as $observation) {
            $state = $this->get_point_state($observation->location);
            if ($state != false) {
                $observation->state = $state;
                $observation->save();
                $state_saved++;
            }
        }

        dd($state_saved);
    }

    public function get_point_state($p)
    {
        $point = explode(",", $p);
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
     * @param  \App\Models\iNat  $iNat
     * @return \Illuminate\Http\Response
     */
    public function show(iNat $iNat)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\iNat  $iNat
     * @return \Illuminate\Http\Response
     */
    public function edit(iNat $iNat)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\iNat  $iNat
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, iNat $iNat)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\iNat  $iNat
     * @return \Illuminate\Http\Response
     */
    public function destroy(iNat $iNat)
    {
        //
    }

    public function update_state(Request $request)
    {
        $inat = iNat::find($request->id);
        $inat->state = $request->state;
        $inat->save();
        return response()->json([], 200);
    }

    public function store_observation(Request $request)
    {
        $fields = ["id", "uuid", "observed_on", "location", "place_guess", "description", "quality_grade", "license_code", "oauth_application_id"];
        // ["inat_created_at", "taxa_name", "taxa_rank", "user_id", "user_name",];
        $obv = new iNat();
        foreach ($fields as $f) {
            $obv->{$f} = $request->{$f} ?? null;
        }
        // dd($request->taxon);
        $obv->inat_created_at = $request->created_at ?? null;
        $obv->taxa_id = $request->taxon["id"] ?? null;
        $obv->taxa_name = $request->taxon["name"] ?? null;
        $obv->taxa_rank = $request->taxon["rank"] ?? null;
        $obv->img_url = $request->observation_photos[0]["photo"]["url"] ?? null;
        if (isset($request->taxon["ancestor_ids"][6]) && $request->taxon["ancestor_ids"][6] == 47157) {
            $obv->is_lepidoptera =  true;
        } else {
            $obv->is_lepidoptera =  false;
        }
        $obv->user_id = $request->user["login"] ?? null;
        $obv->user_name = $request->user["name"] ?? null;

        $state = $this->get_point_state($request->location);
        if ($state != false) {
            $obv->state = $state;
        }
        $obv->save();

        return response()->json([$obv->id], 200);
    }

    public function update_observation(Request $request)
    {
        $obv = iNat::find($request->id);
        $fields = ["observed_on", "location", "place_guess", "description", "quality_grade", "license_code"];
        foreach ($fields as $f) {
            if ($obv->{$f} != $request->{$f}) {
                $obv->{$f} = $request->{$f} ?? null;
            }
        }
        $obv->taxa_id = $request->taxon["id"] ?? null;
        $obv->taxa_name = $request->taxon["name"] ?? null;
        $obv->taxa_rank = $request->taxon["rank"] ?? null;
        $obv->img_url = $request->observation_photos[0]["photo"]["url"] ?? null;
        if (isset($request->taxon["ancestor_ids"][6]) && $request->taxon["ancestor_ids"][6] == 47157) {
            $obv->is_lepidoptera =  true;
        } else {
            $obv->is_lepidoptera =  false;
        }
        $obv->save();

        return response()->json([$obv->id, $obv->taxa_id], 200);
    }


    public function store_taxon(Request $request)
    {
        $fields = ["id", "name", "rank", "ancestry"];
        // "common_name",
        $taxon = new iNatTaxa();
        foreach ($fields as $f) {
            $taxon->{$f} = $request->{$f};
        }
        $taxon->common_name = $request->common_name["name"] ?? null;
        $taxon->save();

        $ancestry = explode("/", $taxon->ancestry);
        $ancestors = [];
        foreach ($ancestry as $a) {
            if ($a != "") {
                $ancestors[] = (int) $a;
            }
        }

        return response()->json([$taxon->id, $ancestors], 200);
    }
}
