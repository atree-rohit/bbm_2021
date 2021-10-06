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
        $inat_data = iNat::select("id", "uuid", "observed_on", "location", "place_guess", "state", "taxa_id", "taxa_name", "taxa_rank", "img_url", "user_id", "user_name", "quality_grade", "license_code", "inat_created_at")
                        // ->where("taxa_rank", "family")
                        ->limit(-1)
                        ->get()->toArray();
        $inat_taxa = iNatTaxa::limit(-1)->get()->keyBy("id");
        $forms = CountForm::where("flag", 0)->with("rows")->get()->toArray();
        $form_data = [];

        foreach ($inat_data as $k=>$id) {
            $timestamp = strtotime($id["inat_created_at"]);
            $inat_data[$k]["created_at"] = (int) date('d', strtotime('+5 hours +30 minutes', $timestamp));
            $inat_data[$k]["portal"] = "inat";
            $inat_data[$k]["individuals"] = 1;
        }

        // this.form_data.forEach(f => {
        //             let form_details = {
        //                 user_id: f.name,
        //                 user_name: f.name,
        //                 state: f.state,
        //                 location: `${f.latitude},${f.longitude}`,
        //                 created_at: parseInt(f.date_cleaned.split("-")[0]) ?? null,
        //                 img_url: "",
        //                 portal: "counts"
        //             }
        //             f.rows.forEach(s => {
        //                 if(s.flag == 0){
        //                     let row = form_details
        //                     row.id = s.id
        //                     row.taxa_id = s.inat_taxa_id
        //                     row.taxa_name = s.scientific_name_cleaned
        //                     row.taxa_rank = s.id_quality
        //                     row.individuals = s.no_of_individuals_cleaned

        //                     this.all_data.push(row)
        //                 }
        //             })
        //         })
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
