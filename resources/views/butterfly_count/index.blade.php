@extends('layouts.app')

@section('style')
<style>
	.diagonal-box {
		background-image: linear-gradient(65deg, rgba(255,150, 100, .5), rgba(255, 255,0, .25));
		/*transform: skewY(-1deg);*/
		position: fixed;
		width: 100%;
		height: calc(100% - 66px);;
	} 
	.content { 	
		margin: 0 auto;
	    position: relative;
	    transform: translate(0%, 10%);
	}
	.container-fluid{
		vertical-align: middle;
	}

	.custom-card{
		background-image: linear-gradient(-180deg, rgba(255, 255,255, .1), rgba(150,150, 150, .15));
		box-shadow: 1px 1px 10px rgba(0,0,0,0);
		border: 1px solid rgba(0, 0, 0, 0.125);
    	border-radius: 0.5rem;
    	margin: 5px;
	}
	.custom-card .card-title{
		transition: all .5s;
	}
	.custom-card .card-buttons{
		padding: 10px 0;
		border-radius: 10px;
	}
	.custom-card .card-text{
		color: rgba(100,100,100,.9);
		font-size: 1.1rem;
		padding: 10px;
		background: rgba(255,255,235,.5);
		border-radius: 10px;
		transition: all .5s;
	}
	.custom-card .card-text li{
		transition: all .5s;
		margin: 0;
	}
	.custom-card:hover{
		background-image: linear-gradient(65deg, rgba(255, 255,0, .1), rgba(255,150, 100, .15));
		box-shadow: 1px 1px 10px rgba(0,0,0,.25);
	}
	.custom-card:hover .card-title{
		font-size: 2.25rem;
	}
	.custom-card:hover .card-text{
		color: rgba(00,00,00,1);
		box-shadow: 1px 1px 10px rgba(0,0,0,.25);
		background: rgba(255,255,255,1);
	}
	.custom-card:hover .card-text li{
		margin: 10px 0;
	}

	.card-text>ul {
		margin-bottom: 0 !important;
	}
	
</style>
@endsection
@section('content')
<div class="diagonal-box py-5 mb-5">
	<div class="container content">			
		<p class="h1 py-3 text-dark">This year we have 2 ways for you to submit Butterfly Count data to us:</p>
		<div class="card-groupa  d-flex justify-content-center">
			<div class="custom-card col-xl-5 col-lg-10">
				<div class="card-body">
					<h5 class="card-title text-center h1">Using the App</h5>
					<div class="card-buttons text-center">
						<a href="{{url('/butterfly_count/pwa_app')}}" class="btn btn-lg btn-success btn-block">Go to App</a>
					</div>
					<div class="card-text">
						<ul>
							<li>You can use this app to submit count forms.</li>
							<li>This app can be installed on your phone or computer.</li>
							<li>At the end of Big Butterfly Month 2022, we will send you an excel sheet with all the data you contributed</li>
						</ul>
					</div>
				</div>
			</div>
			<div class="custom-card col-xl-5 col-lg-10">
				<div class="card-body">
					<h5 class="card-title text-center h1">Excel Sheet</h5>
					<div class="card-buttons text-center">
						<a href="{{ asset('data/BBM21_Count.xlsx') }}" class="btn btn-lg btn-info btn-block">Download</a>
						<button type="button" class="btn btn-lg btn-success btn-block" data-bs-toggle="modal" data-bs-target="#submitModal">
							Submit
						</button>
					</div>
					<div class="card-text">
						<ul>
							<li>You can also fill the Butterfly Count Excel Sheet.</li>
							<li>Download the excel sheet from the link above</li>
							<li>Fill in the sheet with your butterfly count data</li>
							<li>Submit completed forms here</li>
						</ul>
					</div>
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

