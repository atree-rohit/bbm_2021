<style>
	.d-grid .btn{
		font-size: 1.5rem !important;
		font-weight: 1000;
	}
	#taxa-row .btn{
		font-size: 1rem !important;
	}
</style>
<template>
	<div class="container-fluid text-center">
		<div class="p-2 border border-danger rounded my-2">
			<div class="container-fluid my-2 rounded buttons-area" v-if="expanded.taxa">
				<div class="d-flex header-btn" @click="expanded.taxa=!expanded.taxa">
					<div class="flex-grow-1 h1 mb-0">
						Names
					</div>
					<button type="button" class="btn-close mt-2 me-1" aria-label="Close"></button>
				</div>
				<div class="row d-flex flex-row justify-content-center w-100 my-2">
					<div class="col-1 d-grid">
						<button class="btn btn-outline-success" @click="urlPrev()">&#8249;</button>
					</div>
					<div class="col-3 my-auto">Page {{pageNo}} of {{Math.ceil(all_taxa_ids.length / perPage)}} ( {{missing_taxa.length}} unsaved)</div>
					<div class="col-1 d-grid">
						<button class="btn btn-outline-success" @click="urlNext()">&#8250;</button>
					</div>
				</div>
				<div class="row d-flex flex-row justify-content-center my-2">
					<div class="col-2" v-if="missing_taxa.length > 0">
						<button class="btn btn-primary btn-lg" @click="save_all_taxa">Save All Names</button>
					</div>
				</div>
			</div>
			<div v-else class="header-btn d-flex py-2 justify-content-start" @click="expanded.taxa=!expanded.taxa">
				<div class="h2 flex-grow-1">
					Names
				</div>
				<div class="h3 px-5">
					{{missing_taxa.length}} Unsaved
				</div>
				<div>
					<button class="btn btn-outline-primary btn-sm" v-if="missing_taxa.length" @click.stop="save_all_taxa">Save All Names</button>
				</div>
			</div>

			<div id="taxa-row" class="container-fluid p-0 d-flex flex-wrap justify-content-start" v-if="expanded.taxa">
				<div class="m-1 p-1 btn flex-grow-1 text-dark"
					v-for="taxon in current_page"
					:class="taxonExists(taxon) ? 'btn-success' : 'btn-outline-danger'"
					:key="taxon"
					v-text="taxon"
					@click="save_taxon(taxon)"
				></div>
			</div>
		</div>

		<div class="p-2 border border-success rounded my-2">
			<div class="container-fluid my-2 rounded buttons-area" v-if="expanded.ancestors">
				<div class="d-flex header-btn" @click="expanded.ancestors=!expanded.ancestors">
					<div class="flex-grow-1 h1 mb-0">
						Ancestors
					</div>
					<button type="button" class="btn-close mt-2 me-1" aria-label="Close"></button>
				</div>
				<div class="row d-flex flex-row justify-content-center w-100 my-2">
					<div class="col-1 d-grid">
						<button class="btn btn-outline-success" @click="ancestorsPrev()">&#8249;</button>
					</div>
					<div class="col-3 my-auto">Page {{ancestorsPageNo}} of {{Math.ceil(ancestor_ids.length / ancestorsPerPage)}} ( {{missing_ancestors.length}} unsaved)</div>
					<div class="col-1 d-grid">
						<button class="btn btn-outline-success" @click="ancestorsNext()">&#8250;</button>
					</div>
				</div>
				<div class="row d-flex flex-row justify-content-center my-2">
					<div class="col-2" v-if="missing_ancestors.length > 0">
						<button class="btn btn-primary btn-lg" @click="save_all_ancestors">Save All Ancestors</button>
					</div>
				</div>
			</div>
			<div v-else class="header-btn d-flex py-2 justify-content-start" @click="expanded.ancestors=!expanded.ancestors">
				<div class="h2 flex-grow-1">
					Ancestors
				</div>
				<div class="h3 px-5">
					{{missing_ancestors.length}} Unsaved
				</div>
				<div>
					<button class="btn btn-outline-primary btn-sm" v-if="missing_ancestors.length" @click.stop="save_all_ancestors">Save All Ancestors</button>
				</div>
			</div>
			<div id="ancestry-row" class="container-fluid p-0 d-flex flex-wrap justify-content-start" v-if="expanded.ancestors">
				<div class="m-1 p-1 btn flex-grow-1 text-dark"
					v-for="id in current_ancestors_page"
					:class="taxonExists(id) ? 'btn-success' : 'btn-outline-danger'"
					v-text="id"
					@click="save_taxon(id)"
				></div>
			</div>
			
		</div>
	</div>
