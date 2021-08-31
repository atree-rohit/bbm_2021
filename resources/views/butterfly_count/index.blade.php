@extends('layouts.app')

<div class="container-fluid">
@section('content')
	<div class="d-flex justify-content-center">
		<button type="button" id="upload-form" class="btn btn-block btn-success w-50" data-bs-toggle="modal" data-bs-target="#importModal">
			Upload a Form
		</button>
	</div>
	<div class="h1">{{count($forms)}} Forms Submitted</div>
	<div id="app">
		<butterfly-counts :forms='@json($forms)' />
	</div>

</div>


<!-- Modal -->
<div class="modal fade" id="importModal" tabindex="-1" aria-labelledby="ImportButterflyCountXLSX" aria-hidden="true">
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header">
				<h5 class="modal-title" id="ImportButterflyCountXLSX">Import a completed Butterfly Count Sheet</h5>
				<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
			</div>
			<form method="POST" action="/butterfly_count/import" enctype="multipart/form-data">
				@csrf
				<div class="modal-body">
					<div class="mb-3">
						<input class="form-control" type="file" name="count_file" required>
					</div>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
					<button type="submit" class="btn btn-primary">Save changes</button>
				</div>
			</form>
		</div>
	</div>
</div>
@endsection

@push('scripts')
	<script src="{{ url('js/butterfly_counts.js') }}"></script>
@endpush
