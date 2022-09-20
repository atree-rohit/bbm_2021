<?php

namespace App\Http\Controllers;

use App\Models\iNat;
use App\Models\BOI;
use App\Models\IBP;
use App\Models\iNatTaxa;
use App\Models\IBP22;
use App\Models\INat22;
use App\Models\INatTaxa22;
use App\Models\CountForm;
use App\Models\FormRow;
use Illuminate\Http\Request;
use phpDocumentor\Reflection\PseudoTypes\LowercaseString;

class ResultController extends Controller
{
    private $existing_observation_ids;
    private $existing_taxa_ids;
    private $polygons;

    public function index(){
        $inat = INat22::select("id", "observed_on as date", "taxa_id", "location", "user_name as user_id", "state", "district", "img_url")
                ->get()
                ->toArray();
        $ibp = IBP22::select("id", "fromDate as date","associatedMedia as img_url", "taxa_id", "locationLat as lat", "locationLon as lon",  "createdBy as user_id", "state", "district")
                ->get()
                ->toArray();
        $taxa = INatTaxa22::select("id", "name", "common_name", "rank", "ancestry")->get();
        
        $form_data = [];
        $last_update = "";
        $all_portal_data = [
            "counts" => [],
            "inat" => $inat,
            "ibp" => $ibp,
            "ifb" => [],
        ];
        
        return view('result.index', compact("taxa", "all_portal_data"));
        /*
        */
    }

    public function set_state()
    {
        // $this->polygons = json_decode(file_get_contents(public_path("/data/2022/districts.geojson")))->features;
        // $this->polygons = json_decode(file_get_contents(public_path("/data/2022/states.json")))->features;
        ini_set('max_execution_time', '60'); 
        $this->polygons = json_decode(file_get_contents(public_path("/data/2022/districts_2020_rewind.json")))->features;
        $this->inat_set_state();
        $this->ibp_set_state();
    }

    public function ibp_set_state()
    {
        $ibp = IBP22::where("district", null)
                    ->limit(-1)
                    ->get();
        /*
            echo "<table border='1'>";
            foreach($ibp as $i){
                echo "<tr><td>";
                echo $i->id;
                echo "</td><td>";
                echo $i->locationLat;
                echo "</td><td>";
                echo $i->locationLon;
                echo "</td></tr>";
            }
            echo "</table>";
            return;
        */
        echo "<table border='1'>";
        foreach($ibp as $i){
            $point = [
                $i->locationLat,
                $i->locationLon,
            ];
            $index = 0;
            while($i->district == null && $index < count($this->polygons) ){
                // dd($i);
                $current_polygon = $this->polygons[$index]->geometry->coordinates[0];
                if($this->polygons[$index]->geometry->type == "Polygon"){
                    $in_polygon = $this->is_in_polygon2($point[1], $point[0], $current_polygon);
                    if($in_polygon){
                        $this->save_state_district(
                            $i,
                            $this->polygons[$index]->properties->statename,
                            $this->polygons[$index]->properties->distname
                        );
                        $table_op = [
                            $i->location,
                            $i->place_guess,
                            $this->polygons[$index]->properties->statename,
                            $this->polygons[$index]->properties->distname,
                            $in_polygon
                        ];
                        echo "<tr><td>".  implode("</td><td>", $table_op)."</td></tr>";
                    } else {
                        $index++;
                    }
                } 
                else {
                    foreach($this->polygons[$index]->geometry->coordinates as $p){
                        // echo "<tr><td>".json_encode($this->polygons[$index]->properties->statename)."</td></tr>";
                        $in_polygon = $this->is_in_polygon2($point[1], $point[0], $p[0]);
                        // echo "$in_polygon<br>";
                        if($in_polygon){
                            $this->save_state_district(
                                $i,
                                $this->polygons[$index]->properties->statename,
                                $this->polygons[$index]->properties->distname
                            );
                            $table_op = [
                                $i->location,
                                $i->place_guess,
                                $this->polygons[$index]->properties->statename,
                                $this->polygons[$index]->properties->distname,
                                $in_polygon
                            ];
                            echo "<tr><td>".  implode("</td><td>", $table_op)."</td></tr>";
                        } 
                    }
                    $index++;
                }
            }
        }
        echo "</table>";
    }


