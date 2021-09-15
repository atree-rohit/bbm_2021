@extends('layouts.app')

@section('style')
@endsection


@section('content')
<div class="container-fluid">
    <div id="app">
        <i-nat-observation :inat_data='@json($inat_data)'></i-nat-observation>
        <i-nat-taxa :all_taxa='@json($all_taxa)' :saved_taxa='@json($saved_taxa)' :ancestors='@json($ancestors)'></i-nat-taxa>
    </div>
</div>
@endsection

@push('scripts')
    <script src="{{ asset('js/inat_pull.js') }}" defer></script>
@endpush