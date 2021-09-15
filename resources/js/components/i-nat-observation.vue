<style>
	.d-grid .btn{
		font-size: 1.5rem !important;
		font-weight: 1000;
	}
	#observation-row .btn{
		font-size: .75rem !important;
	}
	#buttons-area .h3, #buttons-area .h2{
		margin: 0 !important;
	}
	.header-btn{
		transition: all .5s;
	}
	.header-btn:hover{
		background: #ffa;
		cursor: pointer;
	}
</style>
<template>
	<div class="container-fluid text-center mt-5">
		<div class="p-2 border border-info rounded my-2">
			<div id="buttons-area" class="container-fluid">
				<div v-if="expanded">
					<div class="d-flex header-btn" @click="expanded=!expanded">
						<div class="flex-grow-1 h1 mb-0">
							Observations
						</div>
						<button type="button" class="btn-close mt-2 me-1" aria-label="Close" @click="expanded=!expanded"></button>
					</div>
					<div class="row d-flex flex-row justify-content-center w-100 my-2">
						<div class="col-1 d-grid">
							<button class="btn btn-outline-success" @click="urlPrev()">&#8249;</button>
						</div>
						<div class="col-3 my-auto">
							{{ (urlPageNo -1) * urlPerPage + 1 }} - {{ urlPageNo * urlPerPage }} of {{ total_results }} 
							<span v-if="get_unsaved_observations_array.length + updated_observations.length > 0">( {{get_unsaved_observations_array.length}} new {{updated_observations.length}} updated )</span>
						</div>
						<div class="col-1 d-grid">
							<button class="btn btn-outline-success" @click="urlNext()">&#8250;</button>
						</div>
					</div>
					<div class="row d-flex flex-row justify-content-center my-2">
						<div class="col-2" v-if="get_unsaved_observations_array.length > 0">
							<button class="btn btn-primary btn-lg" @click="save_all_observations">Save All Observations</button>
						</div>
						<div class="col-2" v-if="updated_observations.length > 0">
							<button class="btn btn-primary btn-lg" @click="update_all_observations">Update All Observations</button>
						</div>
					</div>				
				</div>
				<div v-else class="header-btn d-flex py-2 justify-content-start" @click="expanded=!expanded">
					<div class="h2 flex-grow-1">
						Observations
					</div>
					<div class="h3 px-5">
						{{get_unsaved_observations_array.length}} New
					</div>
					<div class="h3 px-5">
						{{updated_observations.length}} Updated
					</div>
					<div>
						<button class="btn btn-outline-primary btn-sm" v-if="get_unsaved_observations_array.length" @click.stop="save_all_observations">Save All Observations</button>
						<button class="btn btn-outline-primary btn-sm" v-if="updated_observations.length" @click.stop="update_all_observations">Update All Observations</button>
					</div>
				</div>
			</div>

			<div id="observation-row" class="container-fluid p-0 d-flex flex-wrap justify-content-start" v-if="expanded">
				<div class="m-1 p-1 btn flex-grow-1 text-dark"
					v-for="observation in data"
					:class="observationBtnClass(observation)"
					:key="observation.id"
					v-text="observation.id"
					@click="save_observation(observation.id)"
				></div>
			</div>
			
		</div>

	</div>
</template>

