@extends('layouts.app')

@section('style')
<style>
	.diagonal-box {
		background-image: linear-gradient(65deg, rgba(255,150, 100, .5), rgba(255, 255,0, .25));
		transform: skewY(-1deg);
		position: relative;
	} 
	.diagonal-box:before {
		position: absolute;
	    top: 100px;
	    right: 0;
	    left: 0;
	    bottom: 0;
	    background-image: linear-gradient(45deg, rgba(0,150, 100, .25), rgba(0, 0, 255, .15));
	    transform: skewY(-1deg);
	}
	.content { 	
		max-width: 50em;
	    margin: 0 auto;
	    position: relative;
	}
	.card{
		background: rgba(225,225,225,.35);
	}
	
</style>
@endsection
@section('content')
<div class="diagonal-box p-5 my-5">
	<div class="container p-5">			
		<p class="h1 py-3 text-dark">This year we have 2 ways for you to submit Butterfly Count data to us:</p>
		<div class="card-group d-flex justify-content-center">
			<div class="card mx-5">
				<div class="card-body">
					<h5 class="card-title text-center h1">Using the App</h5>
					<p class="card-text text-center"><a href="{{url('/butterfly_count/pwa_app')}}" class="btn btn-lg btn-success btn-block">Go to App</a></p>
					<p class="card-text h5 text-dark">
						You can use this app to submit count forms.
						<br>
						This app can be installed on your phone or computer.
						<br>
						At the end of Big Butterfly Month 2021, we will send you an excel sheet with all the data you contributed to the email address you provide
					</p>
				</div>
			</div>
			<div class="card">
				<div class="card-body">
					<h5 class="card-title text-center h1">Excel Sheet</h5>
					<p class="card-text text-center">
						<a href="{{ asset('data/BBM21_Count.xlsx') }}" class="btn btn-lg btn-info btn-block">Download</a>
						<button type="button" class="btn btn-lg btn-success btn-block" data-bs-toggle="modal" data-bs-target="#submitModal">
							Submit
						</button>
					</p>
					<p class="card-text h5 text-dark">You can also fill in this butterfly count format excel sheet and submit it to us.</p>
				</div>
			</div>
		</div>
	
	</div>
</div>
<div class="modal fade" id="submitModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
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

