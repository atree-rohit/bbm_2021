<?php

namespace App\Http\Controllers;

use App\Models\BOI;
use App\Models\IBP;
use App\Models\iNat;
use App\Models\IBP22;
use App\Models\INat22;
use App\Models\FormRow;
use App\Models\iNatTaxa;
use App\Models\CountForm;
use App\Models\INatTaxa22;
use Hamcrest\Type\IsString;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use phpDocumentor\Reflection\PseudoTypes\LowercaseString;

class ResultController extends Controller
{
    private $existing_observation_ids;
    private $existing_taxa_ids;
    private $polygons;
    private $limit;
    private $users;

    //API Functions

    public function grouped_data()
    {
        $data = [
            2020 => $this->get_data(2020)->original,
            2021 => $this->get_data(2021)->original,
            2022 => $this->get_data(2022)->original,
        ];
        $this->users = [];
        $this->limit = -1;
        $op = [];
        
        foreach($data as $year => $y){
            foreach($y as $portal => $p){
                foreach($p as $state => $s){
                    foreach($s as $district => $d){
                        if(!isset($op[$state][$district][$year][$portal])){
                            $op[$state][$district][$year][$portal] = [];
                        }
                        foreach($d as $row){
                            $user_id = $this->get_user_id($row["user_id"], $portal);
                            if(!isset($op[$state][$district][$year][$portal][$row["taxa_id"]])){
                                $op[$state][$district][$year][$portal][$row["taxa_id"]][] = [$user_id, $row["date"], 1];
                            } else {
                                $new_flag = true;
                                foreach($op[$state][$district][$year][$portal][$row["taxa_id"]] as $k => $v){
                                    if($v[0] == $user_id && $v[1] == $row["date"]){
                                        $new_flag = false;
                                        $op[$state][$district][$year][$portal][$row["taxa_id"]][$k][2] += 1;
                                    }
                                }
                                if($new_flag){
                                    $op[$state][$district][$year][$portal][$row["taxa_id"]][] = [$user_id, $row["date"], 1];
                                }
                            }
                        }
                    }
                }
            }
        }

        $taxa = INatTaxa22::select("id", "name", "common_name", "rank", "ancestry")->get()->toArray();
        
        // dd(strlen(json_encode($data)), strlen(json_encode($op)), strlen(json_encode($this->users)));
        $data = [
            "data" => $op,
            "users" => $this->users,
            "taxa" => $taxa,
        ];
        return response($data, 200)
            ->header('Content-Type', 'application/json');
    }

    public function get_user_id($user, $portal)
    {
        foreach($this->users as $id => $u){
            if($u["name"] == $user && $u["portal"] == $portal){
                return ($id);
            }
        }
        $this->users[] = [
            "name" => $user,
            "portal" => $portal
        ];
        return count($this->users);
    }

    public function get_data($year)
    {
        $this->limit = -1;
        $all_data = [
            "counts" => $this->get_counts_data_array_2022($year), 
            // "inat" => $this->get_inat_data_array_2022($year), 
            // "ibp" => $this->get_ibp_data_array_2022($year), 
        ];
        return response($all_data, 200)
            ->header('Content-Type', 'application/json');
    }

    public function get_taxa()
    {
        $taxa = INatTaxa22::select("id", "name", "common_name", "rank", "ancestry")->get()->keyBy("id");
        return response($taxa, 200)
            ->header('Content-Type', 'application/json');;
    }

    public function get_counts_data_array_2022($pull_year)
    {
        $data = CountForm::where("flag", false)
            ->with("rows_cleaned")
            ->limit($this->limit)
            ->get();

        $op = [];

        foreach($data as $d){
            if($d->date_cleaned != null){
                
                $row["date"] = $this->format_date_js($d->date_cleaned);
                $date = explode("-",$row["date"]);
                $year = $date[0];
                // $row["date_created"] = substr($d->created_at, 0, strpos($d->created_at, " "));
                // $row["lat"] = $d->latitude;
                // $row["lon"] = $d->longitude;
                $row["user_id"] = $d->name;
                // $row["district"] = $d->district;
                if($year == $pull_year){
                    foreach($d->rows_cleaned as $sp){
                        if($sp->flag == 0){
                            // $row["id"] = $sp->id;
                            $row["taxa_id"] = $sp->inat_taxa_id;
                            $row["date"] = (int) substr($row["date"], -2);
                            // $row["individuals"] = (int) $sp->individuals;
                            
                            $op[$d->state][$d->district][] = $row;
                        }
                    }
                }
            } else {
                dd($d);
            }
        }
        return $op;
    }

