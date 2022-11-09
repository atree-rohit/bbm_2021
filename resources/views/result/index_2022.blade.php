@extends('layouts.blank')

@section('style')
<link rel="stylesheet" href="{{asset('/css/result_2022.css')}}">
@endsection


@section('content')
<div id="app">
	<result :debug_flag='@json($debug_flag)'/>
</div>
@endsection

@push('scripts')
    <script src="{{ asset('js/result_2022.js') }}" defer></script>
@endpush
