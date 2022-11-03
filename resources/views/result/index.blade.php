@extends('layouts.blank')

@section('style')
<link rel="stylesheet" href="{{asset('/css/keen-ui.min.css')}}">
<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
@endsection


@section('content')
<div id="app">
	<result :debug_flag='@json($debug_flag)'/>
</div>
@endsection

@push('scripts')
    <script src="{{ asset('js/result.js') }}" defer></script>
<link rel="stylesheet" href="{{asset('/js/keen-ui.min.js')}}">
@endpush