    public function get_inat_data_array_2022($pull_year)
    {
        $inat = INat22::select("id", "observed_on as date", "taxa_id", "user_name as user_id", "state", "district")
                ->where("observed_on", "like", "%$pull_year%")
                ->limit($this->limit)
                ->get()
                ->toArray();
        $op = [];

        foreach($inat as $k=>$i){
            $year = explode("-", $i["date"])[0];
            $state = $i["state"];
            $district = $i["district"];
            $i["date"] = (int) substr($i["date"], -2);
            unset($i["state"]);
            unset($i["district"]);
            unset($i["id"]);
            $op[$state][$district][] = $i;
        }
        return $op;
    }

    public function get_ibp_data_array_2022($pull_year)
    {
        $ibp = IBP22::select("id", "fromDate as date", "createdOn as date_created", "taxa_id",  "createdBy as user_id", "state", "district")
                ->where("fromDate", "like", "%$pull_year%")
                ->whereNotNull("taxa_id")
                ->limit($this->limit)
                ->get()
                ->toArray();
        //filter out the ones outside the date range    
        $filtered = [];
        $op = [];
        foreach($ibp as $i){
            $date = explode("T", $i["date"]);
            $year = explode("-", $date[0])[0];
            $state = $i["state"];
            $district = $i["district"];
            $i["date"] = (int) substr($i["date"], -2);
            if((int) $year > 2019 && (int) $year < 2023){
                unset($i["state"]);
                unset($i["id"]);
                $op[$state][$district][] = $i;
            }
        }
        
        return $op;
    }

    //Controller functions
    public function index(){
        $debug_flag = false;
        if(isset($_GET["debug"]) && $_GET["debug"] == 1){
            $debug_flag = true;
        }
        
        return view('result.index_2022', compact("debug_flag"));
    }

    public function get_counts_data_array()
    {
        $data = CountForm::where("flag", false)
            ->with("rows_cleaned")
            ->get();

        $op = [];


        foreach($data as $d){
            if($d->date_cleaned != null){
                $row = [
                    "portal" => "counts",
                ];
                $row["id"] = $d->id;
                $row["date"] = $this->format_date_js($d->date_cleaned);
                $row["date_created"] = substr($d->created_at, 0, strpos($d->created_at, " "));
                $row["lat"] = $d->latitude;
                $row["lon"] = $d->longitude;
                $row["user_id"] = $d->name;
                $row["state"] = $d->state;
                $row["district"] = $d->district;
                foreach($d->rows_cleaned as $sp){
                    if($sp->flag == 0){
                        $row["taxa_id"] = $sp->inat_taxa_id;
                        $row["individuals"] = (int) $sp->individuals;
                        $op[] = $row;
                    }
                }
            } else {
                dd($d);
            }
        }
        return $op;
    }

    public function format_date_js($date)
    {
        
        $arr = explode("-", $date);
        if((int) $arr[2] > 2019 && (int) $arr[2] < 2023){
            return $arr[2] . "-" . $arr[1] . "-" . $arr[0];
        } else {
            dd($date, $arr);
        }
    }

    public function get_inat_data_array($taxa)
    {
        $inat = INat22::select("id", "observed_on as date","inat_created_at as date_created", "taxa_id", "location", "user_name as user_id", "state", "district")
                ->limit(-1)
                ->get()
                ->toArray();
        foreach($inat as $k=>$i){
            $coords = explode(",", $i["location"]);
            $created_date = explode("T", $inat[$k]["date_created"]);
            // $inat[$k]["date"] = str_replace("/", "-", $inat[$k]["date"]);
            $inat[$k]["date"] = date("Y-m-d", strtotime($inat[$k]["date"]) );

            $inat[$k]["lat"] = $coords[0];
            $inat[$k]["lon"] = $coords[1];
            $inat[$k]["date_created"] = $created_date[0];
            $inat[$k]["rank"] = $taxa[$inat[$k]["taxa_id"]]["rank"];
            $inat[$k]["portal"] = "inat";
            unset($inat[$k]["location"]);
        }
        return $inat;
    }

    public function get_ibp_data_array($taxa)
    {
        $ibp = IBP22::select("id", "fromDate as date", "createdOn as date_created", "taxa_id", "locationLat as lat", "locationLon as lon",  "createdBy as user_id", "state", "district")
                // ->where("fromDate", "like", "%2022-09%")
                ->whereNotNull("taxa_id")
                ->limit(-1)
                ->get()
                ->toArray();
        //filter out the ones outside the date range    
        $filtered = [];
        foreach($ibp as $i){
            $date = explode("T", $i["date"]);
            $date = explode("-", $date[0]);
            if((int) $date[0] > 2019 && (int) $date[0] < 2023){
                $filtered[] = $i;
            }
        }
        foreach($filtered as $k => $i){
            $filtered[$k]["rank"] = $taxa[$filtered[$k]["taxa_id"]]["rank"];
            $filtered[$k]["portal"] = "ibp";
        }
        return $filtered;
    }