    public function inat_set_state()
    {
        $inat = INat22::where("state", null)
                ->get();
        /*
            echo "<table border='1'>";
            foreach($inat as $i){
                $l = explode(",",$i->location);
                echo "<tr><td>";
                echo $i->id;
                echo "</td><td>";
                echo $l[0];
                echo "</td><td>";
                echo $l[1];
                echo "</td></tr>";
            }
            return;
            echo "</table>";
        */

        echo "<table border='1'>";
        foreach($inat as $i){
            $point = explode(",", $i->location);
            $index = 0;
            $state_set = false;
            while($state_set == false && $index < count($this->polygons) ){
                $current_polygon = $this->polygons[$index]->geometry->coordinates[0];
                if($this->polygons[$index]->geometry->type == "Polygon"){
                    $in_polygon = $this->is_in_polygon2($point[1], $point[0], $current_polygon);
                    if($in_polygon){
                        $this->save_state_district(
                            $i,
                            $this->polygons[$index]->properties->statename,
                            $this->polygons[$index]->properties->distname
                        );
                        $table_op = [
                            $i->location,
                            $i->place_guess,
                            $this->polygons[$index]->properties->statename,
                            $this->polygons[$index]->properties->distname,
                            $in_polygon
                        ];
                        echo "<tr><td>".  implode("</td><td>", $table_op)."</td></tr>";
                        $state_set = true;
                    } else {
                        $index++;
                    }
                } 
                else {
                    foreach($this->polygons[$index]->geometry->coordinates as $p){
                        // echo "<tr><td>".json_encode($this->polygons[$index]->properties->statename)."</td></tr>";
                        $in_polygon = $this->is_in_polygon2($point[1], $point[0], $p[0]);
                        if($in_polygon){
                            $this->save_state_district(
                                $i,
                                $this->polygons[$index]->properties->statename,
                                $this->polygons[$index]->properties->distname
                            );
                            $table_op = [
                                $i->location,
                                $i->place_guess,
                                $this->polygons[$index]->properties->statename,
                                $this->polygons[$index]->properties->distname,
                                $in_polygon
                            ];
                            echo "<tr><td>".  implode("</td><td>", $table_op)."</td></tr>";
                            $state_set = true;
                        } 
                    }
                    $index++;
                }
            }
        }
        echo "</table>";
    }

    public function save_state_district($obv, $state, $district)
    {
        $obv->state = $state;
        $obv->district = $district;
        $obv->save();
        
    }
    public function is_in_polygon2($longitude_x, $latitude_y,$polygon)
    {
        $i = $j = $c = 0;
        $points_polygon = count($polygon)-1;
        for ($i = 0, $j = $points_polygon ; $i < $points_polygon; $j = $i++) {
            if ( (($polygon[$i][1]  >  $latitude_y != ($polygon[$j][1] > $latitude_y)) &&
            ($longitude_x < ($polygon[$j][0] - $polygon[$i][0]) * ($latitude_y - $polygon[$i][1]) / ($polygon[$j][1] - $polygon[$i][1]) + $polygon[$i][0]) ) )
                $c = !$c;
        }
        return $c;
    }

    public function index_old()
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
        $boi_data = BOI::select("boi_id", "user as user_id", "location_name as place_guess", "created_date", "observed_date", "country", "latitude as lat", "longitude as long", "species_name as taxa_name", "rank as taxa_rank", "inat_taxa_id as taxa_id", "state")
                        ->where("flag", false)
                        ->where("created_date", "like", "%/09/21%")
                        ->where("observed_date", "like", "%/09/21%")
                        ->where("country", "like", "%India%")
                        ->get()
                        ->groupBy("boi_id")
                        ->toArray();