</template>

<script>
import axios from 'axios';
	export default {
		name:"i-nat-taxa",
		props: ["all_taxa", "saved_taxa", "ancestors"],
		data() {
			return{
				all_taxa_ids:Object.values(this.all_taxa),
				saved_taxa_ids:this.saved_taxa,
				ancestor_ids:this.ancestors,
				perPage:500,
				pageNo:1,
				ancestorsPerPage:500,
				ancestorsPageNo:1,
				expanded:{
					taxa:false,
					ancestors:false
				},
			}
		},
		created: function() {
		},
		mounted() {
		},
		computed:{
			current_page(){
				return this.all_taxa_ids.slice((this.pageNo - 1) * this.perPage, this.pageNo * this.perPage);
			},
			current_ancestors_page(){
				return this.ancestor_ids.slice((this.ancestorsPageNo - 1) * this.ancestorsPerPage, this.ancestorsPageNo * this.ancestorsPerPage);
			},
			missing_taxa(){
				let op = [];
				this.current_page.forEach(t => {
					if(this.saved_taxa_ids.indexOf(t) == -1)
						op.push(t)
				});
				return op;
			},
			missing_ancestors(){
				let op = [];
				this.current_ancestors_page.forEach(t => {
					if(this.saved_taxa_ids.indexOf(t) == -1)
						op.push(t)
				});
				return op;
			},
		},
		methods: {
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
				if(this.pageNo != 1)
					this.pageNo--;
			},
			urlNext(){
				this.pageNo++;
			},
			ancestorsPrev(){
				if(this.ancestorsPageNo != 1)
					this.ancestorsPageNo--;
			},
			ancestorsNext(){
				this.ancestorsPageNo++;
			},
			taxonExists(id){
				let op = false;
				if(this.saved_taxa_ids.indexOf(id) != -1)
					op = true;
				return op;
			},
			save_taxon(id){
				var pull_url = "https://www.inaturalist.org/taxa/" + id + ".json";
				const axios = require('axios');
				var that = this;

				axios.get(pull_url)
					.then(function (response) {
						axios.post('/inat/store_taxon', response.data)
							.then(function (response_1) {
								if(response_1.status == 200){
									that.new_pulled_taxa(response_1.data)
								}
							})
							.catch(function (error) {
								console.log(error);
							});
					})
					.catch(function (error) {
						console.log(error);
					});
			},
			save_taxa(ids){
				const id = ids.pop();
				var pull_url = "https://www.inaturalist.org/taxa/" + id + ".json";
				const axios = require('axios');
				var that = this;
				if(id != undefined){
					axios.get(pull_url)
						.then(function (response) {
							axios.post('/inat/store_taxon', response.data)
								.then(function (response_1) {
									if(response_1.status == 200){
										that.new_pulled_taxa(response_1.data)
									}
								})
								.catch(function (error) {
									console.log(error);
								});
						})
						.catch(function (error) {
							console.log(error);
						})
						.then(function (response) {
							setTimeout(function() {
								that.save_taxa(ids);
							}, 1000);
						});
				}
			},
			new_pulled_taxa(data){
				this.saved_taxa_ids.push(data[0]);
				data[1].forEach(id => {
					if(this.ancestor_ids.indexOf(id) == -1){
						this.ancestor_ids.push(id);
					}
				})
			},
			save_all_taxa(){
				this.save_taxa(this.missing_taxa.reverse());
			},
			save_all_ancestors(){
				this.save_taxa(this.missing_ancestors.reverse());
			},
		}
	};
</script>
