@extends('layouts.app')

@section('content')
<div class="container-fluid h4">

    <div class="card-group text-center">
        @foreach($data as $d)
        <div class="card {{$d[2]}}">
            <div class="card-body">
                <h1 class="card-text">{{$d[0]}}</h1>
                <h3 class="card-title">{{$d[1]}}</h3>
            </div>
        </div>
        @endforeach
    </div>

</div>
@endsection
