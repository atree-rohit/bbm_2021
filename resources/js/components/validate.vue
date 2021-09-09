<style>
	.text-blank{
		background: rgba(255,100,100,.5);
	}
	.unmatched-name{
		background: rgba(255,0,0,.5);
	}
	.matched-name{
		background: rgba(100,255,100,.25);
	}
	.sl_no-row{
		width: 10%;
	}
	.quality-cell{
		width: 25%;
		font-size: .75rem;
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
					<th>Data Quality Notes</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="row in row_values">
					<td v-for='col in row_cols'>
						<input type="text" :name="col[row.id]" v-model="row[col]" class="form-control" :class="inputSpeciesClass(row.id,col,row[col])">
					</td>
					<td class="quality-cell">
						<ul v-if="row_comments[row.id].length > 0">
							<li v-for="c in row_comments[row.id]" v-text="c"></li>
						</ul>
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
	import species from './species.json'
	export default {
		name:"validate",
		props: ["form_data", "rows", "form_cols"],
		data(){
			return {
				form_values:this.form_data,
				row_values:this.rows,
				row_cols:["sl_no", "common_name", "scientific_name", "individuals", "remarks"],
				species_names: species,
				row_comments:{},
			}
		},
		computed:{
		},
		watch: {
			row_values: {
				handler: function(val, oldVal) {
					this.populateRowComments(); // call it in the context of your component object
				},
				deep: true
			}
		},
		created(){
			this.populateRowComments();
		},
		methods:{
			populateRowComments(){
				this.row_values.forEach(row => {
					this.row_comments[row.id] = [];
					this.row_cols.forEach(col => {
						let cell_class = this.inputSpeciesClass(row.id,col,row[col]);
						switch(cell_class){
							case "text-blank": this.row_comments[row.id].push(this.titleCase(col) + " is blank. Please fill it if possible");	
										break;
							case "unmatched-name": this.row_comments[row.id].push(this.titleCase(col) + " doesnt with our list.")
							 // Please check the name. If you are unsure, go ahead and validate it, we will review this in a short while.
						}
					})
				})
			},
			inputSpeciesClass(row_id, col,val){
				let op = "";

				switch(col){
					case "sl_no":
					case "no_of_individuals": this.row_values.forEach(row => {
													if(row.id == row_id){
														if((row[col] == "") || (row[col] == null))
															op = "text-blank"
													}
												})
												break;
					case "common_name": op = "unmatched-name";
										this.species_names.forEach(sp => {
											if(sp[1] == val){
												op = "matched-name";
											}
										})
										break;
					case "scientific_name": op = "unmatched-name";
										this.species_names.forEach(sp => {
											if(sp[0] == val){
												op = "matched-name";
											}
										})
										break;
				}

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
					form:this.form_values,
					rows:this.row_values
				}

				axios.post('/butterfly_count/validate', post_data)
					.then(function (response) {
						if(response.status == 200){
							window.open("/butterfly_count", "_self");
						}
					})
					.catch(function (error) {
						console.log(error);
					});
			}
		}
	};
</script>
