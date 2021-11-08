<?php

namespace App\Http\Controllers;

use App\Models\iNat;
use App\Models\BOI;
use App\Models\IBP;
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

        $inat_data = iNat::select("id", "location", "place_guess", "state", "taxa_id", "taxa_name", "taxa_rank", "img_url", "user_id", "user_name", "inat_created_at", "observed_on")
                        // ->limit(1000)
                        ->where("inat_created_at", "LIKE", "%2021-09-%")
                        ->get()
                        ->toArray();
        $ibp_data = IBP::select("id", "createdBy as user_id", "placeName as place_guess", "createdOn", "associatedMedia as img_url", "locationLat as lat", "locationLon as long", "rank as taxa_rank", "scientific_name_cleaned  as taxa_name", "inat_taxa_id as taxa_id", "state", "fromDate", "flagNotes")
                        ->whereNotNull("state")
                        ->whereNotNull("inat_taxa_id")
                        ->where("fromDate", "LIKE", "%09/2021")
                        ->where("flagNotes", "not Like", "%uplicate%")
                        ->where("locationLat", ">", "0")
                        ->get()
                        ->toArray();
        $boi_data = BOI::select("boi_id as id", "user as user_id", "location_name as place_guess", "created_date", "observed_date", "country", "latitude as lat", "longitude as long", "species_name as taxa_name", "inat_taxa_id as taxa_id", "state")
                        ->where("flag", false)
                        ->where("created_date", "like", "%/09/21%")
                        ->where("observed_date", "like", "%/09/21%")
                        ->where("country", "like", "%India%")
                        ->get()
                        ->toArray();

        $forms = CountForm::where("flag", 0)
                        // ->limit(50)
                        ->with("rows")
                        ->get()
                        ->toArray();

        // dd($boi_data->first());

        $form_data = [];

        foreach ($inat_data as $k=>$id) {
            $timestamp = strtotime($id["inat_created_at"]);
            $observed_date = explode("-", $id["observed_on"]);

            $inat_data[$k]["date"] = (int) $observed_date[2];
            $inat_data[$k]["created_date"] = (int) date('d', strtotime('+5 hours +30 minutes', $timestamp));
            $inat_data[$k]["date"] = (int) $observed_date[2];
            $inat_data[$k]["individuals"] = 1;
            unset($inat_data[$k]["inat_created_at"]);
        }
        foreach($ibp_data as $k=>$id){
            if($id["state"] != null){
                $observed = explode("/",$id["fromDate"]);
                $created = explode("/", $id["createdOn"]);

                $ibp_data[$k]["location"] = $id["lat"] . ",". $id["long"];
                $ibp_data[$k]["date"] = (int) $observed[0];
                $ibp_data[$k]["created_date"] = (int) $created[0];

                unset($ibp_data[$k]["lat"]);
                unset($ibp_data[$k]["long"]);
                unset($ibp_data[$k]["createdOn"]);
            }
        }
        foreach($boi_data as $k=>$bd){
            $observed = explode("/",$bd["observed_date"]);
            $created = explode("/", $bd["created_date"]);

            $boi_data[$k]["location"] = $bd["lat"] . "," . $bd["long"];
            $boi_data[$k]["date"] = (int) $observed[0];
            $boi_data[$k]["created_date"] = (int) $created[0];

            unset($boi_data[$k]["lat"]);
            unset($boi_data[$k]["long"]);
            unset($boi_data[$k]["observed_date"]);

        }
        $dates = [];
        foreach ($forms as $f) {
            $observed = explode("-", $f["date_cleaned"]);
            $d = [
                "user_id" => $f["name"],
                "user_name" => $f["name"],
                "state" => $f["state"],
                "location" => $f["latitude"] . ",". $f["longitude"],
                "date" => (int) $observed[0],
                "created_date" => $f["date_created_cleaned"],
                "img_url" => "",
            ];
            foreach ($f["rows"] as $r) {
                if ($r["flag"] == 0 && $r["inat_taxa_id"] != null) {
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
        $all_portal_data = [
            "counts" => $form_data,
            "inat" => $inat_data,
            "ibp" => $ibp_data,
            "boi" => $boi_data,
        ];

        return view('inat.index', compact("inat_data", "inat_taxa", "form_data", "last_update", "all_portal_data"));
    }
}
