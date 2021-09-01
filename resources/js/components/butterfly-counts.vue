<style>
	#table-container{
		width: 100%;
		height: 70vh;
		overflow: scroll;
	}
	#counts-table{
		font-size: .8rem;
	}
	#counts-table tbody tr:hover{
		background: #ffa;
		cursor: pointer;
	}
	#species-table{

	}

</style>
<template>
	<div class="container-fluid" id="table-container">
		<table class="table table-sm" id="counts-table" v-if="selected_form==null">
			<thead class="bg-dark text-light">
				<tr>
					<th v-for="col in form_cols" v-text="titleCase(col)" class="text-nowrap"></th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="f in forms" @click='selected_form=f.id'>
					<td v-for="col in form_cols" v-text="f[col]" class="text-nowrap"></td>
				</tr>
			</tbody>
		</table>
		<div id="form-data" v-if="selected_form != null">
			<div class="text-center">
				<button class="btn btn-primary" @click="selected_form=null">Back to Counts Table</button>
			</div>
			<table class="table table-sm" id="species-table">
				<thead>
					<tr>
						<th>Sl. No</th>
						<th>Common Name</th>
						<th>Scientific Name</th>
						<th>No of Individuals</th>
						<th>Remarks</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="row in selectedRows">
						<td v-for="col in row_cols" v-text="row[col]"></td>
					</tr>
				</tbody>
			</table>			
		</div>
	</div>
</template>

<script>
	import axios from 'axios';
	export default {
		name:"butterfly-counts",
		props: ["forms"],
		data(){
			return {
				form_cols:["id", "name", "affilation", "phone", "email", "team_members", "photo_link", "location", "coordinates", "date", "altitude", "distance", "weather", "comments", "original_filename", "created_at"],
				row_cols:["sl_no", "common_name", "scientific_name", "no_of_individuals", "remarks"],
				selected_form:null,
			}
		},
		computed:{
			selectedRows(){
				let op = [];
				if(this.selected_form != null){
					this.forms.forEach(f => {
						if(f.id == this.selected_form)
							op = f.rows;
					})
				}
				return op;
			}
		},
		created(){
		},
		methods:{
			formColClass(col){
				let op = "";
				let cols = ["id", "name", "affilation", "phone", "email", "coordinates", "date","altitude", "distance", "original_filename"];
				if(cols.indexOf(col) != -1){
					op = "text-nowrap";
				}
				return op;
			},
			titleCase(str) {
				let splitStr = str.toLowerCase().split('_');
				for (let i = 0; i < splitStr.length; i++) {
					splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
				}
				return splitStr.join(' ');
			},
		}
	};
</script>