<script>
import axios from 'axios';
	export default {
		name:"i-nat-observation",
		props: ["inat_data"],
		data() {
			return{
				data:[],
				inat_ids:[],
				observation_taxa:[],
				urlPageNo:1,
				urlPerPage:200,
				urlTaxaLimit:10,
				savingData:false,
				expanded:false,
				pullUrl:"https://api.inaturalist.org/v1/observations?project_id=big-butterfly-month-india-2021&order_by=updated_at",
				total_results:"-",
			}
		},
		created: function() {
			this.observation_taxa = this.inat_data;
			this.inat_ids = this.observation_taxa.map(function(value,index) { return value["id"]; });
			this.initilize_params();
			this.fetch_data();
		},
		mounted() {
		},
		computed:{
			get_unsaved_observations_array(){
				let op = [];
				this.data.forEach(d => {
					if(!this.observationExists(d.id)){
						op.push(d.id);
					}
				});
				return op;
			},
			updated_observations(){
				let op = [];

				this.data.forEach(o => {
					if(this.observationTaxaUpdated(o.id)){
						op.push(o.id);
					}
				})
				return op;
			},
			currentUrl(){
				let base_url = window.location.href.replace(window.location.search, "");
				let url = base_url + "?per_page=" + this.urlPerPage + "&page_no=" + this.urlPageNo + "&taxa_limit=" + this.urlTaxaLimit;
				return url
			}
		},
		methods: {
			initilize_params(){
				if(this.get_params("page_no")){
					this.urlPageNo = this.get_params("page_no");
				}
				if(this.get_params("per_page")){
					this.urlPerPage = this.get_params("per_page");
				}
				if(this.get_params("taxa_limit")){
					this.urlTaxaLimit = this.get_params("taxa_limit");
				}
			},
			get_params(col){
				let op = "";
				let params = window.location.search
				  .substring(1)
				  .split("&")
				  .map(v => v.split("="))
				  .reduce((map, [key, value]) => map.set(key, decodeURIComponent(value)), new Map())

				if(params.get(col) != undefined)
					op = params.get(col)
				return op;
			},
			logStyle(t){
				var op = "";
				if(t == "error")
					op = "border-danger table-danger";
				else if (t == "ongoing")
					op = "border-warning table-warning";
				else
					op = "border-success table-success";

				return op;
			},
			urlPrev(){
				if(this.urlPageNo != 1)
					this.urlPageNo--;
				this.fetch_data();
			},
			urlNext(){
				this.urlPageNo++;
				this.fetch_data();
			},
			observationBtnClass(o){
				let op = "btn-outline-danger";
				if(this.observationExists(o.id)){
					let taxon_id = null;
					if(o.taxon != undefined){
						taxon_id = o.taxon.id;
					}
					if(this.observationTaxaUpdated(o.id)){
						op = "btn-outline-primary";
					} else {
						op = "btn-success";
					}
				}
				return op;
			},
			observationExists(id){
				return this.inat_ids.includes(id);
			},
			observationTaxaUpdated(id){
				let op = false;
				this.data.forEach(d => {
					if(d.id == id){
						this.observation_taxa.forEach(o => {
							if(o.id == id){
								if(d.taxon != undefined){
									if(o.taxa_id != d.taxon.id){
										op=true;
									}									
								}
							}
						})		
					}
				})
				return op;
			},
			fetch_data(){
				const axios = require('axios');
				let url = this.pullUrl;
				url += "&page=" + this.urlPageNo;
				url += "&per_page=" + this.urlPerPage;
				
				this.data = [];
				var that = this;

				axios.get(url)
					.then(function (response) {
						that.data = response.data.results;
						that.total_results = response.data.total_results;
					})
					.catch(function (error) {
						console.log(error);
					})
			},
			find_observation(id){
				var op = false;
				this.data.forEach(o => {
					if(o.id == id){
						op = o;
					}
				})
				
				return op;
			},
			save_observation(id){
				let current_id = "";
				let match = {};
				let type = "";
				if(Array.isArray(id)){
					current_id = id.pop();
				} else {
					current_id = id;
				}
				match = this.find_observation(current_id);

				if (this.observationTaxaUpdated(current_id)){
					type = "update";
				} else if(!this.observationExists(current_id)){
					type = "save";
				}

				console.log(match, type);
				
				if(match){
					const axios = require('axios');
					let that = this;

					switch(type){
						case "save": axios.post('/inat/store_observation', match)
										.then(function (response) {
											if(response.status == 200){
												that.inat_ids.push(response.data[0]);
											}
										})
										.catch(function (error) {
											console.log(error);
										})
										.then(function (response){
											if(Array.isArray(id))
												that.save_observation(id);
										});
									break;
						case "update":  axios.post('/inat/update_observation', match)
										.then(function (response) {
											if(response.status == 200){
												let res = response.data;
												that.observation_taxa.forEach((o, k) => {
													if(o.id == res[0])
														that.observation_taxa[k].taxa_id = res[1];
												})
											}
										})
										.catch(function (error) {
											console.log(error);
										})
										.then(function (response){
											if(Array.isArray(id))
												that.save_observation(id);
										});
									break;

					}
				}
			},
			update_observation(id){

			},
			save_all_observations(){
				this.save_observation(this.get_unsaved_observations_array.reverse());
			},
			update_all_observations(){
				this.save_observation(this.updated_observations.reverse());
			},
		}
	};
</script>
