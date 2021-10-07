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
        $x = file_get_contents(public_path("./data/obv_1633067166524.csv"));
        $y = explode("\n", $x);

        dd($y);
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