    public function ibp_fix_1()
    {
        $data = [
            "district" => IBP22::where('district', null)->get(),
            "taxa" => IBP22::where('taxa_id', null)->get(),
        ];
        // $this->polygons = json_decode(file_get_contents(public_path("/data/2022/districts_2020_rewind.json")))->features;
        $this->polygons = json_decode(file_get_contents(public_path("/data/2022/districts_2020_rewind.json")))->features;
        echo "<table>";
        // $record = $data["district"]->first();
        foreach($data["district"] as $record){
            foreach($this->polygons as $p){
                $state = $p->properties->statename;
                $district = $p->properties->distname;
                echo "<h1>$district ".$p->geometry->type."</h1>";
                $state_polygons = $p->geometry->coordinates;
                if($p->geometry->type == "Polygon"){
                    foreach($state_polygons as $dist_polygon){
    
                        $flag = $this->isWithinBounds($record->locationLat, $record->locationLon, $dist_polygon);
                        if($flag){
                            dd($flag);
                        }
                    }
                } else {
                    foreach($state_polygons as $dist_polygon){
    
                        $flag = $this->isWithinBounds($record->locationLat, $record->locationLon, $dist_polygon[0]);
                        if($flag){
                            dd($flag);
                        }
                        if(isset($dist_polygon[2])){
                            dd($state_polygons);
                        }
                    }                    
                }
    
                $row = [
                    count($p->geometry->coordinates),
                    str_replace("]],[[", "]],<br><br>[[", json_encode($p->geometry->coordinates)),
                    $flag
    
                ];
                if($row[2]){
                echo "<tr><td>" . implode("</td><td>", $row) . "</td></tr>";
                }
            }
            // dd();
        }
        
        echo "</table>";
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

    public function pull()
    {
        $this->existing_taxa_ids = INatTaxa22::all()->pluck("id")->toArray();
        $result = [];
        // dd($this->counts_export_json());
        // $result = $this->pull_inat_csv();
        // dd($result);
        
        // $result["counts"] = $this->pull_counts();
        // dd($this->get_missing_inat_taxa());


        $result["inat"] = $this->pull_inat();
        $result["ibp"] = $this->pull_ibp();
        $result["taxa"] = $this->get_missing_taxa();
        dd($result);
    }

    public function get_missing_inat_taxa()
    {
        $observations = INat22::where("taxa_id", null)->get();
        $count = [
            "total" => 0,
            "new_taxa" => 0,
        ];
        foreach($observations as $o){
            $data = json_decode(file_get_contents("https://www.inaturalist.org/observations/".$o->id.".json"));
            if(!in_array($data->taxon->id, $this->existing_taxa_ids)){
                $this->add_inat_taxa($data->taxon);
                $count["new_taxa"]++;
            }
            $o->taxa_id = $data->taxon->id;
            $count["total"]++;
            $o->save();
        }
        return $count;
    }

    public function pull_inat_csv()
    {
        $row = [];
        $open = fopen(public_path("/data/20_22/inat_3_yrs.csv"), "r");
        $headers_set = false;
        $headers  = [];
        $count = [
            "added_with_taxa_id" => 0,
            "added_without_taxa_id" => 0,
            "skipped" => 0,
        ];
        $col_map = [
            "id" => "id",
            "observed_on" => "observed_on",
            "place_guess" => "place_guess",
            "state" => "place_admin1_name",
            "user_id" => "user_id",
            "user_name" => "user_name",
            "quality_grade" => "quality_grade",
            "img_url" => "image_url",
            "license_code" => "license",
            "inat_created_at" => "created_at",
            "inat_updated_at" => "updated_at",
        ];
        $taxa = INatTaxa22::all()->pluck("id", "name")->toArray();
        $existing_observation_ids = INat22::all()->pluck("id")->toArray();

        while (($data = fgetcsv($open, 10000, ",")) !== FALSE) 
        {
            if(!$headers_set){
                $headers = $data;
                $headers_set = true;
            } else {
                $row = [];
                foreach($headers as $k=> $v){
                    $row[$v] = $data[$k];
                }
                if(!in_array($row["id"], $existing_observation_ids)){
                    $row_cleaned = new INat22();
                    foreach($col_map as $k=>$v){
                        $row_cleaned->$k = $row[$v];
                    }
                    $row_cleaned->location = $row["latitude"].",".$row["longitude"];
                    if(isset($taxa[$row["scientific_name"]])){
                        $row_cleaned->taxa_id = $taxa[$row["scientific_name"]];
                        $count["added_with_taxa_id"]++;
                    } else {
                        $row_cleaned->taxa_id = null;
                        $count["added_without_taxa_id"]++;
                    }
                    $row_cleaned->save();
                } else {
                    $count["skipped"]++;
                }
                
            }
        }
        dd($count);
    }

    public function counts_export_json()
    {
        $forms = DB::connection('mysql2')->select("SELECT * FROM `count_forms`");
        $rows = DB::connection('mysql2')->select("SELECT * FROM `form_rows`");
        $op = [];
        foreach($forms as $f){
            $row = $f;
            if($row->duplicate == false){
                $coords = explode(",", $row->coordinates);
                $row->latitude = trim($coords[0]);
                $row->longitude = trim($coords[1]);
                $row->original_filename = $row->filename;
                unset($row->filename);
                $row->rows = $this->get_form_rows($rows, $f->id);
                $op[] = $row;
            }
        }
        file_put_contents(public_path("data/20_22/counts2020_20221107.json"), json_encode($op));
        return count($op);
    }

    public function pull_counts()
    {
        $data = json_decode(file_get_contents(public_path("data/20_22/counts2020_20221107.json")));
        $count = [
            "forms" => 0,
            "rows" => 0,
        ];
        $cols = ['name', 'affiliation', 'phone', 'email', 'team_members', 'photo_link', 'location', 'state', 'district', 'coordinates', 'latitude', 'longitude', 'date', 'date_cleaned', 'start_time', 'end_time', 'altitude', 'distance', 'weather', 'comments', 'file', 'original_filename', 'duplicate', 'flag', 'validated', 'date_created_cleaned', 'created_at', 'updated_at'];
        $row_cols = ['sl_no', 'common_name', 'scientific_name', 'no_of_individuals_cleaned', 'remarks', 'id_quality', 'flag', 'created_at', 'updated_at'];

        foreach($data as $form){
            if($form->duplicate == 0){
                $count_form = new CountForm();
                foreach($cols as $col){
                    $count_form->$col = $form->$col ?? null;
                }
                if($count_form->flag == null){
                    $count_form->flag = false;
                }
                $count_form->validated = false;
                $count_form->save();
                $count["forms"]++;
                foreach($form->rows as $row){
                    if($row->id_quality != "flag") {
                        $new_row = new FormRow();
                        $new_row->count_form_id = $count_form->id;
                        $new_row->individuals = $count_form->no_of_individuals;
                        foreach($row_cols as $col){
                            $new_row->$col = $row->$col ?? null;
                        }
                        if($count_form->flag == null){
                            $count_form->flag = false;
                        }
                        // dd($count_form, $new_row);
                        $new_row->save();
                        $count["rows"]++;
                    }
                }
            }
        }
        return $count;
    }

    public function get_form_rows($rows, $val)
    {
        $op = [];
        foreach($rows as $r){
            if($r->count_form_id == $val){
                $op[] = $r;
            }
        }
        return $op;
    }

    public function pull_ibp()
    {
        // $filename = $this->get_latest_ibp_csv_filename();
        // $file = public_path("data/2022/ibp/$filename");
        $file = public_path("data/20_22/ibp_all_butterflies_in_sept_20221102.csv");
        $this->existing_observation_ids = IBP22::select("id")->get()->pluck("id")->toArray();
        $this->existing_taxa_ids = INatTaxa22::select("id")->get()->pluck("id")->toArray();
        $ibp_records = IBP22::all()->keyBy("id");


        $headers = [];
        $data = [];
        $open = fopen($file, "r");
        $header_flag = true;
        while(($row = fgetcsv($open, 1000, ",")) !== FALSE){
            if($header_flag){
                $headers = $row;
                $header_flag = false;
            } else if(count($row) > count($headers)){
                dd("mismatch", $row, $headers);
            } else {
                $current_row = [];
                foreach($headers as $k=>$h){
                    $current_row[$h] = $row[$k]??null;
                }
                $data[] = $current_row;
            }
        }
        fclose($open);
        $counts = [
            "added" => 0,
            "updated" => 0,
        ];
        foreach($data as $d){
            if(!in_array($d["catalogNumber"], $this->existing_observation_ids)) {
                $new_observation = $this->add_ibp_observation($d);
                if($new_observation->id != -1){
                    $ibp_records->put($new_observation->id, $new_observation);
                    $counts["added"]++;
                }
            } else if($this->update_ibp_observation($d)){
                $counts["updated"]++;
            }
        }
        return $counts;
    }

    public function get_latest_ibp_csv_filename()
    {
        $dir = scandir(public_path("data/2022/ibp"));
        $last_file_date = "";
        $current_file_date = "";
        foreach($dir as $d){
            if(strpos($d, ".csv")){
                $parts = explode("-",str_replace("ibp_", "", str_replace(".csv", "", $d)));
                $current_file_date = [
                    "date" => (int) $parts[0],
                    "time" => (int) $parts[1],
                ];
                if(
                    ($last_file_date == "")
                    || ($current_file_date["date"] > $last_file_date["date"])
                    || ($current_file_date["date"] == $last_file_date["date"] && ($current_file_date["time"] > $last_file_date["time"]))
                ){
                    $last_file_date = $current_file_date;
                }
            }
        }
        return "ibp_" . strval($last_file_date["date"]) . "-" . strval($last_file_date["time"]) . ".csv";
    }
    
    public function add_ibp_observation($record)
    {
        $cols = ["createdBy", "placeName", "flagNotes", "associatedMedia", "locationLat", "locationLon", "rank", "scientificName", "commonName", "observedInMonth"];
        $ibp = new IBP22();
        $ibp->id = $record["catalogNumber"];
        foreach($cols as $c){
            $ibp->{$c} = $record[$c];
        }
        if(isset($record["createdOn"]) && isset($record["fromDate"])){
            $ibp->createdOn = $this->format_ibp_date($record["createdOn"]);
            $ibp->fromDate = $this->format_ibp_date($record["fromDate"]);
            // $ibp->state = ucwords(strtolower($record["state"]));
            $ibp->taxa_id = $this->get_taxa_id_ibp($record);
            if($this->check_ibp_month($ibp->createdOn) && $this->check_ibp_month($ibp->fromDate)){
                echo "yes - " . $ibp->createdOn . " - " . $ibp->fromDate . "<br>";
                $ibp->save();
            } else {
                echo "no - " . $ibp->createdOn . " - " . $ibp->fromDate . "<br>";
            }
        } else {
            $ibp->id = -1;
        }
        return $ibp;
    }

    public function check_ibp_month($date)
    {
        $arr = explode("-", $date);
        return (int) $arr[1] == 9;
    }

    public function update_ibp_observation($record)
    {
        $cols = ["placeName","flagNotes","associatedMedia","locationLat","locationLon","rank","scientificName","commonName","observedInMonth"];
        $ibp = IBP22::find($record["catalogNumber"]);
        foreach($cols as $c){
            $ibp->{$c} = $record[$c];
        }
        if(isset($record["createdOn"]) && isset($record["fromDate"])){
            $ibp->createdOn = $this->format_ibp_date($record["createdOn"]);
            $ibp->fromDate = $this->format_ibp_date($record["fromDate"]);
            // $ibp->state = ucwords(strtolower($record["state"]));
            $ibp->taxa_id = $this->get_taxa_id_ibp($record);
            if($ibp->isDirty()){
                $ibp->save();
                return true;
            }
        }
        
        return false;
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
        $inat_records = INat22::all()->keyBy("id");

        $page = 1;
        $per_page = 200;
        $total_results = 201;
        $params = [
            "project_id=big-butterfly-month-india-2022",
            "order=desc",
            "order_by=updated_at",
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
                    $new_observation = $this->add_inat_observation($r);
                    $inat_records->put($new_observation->id, $new_observation);
                    $added_count++;
                } else if($r->updated_at != $inat_records[$r->id]->inat_updated_at) {
                    $this->update_inat_observation($r);
                } else {
                    $added_count--;
                }
            }
            $page++;
            if(($page * $per_page > $total_results) || ($added_count < -5 )){
                echo "<br><hr><br>";
                echo $page . "*" . $per_page > $total_results;
                echo "<br>";
                echo $added_count;
                echo "<br><hr><br>";
                $new_flag = false;
            }
        } while($new_flag );
        
