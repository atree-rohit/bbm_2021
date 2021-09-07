@extends('layouts.app')

@section('content')
<div class="container-fluid">
	<div id="app">
		<butterfly-counts :forms='@json($forms)'/>
	</div>
</div>
@endsection

@push('scripts')
    <script src="{{ asset('js/butterfly_counts.js') }}" defer></script>
@endpush
