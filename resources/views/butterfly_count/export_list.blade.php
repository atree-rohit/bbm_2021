<!DOCTYPE html>
<html>
<body>
	{{-- @dd($forms) --}}
	<table border="1">
		<thead>
			<th>User Email</th>
			<th>No of Forms</th>
			<th>Total Species</th>
			<th>Export</th>
		</thead>
		<tbody>
			@foreach($forms as $k=>$f)
			<tr>
				<td>{{$k}}</td>
				<td>{{count($f)}}</td>
				@php
					$no_of_rows = 0;
					foreach($f as $g)
						$no_of_rows += count($g->rows);
				@endphp
				<td>{{$no_of_rows}}</td>
				<td><a href="/butterfly_count/export/{{$k}}">Download</a></td>
			</tr>
			@endforeach
		</tbody>
	</table>
</body>
</html>