        $forms = CountForm::where("flag", 0)
                        ->where("date_created_cleaned", ">", 0 )
                        ->where("date_created_cleaned", "<", 91 )
                        ->with("rows")
                        ->get()
                        ->toArray();

        // dd($boi_data->first());

        $form_data = [];
        $ifb_data = [];

        foreach ($inat_data as $k=>$id) {
            $timestamp = strtotime($id["inat_created_at"]);
            $observed_date = explode("-", $id["observed_on"]);

            $inat_data[$k]["date"] = (int) $observed_date[2];
            $inat_data[$k]["user_id"] = ucwords(strtolower(str_replace("_", " ", $id["user_id"])));
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
                $ibp_data[$k]["user_id"] = ucwords(strtolower(str_replace("_", " ", $id["user_id"])));
                $ibp_data[$k]["date"] = (int) $observed[0];
                $ibp_data[$k]["created_date"] = (int) $created[0];

                unset($ibp_data[$k]["lat"]);
                unset($ibp_data[$k]["long"]);
                unset($ibp_data[$k]["createdOn"]);
            }
        }
        foreach($boi_data as $id=>$d){
            $bd = $d[0];

            $observed = explode("/",$bd["observed_date"]);
            $created = explode("/", $bd["created_date"]);

            $bd["id"] = $id;
            $bd["location"] = $bd["lat"] . "," . $bd["long"];
            $bd["date"] = (int) $observed[0];
            $bd["created_date"] = (int) $created[0];

            unset($bd["lat"]);
            unset($bd["long"]);
            unset($bd["observed_date"]);

            $ifb_data[] = $bd;

        }
        $dates = [];
        foreach ($forms as $f) {
            $observed = explode("-", $f["date_cleaned"]);
            $d = [
                "user_id" => ucwords(strtolower($f["name"])),
                "user_name" => ucwords(strtolower($f["name"])),
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
            "inat" => $inat_data,
            "counts" => $form_data,
            "ibp" => $ibp_data,
            "ifb" => $ifb_data,
        ];

        /*
        $fp = fopen('all_data.json', 'w');
        fwrite($fp, json_encode($all_portal_data));
        fclose($fp);
        
        $fp = fopen('all_taxa.json', 'w');
        fwrite($fp, json_encode($inat_taxa));
        fclose($fp);
        */
        
        return view('inat.index', compact("inat_data", "inat_taxa", "form_data", "last_update", "all_portal_data"));
    }


    public function index_atree(){
        $inat = INat22::all()->toArray();
        $taxa = INatTaxa22::select("id", "name", "common_name", "rank", "ancestry")->get();
       
        $atree_staff = ["beenkumarkharka", "pemayangdenlepcha", "mingma_tamang1", "susadhnagurung", "tenzing3", "meghna25", "benoy", "adityazoo",  "rohitmg", "yougesh1", "prakash20", "kajal_limbu"];
        $grouped_data = INat22::with("taxa")->get()->groupBy("user_name");
        $atree_data = [];
        $total_observations = 0;
        $all_observations = [];
        foreach($atree_staff as $a){
            $atree_data[] = [$a, count($grouped_data[$a]), $this->unique_species($grouped_data[$a]->toArray())];
            $all_observations = array_merge($all_observations, $grouped_data[$a]->toArray());
        }
        $total_observations = count($all_observations);
        $unique_species = $this->unique_species($all_observations);
        array_multisort( array_column($atree_data, 1), SORT_DESC, $atree_data );
        echo "<table border=1>";
        foreach($atree_data as $ad){
            echo "<tr><td>$ad[0]</td><td>$ad[1]</td><td>$ad[2]</td></tr>";
        }
        echo "<table>";
        dd($total_observations, $all_observations, $unique_species);

    }

    public function unique_species($data)
    {
        $unique_ids = [];
        foreach($data as $d){
            if(!in_array($d["taxa"]["name"], $unique_ids) && $d["taxa"]["rank"] == "species"){
                $unique_ids[] = $d["taxa"]["name"];
            }
        }
        return count($unique_ids);
        
    }

    public function pull_ibp()
    {
        $file = public_path("data/2022/ibp_20220916-0954.csv");
        $this->existing_observation_ids = IBP22::select("id")->get()->pluck("id")->toArray();
        $this->existing_taxa_ids = INatTaxa22::select("id")->get()->pluck("id")->toArray();
        $fields = ["createdBy", "placeName", "flagNotes", "associatedMedia", "locationLat", "locationLon", "rank", "scientificName", "commonName", "observedInMonth"];
        $headers = [];
        $data = [];
        $open = fopen($file, "r");
        $header_flag = true;
        while(($row = fgetcsv($open, 1000, ",")) !== FALSE){
            if($header_flag){
                $headers = $row;
                $header_flag = false;
            } else if(count($row) !== count($headers)){
                dd("mismatch", $row);
            } else {
                $current_row = [];
                foreach($headers as $k=>$h){
                    $current_row[$h] = $row[$k];
                }
                $data[] = $current_row;
            }
        }
        fclose($open);
        $op = [];
        foreach($data as $d){
            $ibp = new IBP22();
            $ibp->id = $d["catalogNumber"];
            foreach($fields as $f){
                $ibp->{$f} = $d[$f];
            }
            $ibp->createdOn = $this->format_ibp_date($d["createdOn"]);
            $ibp->fromDate = $this->format_ibp_date($d["fromDate"]);
            $ibp->state = ucwords(strtolower($d["state"]));
            $ibp->taxa_id = $this->get_taxa_id_ibp($d);
            $ibp->save();
            $op[] = $ibp->toArray();
        }
        dd($op);
    }

    public function format_ibp_date($date)
    {
        $op = implode("-", array_reverse(explode("/", $date)));
        return $op;
    }

    public function get_taxa_id_ibp($name)
    {
        $search_name = "";
        $search_common_name = "";
        switch($name["rank"]){
            case "species": 
            case "infraspecies": 
                $search_name = explode(" ", $name["scientificName"]);
                if(count($search_name) >1 ){
                    $search_name = $search_name[0] . " " . $search_name[1];                    
                } else {
                    $search_name = $search_name[0];
                }
                $search_common_name = str_replace(":English", "", $name["commonName"]);
                break;
            case "": 
            case "genus": 
            case "subfamily": 
            case "family": 
            case "superfamily": 
                $search_name = $name["scientificName"];
                break;
            default: dd($name);
        }
        if(strlen($search_name) > 0){
            $matches = INatTaxa22::where("name", "like", "%".$search_name."%")->get();
            if(count($matches) !== 0){
                return $matches[0]->id;
            } else {
                if(strlen($search_common_name) > 0){
                    $matches = INatTaxa22::where("common_name", "like", "%".$search_common_name."%")->get();
                }
                if(count($matches) === 1){
                    return $matches[0]->id;
                }
                else {
                    return null;
                }
            }
        }


    }
    public function pull_inat()
    {
        $this->existing_observation_ids = INat22::select("id")->get()->pluck("id")->toArray();
        $this->existing_taxa_ids = INatTaxa22::select("id")->get()->pluck("id")->toArray();
        $inat_records = INat22::all()->keyBy("id");
        
        $page = 1;
        $per_page = 200;
        $total_results = 201;
        $params = [
            "project_id=big-butterfly-month-india-2022",
            "order=desc",
            "order_by=created_at",
        ];
        $url_base = "https://api.inaturalist.org/v1/observations?" . implode("&", $params);
        // $url_base = public_path("data/2022/sample_inat.json");
        $new_flag = true;
        ob_start();

        do{
            $url = $url_base . "&page=$page&per_page=$per_page";
            echo "Getting URL: $url <br>";
            
            flush();
            ob_flush();
            
            $data = json_decode(file_get_contents($url));
            $total_results = $data->total_results;
            $added_count = 0;
            foreach($data->results as $r){
                if(!in_array($r->id, $this->existing_observation_ids)) {
                    $this->add_inat_observation($r);
                    $added_count++;
                } else if($r->updated_at != $inat_records[$r->id]->inat_updated_at) {
                    $this->update_inat_observation($r);
                } else {
                    $added_count--;
                }
            }
            $page++;
            if(($page * $per_page > $total_results) || ($added_count > -2 )){
                $new_flag = false;
            }
        } while($new_flag );
        
        ob_end_flush(); 
        // $this->get_missing_taxa();

        dd("injest csv files", $this->existing_observation_ids, $this->existing_taxa_ids);
    }
    
    public function add_inat_observation($record)
    {
        $cols = ["id", "uuid", "observed_on", "location", "place_guess", "description", "quality_grade", "license_code", "oauth_application_id"];
        // "state",  "is_lepidoptera", "is_selected",  
        if(!in_array($record->taxon->id, $this->existing_taxa_ids)){
            $this->add_inat_taxa($record->taxon);
        }
        $observation = new INat22();
        foreach($cols as $c){
            $observation->{$c} = $record->$c;
        }
        $observation->taxa_id = $record->taxon->id;
        $observation->img_url = $record->photos[0]->url ?? null;
        $observation->user_id = $record->user->id;
        $observation->user_name = $record->user->login;
        $observation->inat_created_at = $record->created_at;
        $observation->inat_updated_at = $record->updated_at;
        $observation->save();
        $this->existing_observation_ids[] = $observation->id;        
    }

    public function update_inat_observation($record)
    {
        $cols = ["observed_on", "location", "place_guess", "description", "quality_grade", "license_code"];
        if(!in_array($record->taxon->id, $this->existing_taxa_ids)){
            $this->add_inat_taxa($record->taxon);
        }
        $observation = INat22::find($record->id);
        foreach($cols as $c){
            $observation->{$c} = $record->$c;
        }
        $observation->taxa_id = $record->taxon->id;
        $observation->img_url = $record->photos[0]->url ?? null;
        $observation->inat_updated_at = $record->updated_at;
        $observation->save();
    }

    public function add_inat_taxa($new_taxa)
    {
        $taxa = new INatTaxa22();
        $taxa->id = $new_taxa->id;
        $taxa->name = $new_taxa->name;
        $taxa->common_name = $new_taxa->preferred_common_name ?? null;
        $taxa->rank = $new_taxa->rank;
        $taxa->ancestry = $new_taxa->ancestry;
        $taxa->save();
        $this->existing_taxa_ids[] = $taxa->id;
    }

    public function get_missing_taxa()
    {
        $missing_taxa = [];
        $ancestors = INatTaxa22::all()->pluck("ancestry")->toArray();
        foreach($ancestors as $a){
            $keys = explode("/", $a);
            foreach($keys as $k){
                $l = (int) $k;
                if(!in_array($l, $this->existing_taxa_ids) && !in_array($l, $missing_taxa) && $l != 0){
                    $missing_taxa[] = $l;
                }
            }
        }
        asort($missing_taxa);
        ob_start();
        foreach($missing_taxa as $mt){
            $url = "https://api.inaturalist.org/v1/taxa/$mt";

            echo "saving Taxa: $mt<br>";
            flush();
            ob_flush();

            $data = json_decode(file_get_contents($url));
            // dd($mt, $data);
            $this->add_inat_taxa($data->results[0]);
        }
        ob_end_flush(); 
        dd($this->existing_taxa_ids);
    }

    public function get_taxa_id($taxa, $data)
    {
        
        $taxa_id = $taxa->where("name", "like", $data["scientific_name"])->first();
        if($taxa_id){
            $taxa_id = $taxa_id->id;
        } else {
            $taxa_id = INatTaxa22::where("common_name", "like", "%". $data["common_name"] ."%")->get()->first();
            if($taxa_id){
                // dd($taxa_id);
                $taxa_id = $taxa_id->id;
            } else {
                dd($data, $taxa_id);
            }
            // $taxa_id = $taxa->where()
        }
        return $taxa_id;
    }
}
