<!doctype html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">

	<!-- CSRF Token -->
	<meta name="csrf-token" content="{{ csrf_token() }}">

	<title>{{ config('app.name', 'Laravel') }}</title>

	<!-- Scripts -->
	<script src="{{ asset('js/app.js') }}" defer></script>

	<!-- Fonts -->
	<link rel="dns-prefetch" href="//fonts.gstatic.com">
	<link href="https://fonts.googleapis.com/css?family=Nunito" rel="stylesheet">

	<!-- Styles -->
	<link href="{{ asset('css/app.css') }}" rel="stylesheet">
	<link href="{{ asset('css/style.css') }}" rel="stylesheet">
	@yield('style')
</head>
<body>
	<div id="app">
		<nav class="navbar navbar-expand-lg navbar-light bg-primary shadow-sm">
			<div class="container-fluid">
				<a class="navbar-brand" href="{{ url('/') }}">
					<img id="nav-logo" src="{{url('/images/bbm_23_logo.jpg')}}">
				</a>
				<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent">
					<span class="navbar-toggler-icon"></span>
				</button>

				<div class="mx-5"></div>
				<div class="h2 text-center p-2 ms-5 mb-0">Big Butterfly Month - 2023</div>
				<div class="collapse navbar-collapse" id="navbarSupportedContent">
					<!-- Left Side Of Navbar -->
					<!-- Right Side Of Navbar -->
					@auth
					<ul class="navbar-nav ms-auto mb-2 mb-lg-0">
						<li class="nav-item">
							<a class="nav-link" href="{{ url('butterfly_count/forms') }}">Submitted Counts</a>
						</li>
						<li class="nav-item dropdown">
							<a id="userDropdown" class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
								{{ Auth::user()->name }}
							</a>

							<div class="dropdown-menu dropdown-menu-right" aria-labelledby="userDropdown">
								<a class="dropdown-item" href="{{ route('logout') }}"
								   onclick="event.preventDefault();
												 document.getElementById('logout-form').submit();">
									{{ __('Logout') }}
								</a>
								<form id="logout-form" action="{{ route('logout') }}" method="POST" class="d-none">
									@csrf
								</form>
							</div>
						</li>
					@endauth
					</ul>
				</div>
			</div>
		</nav>

		<main>
			@yield('content')
		</main>
	</div>
	 @stack('scripts')
</body>
</html>
