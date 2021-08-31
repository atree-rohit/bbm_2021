<style>
</style>
<template>
	<div class="container-fluid">
		<div class="text-center">
			<button class="btn mx-3" v-for="m in modes" v-text="titleCase(m)" @click='mode=m' :class="(mode==m)?'btn-success':'btn-outline-info'"></button>
		</div>
		<div v-if="mode=='forms'">
			<table class="table table-sm" v-if="selected_form==null">
				<thead class="bg-dark text-light">
					<tr>
						<th v-for="col in form_cols" v-text="titleCase(col)"></th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="f in forms" @click='selected_form=f.id'>
						<td v-for="col in form_cols" v-text="f[col]"></td>
					</tr>
				</tbody>
			</table>
			<table class="table table-sm" v-if="selected_form != null">
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
				modes:["forms", "species"],
				mode:"forms",
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
