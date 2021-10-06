@extends('layouts.blank')

@section('style')
<link rel="stylesheet" href="{{asset('/css/keen-ui.min.css')}}">
<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
@endsection


@section('content')
<div id="app">
	<i-nat :inat_data='@json($inat_data)' :inat_taxa='@json($inat_taxa)' :form_data='@json($form_data)'></i-nat>
</div>
<div class="text-center">
	Last Updated at {{$last_update}}
</div>
@endsection

@push('scripts')
    <script src="{{ asset('js/inat.js') }}" defer></script>
<link rel="stylesheet" href="{{asset('/js/keen-ui.min.js')}}">
@endpush
