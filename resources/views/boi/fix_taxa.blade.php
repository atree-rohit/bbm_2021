@extends('layouts.app')

@section('style')
@endsection


@section('content')
<div class="container-fluid">
    <div id="app">
        <boi-fix-taxa :all_taxa='@json($all_taxa)' :saved_taxa='@json($saved_taxa)' :ancestors='@json($ancestors)' :taxa_to_pull='@json($taxa_to_pull)'></boi-fix-taxa>
    </div>
</div>
@endsection

@push('scripts')
    <script src="{{ asset('js/boi_fix_taxa.js') }}" defer></script>
@endpush