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
	#counts-table th, td{
		max-width: 10% !important;
	}
	#species-table a:hover{
		cursor: pointer;
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
				<tr v-for="f in forms" @click='selectForm(f)' :class="formsTableClass(f)">
					<template v-for="col in form_cols">
						<td v-if="(col=='date') || (col=='created_at')">{{moment(f[col]).format("MMM D, YY")}}</td>
						<td v-else-if="col=='state'" v-text="f[col]" class="bg-dark text-warning"></td>
						<td v-else-if="col=='coordinates'" v-text="trimCoordinates(f[col])"></td>
						<td v-else v-text="f[col]"></td>
					</template>
				</tr>
			</tbody>
		</table>
		<div id="form-data" v-if="selected_form != null">
			<div class="container border border-primary p-2">
				<div class="d-flex justify-content-center">
					<button class="btn btn-primary" @click="selected_form=null">Back to Counts Table</button>
				</div>
				<div class="d-flex justify-content-center mt-5">
					<button class="btn btn-sm mx-2" :class="is_flagged?'btn-danger':'btn-outline-dark'" @click="toggleFormFlag">Flag</button>
					<button class="btn btn-sm mx-2" :class="is_duplicate?'btn-danger':'btn-outline-dark'" @click="toggleFormDuplicate">Duplicate</button>
				</div>
				
			</div>
			<table class="table table-sm" id="species-table">
				<thead>
					<tr>
						<th>Sl. No</th>
						<th>Common Name</th>
						<th>Scientific Name</th>
						<th>No of Individuals</th>
						<th>Remarks</th>
						<th>Actions</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="row in selectedRows" :class="row.flag?'table-danger':'table-success'">
						<td v-for="col in row_cols" v-text="row[col]"></td>
						<td><a v-if="!(is_flagged || is_duplicate)" class="badge rounded-pill flag-button" :class="rowFlagBtnClass(row)" @click="toggleRowFlag(row)">Flag</a></td>
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
				form_cols:["id", "name", "affilation", "phone", "email", "team_members", "state", "location", "coordinates", "date", "start_time", "end_time", "altitude", "distance", "weather", "comments", "created_at"],
				row_cols:["sl_no", "common_name", "scientific_name", "individuals", "remarks"],
				selected_form:null,
				is_flagged:null,
				is_duplicate:null,
				forms_data:this.forms,
				axios: require('axios')
			}
		},
		computed:{
			selectedRows(){
				let op = [];
				if(this.selected_form != null){
					this.forms_data.forEach(f => {
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
			trimCoordinates(c){
				let op = "";
				c.split(", ").forEach(p => {
					if(op == ""){
						op = p.slice(0,5) + p.slice(-2)
					} else {
						op += ","+p.slice(0,5) + p.slice(-2)
					}

				})
				return op;
			},
			rowFlagBtnClass(row){
				let op = "border border-primary bg-light text-secondary";
				if(row.flag){
					op = "bg-danger"
				}

				return op;
			},
			formsTableClass(f){
				let op = "table-success";
				if(f.duplicate){
					op = "table-warning"
				}
				if(f.flag){
					op = "table-danger"
				}
				return op;
			},
			toggleRowFlag(r){
				let that = this;
				let post_data = {
					"id": r.id,
					"flag" :!r.flag,
				}

				// console.log(that.forms_data)
				this.axios.post('/butterfly_count/set_row_flag', post_data)
					.then(function (response) {
						if(response.status == 200){
							// console.log(response)
							that.forms_data.forEach((form, fid) => {
								if(form.id == that.selected_form){
									form.rows.forEach((row,row_id) => {
										if(row.id == r.id){
											console.log(that.forms_data[fid]["rows"][row_id], r.flag)
											that.forms_data[fid]["rows"][row_id].flag = !r.flag;
											console.log(that.forms_data[fid]["rows"][row_id])
										}
									});
								}
							})
						}
					})
					.catch(function (error) {
						console.log(error);
					});
			},
			toggleFormFlag(){
				let that = this;
				let post_data = {
					"id": this.selected_form,
					"flag" :!this.is_flagged,
				}

				this.axios.post('/butterfly_count/set_flag', post_data)
					.then(function (response) {
						if(response.status == 200){
							console.log(response)
							that.is_flagged = !that.is_flagged;
							that.forms_data.forEach((form, fid) => {
								if(form.id == that.selected_form)
									that.forms_data[fid].flag = that.is_flagged;
							})
						}
					})
					.catch(function (error) {
						console.log(error);
					});
			},
			toggleFormDuplicate(){
				let that = this;
				let post_data = {
					"id": this.selected_form,
					"duplicate" :!this.is_duplicate,
				}

				this.axios.post('/butterfly_count/set_duplicate', post_data)
					.then(function (response) {
						if(response.status == 200){
							console.log(response)
							that.is_duplicate = !that.is_duplicate;
							that.forms_data.forEach((form, fid) => {
								if(form.id == that.selected_form)
									that.forms_data[fid].duplicate = that.is_duplicate;
							})
						}
					})
					.catch(function (error) {
						console.log(error);
					});
			},
			selectForm(f){
				this.selected_form = f.id
				this.is_flagged = f.flag;
				this.is_duplicate = f.duplicate;

			},
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
