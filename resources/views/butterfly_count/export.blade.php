<!DOCTYPE html>
<html>
<body>
	@php
	$form_headers = [["name", "Name"],
	            ["affiliation", "Affiliation"],
	            ["phone", "Phone"],
	            ["email", "Email"],
	            ["team_members", "Team Members"],
	            ["photo_link", "Photo Link"],
	            ["location", "Location"],
	            ["state", "State"],
	            ["latitude", "Latitude"],
	            ["longitude", "Longitude"],
	            ["date_cleaned", "Date"],
	            ["start_time", "Start Time"],
	            ["end_time", "End Time"],
	            ["altitude", "Altitude"],
	            ["distance", "Distance"],
	            ["weather", "Weather"],
	            ["comments", "Comments"],
	            ["date_created_cleaned", "Date Created"]];

	$row_headers = [["sl_no", "Sl. No."],
	                ["common_name", "Common Name"],
	                ["scientific_name_cleaned", "Scientific Name"],
	                ["no_of_individuals_cleaned", "Individuals"],
	                ["remarks", "Remarks"],
	                ["id_quality", "ID Level"]];
@endphp
<table border=1>
	<tbody>
		@foreach($form_headers as $h)
			<tr>
				<td colspan="2">
					{{$h[1]}}
				</td>
				<td colspan="4">
					{{$form[$h[0]]}}
				</td>
			</tr>
		@endforeach
		<tr>
			@foreach($row_headers as $h)
				<td>{{$h[1]}}</td>
			@endforeach			
		</tr>
		@foreach($form["rows"] as $r)
			<tr>
				@foreach($row_headers as $h)
					<td>{{$r[$h[0]]}}</td>
				@endforeach
			</tr>
		@endforeach
	</tbody>
</table>
</body>
</html>