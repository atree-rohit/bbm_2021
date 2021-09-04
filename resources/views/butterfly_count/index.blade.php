@extends('layouts.app')

@section('content')
<div class="container-fluid">
	<p class="h3">This year we have 2 ways for you to submit Butterfly Count data to us:</p>
	<div class="card-group">
		<div class="card">
			<div class="card-body">
				<h5 class="card-title text-center h1">Using the App</h5>
				<p class="card-text text-center"><a href="{{url('/butterfly_count/pwa_app')}}" class="btn btn-success btn-block">Go to App</a></p>
				<p class="card-text text-muted">You can use this app to submit count forms. This app can be installed on your phone or computer. At the end of Big Butterfly Month 2021, we will send you an excel sheet with all the data you contributed to the email address you provide</p>
			</div>
		</div>
		<div class="card">
			<div class="card-body">
				<h5 class="card-title text-center h1">Excel Sheet</h5>
				<p class="card-text text-center"><a href="{{ asset('data/BBM21_Count.xlsx') }}" class="btn btn-success btn-block">Download Excel Sheet</a></p>
				<p class="card-text"><small class="text-muted">You can also fill in this butterfly count format excel sheet and submit it to us. We will add a section on this page to submit your forms in the comming days</small></p>
			</div>
		</div>


	</div>


@endsection

