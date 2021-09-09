@extends('layouts.app')

@section('content')
<div class="container pt-5">

	<div class="alert alert-danger" role="alert">
		<p class="h4">
			There was an error in uploading you sheet.</p>
		<p class="h4">
			Please email your sheet to <b class="h2">bigbutterflymonth@gmail.com</b>.
		</p>
		<p class="h4">
			Also include this text in the subject: <br> 
		</p>
		<span>
			<b class="h2">BBM21-excel:{{$code}}</b>
			<span class="badge rounded-pill btn btn-primary align-top" onclick="myFunction()">Copy</span>			
		</span>
	</div>
	<div class="d-flex justify-content-center">
		<a href="{{url('/')}}" class="btn btn-lg btn-success">Back to Homepage</a>
		
	</div>
	
</div>
@endsection

@push('scripts')
	<script>
		function myFunction() {
			let code = "BBM21-excel:"+ "{{$code}}";
			navigator.clipboard.writeText(code);

			alert("Copied Code: " + code);
		}
	</script>
@endpush