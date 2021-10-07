<?php

namespace App\Http\Controllers;

use App\Models\IBP;
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
        //
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        $json_string = file_get_contents(public_path("./data/ibp.json"));
        $y = json_decode( preg_replace('/[\x00-\x1F\x80-\xFF]/', '', $json_string), true );
        dd($y);
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
