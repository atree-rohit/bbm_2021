@extends('layouts.app')

@section('style')
<link rel="stylesheet" href="{{asset('/css/keen-ui.min.css')}}">
@endsection


@section('content')
<div class="container-fluid">
	<div id="app">
		<i-nat :inat_data='@json($inat_data)' :inat_taxa='@json($inat_taxa)'></i-nat>
	</div>
</div>
@endsection

@push('scripts')
    <script src="{{ asset('js/inat.js') }}" defer></script>
<link rel="stylesheet" href="{{asset('/js/keen-ui.min.js')}}">
@endpush