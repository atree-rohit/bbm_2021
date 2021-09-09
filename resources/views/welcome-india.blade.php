@extends('layouts.app')

@section('content')
<div class="container p-5 mt-5">

    <div class="card-group text-center">
        @foreach($data as $k=>$d)
        <div class="card color-overlay">
            <div class="card-body color-{{$k}}">
                <div class="card-text display-1">{{$d[0]}}</div>
                <div class="card-title h1">{{$d[1]}}</div>
            </div>
        </div>
        @endforeach
    </div>
    <div class="container-fluid border-bottom border-primary my-2 py-2"> </div>
    <div class="container-fluid py-5 d-flex justify-content-center">
        <a class="btn btn-outline-success btn-block w-75" id="app-button" href="/butterfly_count">Butterfly Count Form & App</a>
    </div>
</div>
@endsection
