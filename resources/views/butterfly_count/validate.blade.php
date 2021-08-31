@extends('layouts.app')

@section('content')
<div class="container-fluid">
	<div id="app">
		<validate :form_data='@json($form_data)' :rows='@json($rows)' :form_cols='@json($form_cols)'/>
	</div>
</div>
@endsection

@push('scripts')
	<script src="{{ url('js/validate.js') }}"></script>
@endpush
