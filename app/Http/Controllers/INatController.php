<?php

namespace App\Http\Controllers;

use App\Models\iNat;
use App\Models\iNatTaxa;
use Illuminate\Http\Request;

class INatController extends Controller
{
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
        $inat_data = iNat::select("id", "uuid", "observed_on", "location", "place_guess", "taxa_id", "taxa_name", "taxa_rank", "img_url", "user_id", "user_name", "quality_grade", "license_code", "inat_created_at")->
                        limit(-1)
                        ->get();
        $inat_taxa = iNatTaxa::limit(10)->get();
        return view('inat.index', compact("inat_data", "inat_taxa"));
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
        $obv->save();

        return response()->json([$obv->id], 200);
    }

    public function update_observation(Request $request){
        $obv = iNat::find($request->id);
        $fields = ["observed_on", "location", "place_guess", "description", "quality_grade", "license_code"];
        foreach ($fields as $f) {
            if($obv->{$f} != $request->{$f}){
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

        $ancestory = explode("/", $taxon->ancestry);
        $ancestors = [];
        foreach ($ancestory as $a) {
            if ($a != "") {
                $ancestors[] = (int) $a;
            }
        }

        return response()->json([$taxon->id, $ancestors], 200);
    }
}
