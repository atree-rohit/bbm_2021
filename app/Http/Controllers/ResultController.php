<?php

namespace App\Http\Controllers;

use App\Models\iNat;
use App\Models\iNatTaxa;
use App\Models\CountForm;
use App\Models\FormRow;
use Illuminate\Http\Request;

class ResultController extends Controller
{
    public function index()
    {
        $last_update = strtotime(iNat::latest('updated_at')->first()->updated_at) + 5.5*60*60;
        $last_update = date("d M Y, h:i:s A", $last_update);

        $inat_taxa = iNatTaxa::select("id", "name", "common_name", "rank", "ancestry")
                                ->limit(-1)
                                ->get()
                                ->keyBy("id");
        
        $inat_data = iNat::select("id", "uuid", "observed_on", "location", "place_guess", "state", "taxa_id", "taxa_name", "taxa_rank", "img_url", "user_id", "user_name", "quality_grade", "license_code", "inat_created_at")
                        // ->limit(1000)
                        ->get()
                        ->toArray();
        $forms = CountForm::where("flag", 0)
                        // ->limit(50)
                        ->with("rows")
                        ->get()
                        ->toArray();
        
        $inat_unset_fields = ["uuid", "observed_on", "quality_grade", "license_code", "inat_created_at"];
        $form_data = [];

        foreach ($inat_data as $k=>$id) {
            $timestamp = strtotime($id["inat_created_at"]);
            $inat_data[$k]["created_at"] = (int) date('d', strtotime('+5 hours +30 minutes', $timestamp));
            $inat_data[$k]["portal"] = "inat";
            $inat_data[$k]["individuals"] = 1;
            foreach($inat_unset_fields as $iuf){
                unset($inat_data[$k][$iuf]);
            }
        }
        foreach ($forms as $f) {
            $created = explode("-", $f["date_cleaned"]);
            $d = [
                "user_id" => $f["name"],
                "user_name" => $f["name"],
                "state" => $f["state"],
                "location" => $f["latitude"] . ",". $f["longitude"],
                "created_at" => $created[0],
                "img_url" => "",
                "portal" => "counts"
            ];
            foreach ($f["rows"] as $r) {
                if ($r["flag"] == 0) {
                    $d1 = $d;
                    $d1["id"] = $r["id"];
                    $d1["taxa_id"] = $r["inat_taxa_id"];
                    $d1["taxa_name"] = $r["scientific_name_cleaned"];
                    $d1["taxa_rank"] = $r["id_quality"];
                    $d1["individuals"] = $r["no_of_individuals_cleaned"];
                    $form_data[] = $d1;
                }
            }
        }


        return view('inat.index', compact("inat_data", "inat_taxa", "form_data", "last_update"));
    }
}
