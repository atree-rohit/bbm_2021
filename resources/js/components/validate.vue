<style>
	.text-blank{
		background: rgba(255,100,100,.5);
	}
	.sl_no-row{
		width: 10%;
	}

</style>
<template>
	<div class="container-fluid">
		<table class="table table-sm table-info">
			<tbody>
				<tr v-for="col in form_cols">
					<td v-text="titleCase(col)"></td>
					<td><input class="form-control" type="text" :name="col" v-model="form_values[col]" :class="inputDetailsClass(col)"></td>
				</tr>
			</tbody>
		</table>
		<table class="table table-sm table-success">
			<thead class="text-center">
				<tr>
					<th class="sl_no-row">Sl. No</th>
					<th>Common Name</th>
					<th>Scientific Name</th>
					<th>No of Individuals</th>
					<th>Remarks</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="row in row_values">
					<td v-for='col in row_cols'>
						<input type="text" :name="col[row.id]" v-model="row[col]" class="form-control" :class="inputSpeciesClass(row.id,col)">
					</td>
				</tr>
			</tbody>
		</table>
		<div class="row d-flex justify-content-center">
			<button class="btn btn-success btn-block" @click="validateData()">Validate</button>

		</div>
	</div>
</template>

<script>
	import axios from 'axios';
	export default {
		name:"validate",
		props: ["form_data", "rows", "form_cols"],
		data(){
			return {
				form_values:this.form_data,
				row_values:this.rows,
				row_cols:["sl_no", "common_name", "scientific_name", "no_of_individuals", "remarks"],
			}
		},
		computed:{
		},
		created(){
		},
		methods:{
			inputSpeciesClass(row_id, col){
				let op = "";
				this.row_values.forEach(row => {
					if(row.id == row_id){
						if((row[col] == "") || (row[col] == null))
							op = "text-blank"
					}
				})

				return op;
			},
			inputDetailsClass(col){
				let op = "";
				if((this.form_values[col] == "") || (this.form_values[col] == null))
					op = "text-blank";
				return op;
			},
			titleCase(str) {
				let splitStr = str.toLowerCase().split('_');
				for (let i = 0; i < splitStr.length; i++) {
					splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
				}
				return splitStr.join(' ');
			},
			validateData(){
				const axios = require('axios');
				var that = this;
				let post_data = {
					form:this.form_data,
					rows:this.row_values
				}

				axios.post('/butterfly_count/validate', post_data)
					.then(function (response) {
						if(response.status == 200){
							console.log(response);
						}
					})
					.catch(function (error) {
						console.log(error);
					});
			}
		}
	};
</script>
