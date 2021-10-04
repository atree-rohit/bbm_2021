@extends('layouts.blank')

@section('style')
<link rel="stylesheet" href="{{asset('/css/keen-ui.min.css')}}">
<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
@endsection


@section('content')
<div id="app">
	<count-clean :count_rows='@json($count_rows)' :inat_taxa='@json($inat_taxa)' />
</div>
@endsection

@push('scripts')
    <script src="{{ asset('js/count_clean.js') }}" defer></script>
    <link rel="stylesheet" href="{{asset('/js/keen-ui.min.js')}}">
@endpush