        ob_end_flush(); 
        return [
            "observations" => count($this->existing_observation_ids),
        ];
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
        return $observation;
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
        $all_taxa = INatTaxa22::all();
        $taxa = [
            "inat" => array_unique(INat22::select("taxa_id")->get()->pluck("taxa_id")->toArray()),
            "ibp" => array_unique(IBP22::select("taxa_id")->get()->pluck("taxa_id")->toArray()),
            "counts" => array_unique(FormRow::all()->pluck("inat_taxa_id")->toArray())
        ];
        $keyed_taxa = $all_taxa->keyBy("id");
        $missing_taxa = [];

        foreach(array_keys($taxa) as $type) {
            foreach($taxa[$type] as $t){
                if(!isset($keyed_taxa[$t]) && $t != null){
                    $missing_taxa[] = $t;
                }
            }
        }
        // dd($missing_taxa);
        $ancestors = $all_taxa->pluck("ancestry")->toArray();
        
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
        $added = 0;
        ob_start();
        foreach($missing_taxa as $mt){
            if($this->pull_taxa_details($mt)){
                $added++;
            }
        }
        return [
            "missing" => $missing_taxa,
            "total_missing" => count($missing_taxa),
            "missing_taxa_added" => $added,
            "total_taxa" => count($this->existing_taxa_ids)
        ];
    }

    public function pull_taxa_details($taxa_id)
    {
        $url = "https://api.inaturalist.org/v1/taxa/$taxa_id";

        echo "saving Taxa: $taxa_id<br>";
        flush();
        ob_flush();

        $data = json_decode(file_get_contents($url));
        $taxa_id = $data->results[0]->id ?? null;
        if(!in_array($data->results[0]->id, $this->existing_taxa_ids)){
            $this->add_inat_taxa($data->results[0]);
            return true;
        }
        return false;
    }

    public function fix()
    {   
        $this->polygons = json_decode(file_get_contents(public_path("/data/2022/districts_2020_rewind.json")))->features;
        // dd($this->counts_set_district()->toArray());
        // dd($this->counts_set_district());
        $data = INat22::where("user_name", "")->get()->groupBy("user_id");
        $added = 0;
        foreach($data as $k=>$v){
            $x = json_decode(file_get_contents("https://www.inaturalist.org/users/$k.json"));
            foreach($v as $obv){
                $obv->user_name = $x->login;
                $obv->save();
                $added++;
            }
        }
        dd($added);

        $this->inat_set_state();
        $this->ibp_set_state();


        $inat = INat22::all();
        $ibp = IBP22::all();
        $data = [
            "inat" => [
                "state" => $inat->where("state", null)->toArray(),
                "district" => $inat->where("district", null)->toArray(),
            ],
            "ibp" => [
                "state" => $ibp->where("state", null)->toArray(),
                "district" => $ibp->where("district", null)->toArray(),
                "taxa" => $ibp->where("taxa_id", null)->toArray(),
                "taxa_added" => $this->ibp_fix_taxa(),
            ],
            "counts" => [
                "taxa_id_added" => $this->counts_fix_taxa(),
                "coordinates_set" => $this->counts_fix_location(),
                "district_set" => $this->counts_set_district(),
                "states_fixed" => $this->counts_fix_state(),
                "set_dates" => $this->counts_set_dates(),
            ]
        ];
        
        dd($data);

    }

    public function counts_fix_taxa()
    {
        $counts_raw = CountForm::with("rows_cleaned")->get();
        $taxa = INatTaxa22::all()->keyBy("name")->toArray();
        $data = FormRow::where("inat_taxa_id", null)->get()->groupBy("scientific_name");
        $count = 0;
        $corrections = [
            "Apatura ambica" => "Mimathyma ambica",
            "Appias olferna" => "Appias libythea",
            "Arhopala pseudocentaurus" => "Arhopala centaurus",
            "Burara anadi" => "Bibasis anadi",
            "Charaxes bharata" => "Polyura bharata",
            "Charaxes pandava" => "Polyura pandava",
            "Charaxes agrarius" => "Polyura agraria",
            "Chilades pandava" => "Luthrodes pandava",
            "Colotis vestalis" => "Colotis phisadia",
            "Spindasis vulcanus" => "Cigaritis vulcanus",
            "Spindasis" => "Cigaritis",
            "Tarucus extricatus" => "Tarucus nara"
        ];
        foreach($data as $sci=>$records){
            if(isset($taxa[$sci])){
                foreach($records as $r){
                    $r->inat_taxa_id = $taxa[$sci]["id"];
                    $r->save();
                    $count++;
                }
            } else if(isset($corrections[$sci])){
                foreach($records as $r){
                    $r->inat_taxa_id = $taxa[$corrections[$sci]]["id"];
                    $r->save();
                    $count++;
                }
            }
        }
        $corrections = [
            "Lime Butterfly" => "Lime Swallowtail",
            "Common Mormon" => "Common Mormon Swallowtail",
            "Plain Tiger" => "Plain Tiger Butterfly",
            "Indian Fritillary" => "Tropical Fritillary"

        ];
        $data = FormRow::where("inat_taxa_id", null)->get()->groupBy("common_name");
        $taxa = INatTaxa22::all()->keyBy("common_name")->toArray();
        foreach($data as $name=>$records){
            if($name != ""){
                if(isset($taxa[$name]) && $taxa[$name]["rank"] != "subspecies"){
                    foreach($records as $r){
                        $r->inat_taxa_id = $taxa[$name]["id"];
                        $r->save();
                        $count++;
                    }
                } else if(isset($corrections[$name])){
                    if(isset($taxa[$corrections[$name]]) && $taxa[$corrections[$name]]["rank"] != "subspecies"){
                        foreach($records as $r){
                            $r->inat_taxa_id = $taxa[$corrections[$name]]["id"];
                            $r->save();
                            $count++;
                        }
                    }
                }
            }
        }
        return $count;
    }

    public function counts_fix_location()
    {
        $data = CountForm::where("latitude", null)->get();
        $count = 0;
        foreach($data as $d){
            if($d->coordinates != null && strpos($d->coordinates, "°N")){
                $coordinates = explode(", ", $d->coordinates);
                echo $d->coordinates . "<br>";
                $d->latitude = str_replace("°N", "", $coordinates[0]);
                $d->longitude = str_replace("°E", "", $coordinates[1]);
                $d->save();
                $count++;
            }
        }
        return $count;
    }

    public function counts_set_district()
    {
        // $this->polygons
        $forms = CountForm::where("district", null)->where("latitude" , "<>", null)->get();
        // dd($forms->toArray());
        $unmatched_states = [];
        foreach($forms as $f){
            foreach($this->polygons as $p){
                foreach($p->geometry->coordinates as $polygon){
                    $in_polygon = $this->is_in_polygon2($f->longitude, $f->latitude, $polygon);
                    if($in_polygon){
                        if($f->state == $p->properties->statename){
                            $f->district = $p->properties->distname;
                            // dd("dist", $f);
                            $f->save();
                            break;
                        } else {
                            $unmatched_states[] = [$f->toArray(), $f->state, $p->properties->statename, $p->properties->distname];
                        }
                    }
                    // dd($in_polygon, $f->toArray(), $p);
                }
            }
        }
        print_r($unmatched_states);
        return $forms;
    }

    public function counts_fix_state()
    {
        $data = CountForm::all();
        $state_names = [];

        $fixes = [
            "Jammu & Kashmir" => "Jammu and Kashmir",
            "Delhi" => "NCT of Delhi",
            "Gurugram (valley site)" => "Haryana",
            "Pitampura, New Delhi" => "NCT of Delhi",
            "Maharashtra " => "Maharashtra",
        ];
        $fixed_count = 0;

        $unmatched_states = [];
        foreach($this->polygons as $s){
            if(!in_array($s->properties->statename, $state_names)){
                $state_names[] = $s->properties->statename;
            }
        }
        foreach($data->groupBy("state") as $state => $state_data){
            if(!in_array($state, $state_names)){
                if (isset($fixes[$state])) {
                    foreach($state_data as $sd){
                        // dd($sd, $fixes[$state]);
                        // echo $sd->state . ":" . $fixes[$state] . "<br>";
                        $sd->state = $fixes[$state];
                        $sd->save();
                        $fixed_count++;
                    }
                } else {
                    dd($state, $state_data);
                }
            }
        }
        return $fixed_count;
    }

    public function counts_set_dates()
    {
        $rows = CountForm::where("date_cleaned", null)->get();
        $count = [
            "cleaned" => 0,
            "failed" => 0
        ];
        
        foreach($rows as $r){
            // echo $r->date . "<br>";
            if(strlen($r->date) > 10 && $r->date[10] == "T"){
                $r->date_cleaned = substr($r->date, 0, 10);
                $r->save();
                $count["cleaned"]++;
            } else {
                // dd($r);
                $count["failed"]++;
            }
        }
        return $count;
    }

    public function ibp_set_state()
    {
        $ibp = IBP22::where("district", null)
                    ->limit(-1)
                    ->get();
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
                            $i->locationLat . ", " . $i->locationLon,
                            $i->placeName,
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
                                $i->locationLat . ", " . $i->locationLon,
                                $i->placeName,
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
        $inat = INat22::where("district", null)
                ->get();

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
        if($this->isWithinBounds($longitude_x, $latitude_y, $polygon)) {
            $points_polygon = count($polygon)-1;
            for ($i = 0, $j = $points_polygon ; $i < $points_polygon; $j = $i++) {
                if ( 
                    (($polygon[$i][1]  >  $latitude_y != ($polygon[$j][1] > $latitude_y)) 
                    &&
                    ($longitude_x < ($polygon[$j][0] - $polygon[$i][0]) * ($latitude_y - $polygon[$i][1]) / ($polygon[$j][1] - $polygon[$i][1]) + $polygon[$i][0]) ) )
                    $c = !$c;
            }
        } else {
            $c = 0;
        }
        
        return $c;
    }

    public function isWithinBounds($x, $y, $polygon)
    {
        $bounds = [
            "lat_min" => $polygon[0][1],
            "lat_max" => $polygon[0][1],
            "lon_min" => $polygon[0][0],
            "lon_max" => $polygon[0][0]
        ];
        foreach($polygon as $p){
            if($p[1] > $bounds["lat_max"]){
                $bounds["lat_max"] = $p[1];
            } else if($p[1] < $bounds["lat_min"]){
                $bounds["lat_min"] = $p[1];
            }
            if($p[0] > $bounds["lon_max"]){
                $bounds["lon_max"] = $p[0];
            } else if($p[0] < $bounds["lon_min"]){
                $bounds["lon_min"] = $p[0];
            }
        }
        return (($x >= $bounds["lon_min"] && $x <= $bounds["lon_max"])
            && ($y >= $bounds["lat_min"] && $y <= $bounds["lat_max"]));
    }

    public function ibp_fix_taxa()
    {
        $corrections = [
            "Acraea terpsichore" => "Acraea terpsicore",
            "Acraea violae" => "Acraea terpsicore",
            "Appias olferna" => "Appias libythea",
            "Arhopala pseudocentaurus" => "Arhopala centaurus",
            "Biclycus anynona" => "Bicyclus anynana",
            "Burara harisa" => "Bibasis harisa",
            "Celastrina huegeli" => "Celastrina huegelii",
            "Charaxes bharata" => "Polyura bharata",
            "Charaxes eudamippus" => "Polyura eudamippus",
            "Chilasa clytia" => "Papilio clytia",
            "Chilades pandava" => "Luthrodes pandava",
            "Childrena childreni" => "Argynnis childreni",
            "Dacalana pencilligera" => "Dacalana penicilligera",
            "Eurema lisa" => "Pyrisitia lisa",
            "Heteropsis adolphei" => "Telinga adolphei",
            "Lethe insana" => "Lethe isana",
            "Limenitis procris" => "Moduza procris",
            "Mycalesis malsara" => "Telinga malsara",
            "Spindasis elima" => "Cigaritis elima",
            "Spindasis lohita" => "Cigaritis lohita",
            "Spindasis rukmini" => "Cigaritis rukmini",
            "Spindasis vulcanus" => "Cigaritis vulcanus",
            "Tarucus balkanicus" => "Tarucus balkanica",
            "Tarucus extricatus" => "Tarucus nara",
            "Catapoecilma major" => "Catapaecilma major",
            "Everes diporides" => "Cupido argiades",            
        ];
        
        $ibp = IBP22::where("taxa_id", null)->get()->groupBy("scientificName");
        $taxa = INatTaxa22::select("id", "name")->get()->keyBy("name")->toArray();
        $updated = 0;
        // dd($ibp->toArray());
        foreach($ibp as $species => $records){
            $species_name = explode(" ", $species);
            if(isset($species_name[1])){
                $species_name = $species_name[0] . " " . $species_name[1];
            } else {
                $species_name = $species_name[0];
            }
            if(isset($corrections[$species_name])){
                // $species_id = INatTaxa22::where("name", "like", "%".$corrections[$species_name]."%")->get();
                $species_id = INatTaxa22::where("name", "like", $corrections[$species_name])->get();
                if(count($species_id) == 1){
                    foreach($records as $r){
                        $r->taxa_id = $species_id->first()->id;
                        $r->save();
                        $updated++;
                    }
                } else if(count($species_id) > 1){
                    dd("species_id", $species_id);
                }
            } else {
                if(isset($taxa[$species_name])){
                    foreach($records as $r){
                        $r->taxa_id = $taxa[$species_name]["id"];
                        $r->save();
                        $updated++;
                    }
                }
                
            }
        }
        return $updated;
    }

    public function set_state(Request $request)
    {
        $ids = $request->ids;
        $updated = 0;
        if($ids["ibp"]){
            foreach(explode(",", $ids["ibp"]) as $i){
                $observation = IBP22::find($i);
                $observation->state = $request->state;
                $observation->district = $request->district;
                $observation->save();
                $updated++;
            }
        }
        if($ids["inat"]){
            foreach(explode(",", $ids["inat"]) as $i){
                $observation = INat22::find($i);
                $observation->state = $request->state;
                $observation->district = $request->district;
                $observation->save();                
                $updated++;
            }
        }
        return response()->json(["added" => $updated]);        
    }
}
