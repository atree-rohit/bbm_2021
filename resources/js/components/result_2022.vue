<style>
	#result-page{
		height:100vh;
		/* border: 2px solid red; */
	}

	
	.nav-item:hover{
		cursor: pointer;
	}

	#mode-tabs.nav-tabs .nav-link, #filter-title{
		font-size:1.25rem;
	}
	.nav-tabs .nav-link.active{
		background-color: #3490dc;
		color: #f8fafc;
	}
	@media screen and (max-width: 800px) {
		#result-page, #table-container{
			padding:0;
		}		
	}

</style>
<template>
	<div id="result-page" class="container-fluid">
		{{selected}}
		<ul id="mode-tabs" class="nav nav-tabs nav-fill">
			<li
				v-for="m in modes"
				:key="m"
				class="nav-item"
			>
				<a
					class="nav-link"
					v-text="capitalizeWords(m)"
					:class="(m === mode) ? 'active' : ''"
					@click="mode = m"
				/>
			</li>
		</ul>
		<div id="filters" class="d-flex py-2">
			<div id="filter-title" class="flex-grow-1 text-center">Filters</div>
			<div
				class="dropdown flex-grow-1 d-grid mx-2"
				v-for="(filter_vals, filter) in filters"
				:key="filter"
			>
				<button
					:id="filter + '-dropdown'"
					class="btn"
					type="button"
					data-bs-toggle="dropdown"
					aria-expanded="false"
					:class="(selected[filter] == 'All') ? 'btn-outline-dark' : 'btn-success'"
					v-text="filterBtnText(filter)"
				/>
				<ul
					class="dropdown-menu scrollable-menu"
					:aria-labelledby="filter + '-dropdown'"
				>
					<li
						v-for="val in filter_vals"
						:key="val"
						@click="selectFilter(filter, val)"
					>
						<a
							class="dropdown-item"
							v-text="val"
						/>
					</li>
				</ul>
			</div>
		</div>
		<div id="filters-1" class="d-flex justify-content-center py-2" v-if="mode=='table'">
			<button
				v-for="filter in table_filters"
				:key="filter"
				class="btn btn-sm mx-1"
				:class="(selected_table_filter == filter) ? 'btn-success' : 'btn-outline-dark'"
				@click="selected_table_filter = filter"
				v-text="capitalizeWords(filter)"
			/>
		</div>
		<div class="container-fluid" v-if="mode == 'debug'">
			<div class="row">
				<div class="col-12">
					<div class="card bg-danger text-light ">
						<div class="card-body">
							<h3 class="card-title text-center">
								{{selected}}
							</h3>
						</div>
					</div>
				</div>
			</div>
			<div class="row">
				<div
					class="col"
					v-for="(stat, portal) in portal_stats"
					:key="portal"
				>
					<div class="card bg-info text-center">
						<div class="card-body">
							<h3 class="card-title">{{portal}}</h3>
							<h1 class="card-text">{{stat}}</h1>
						</div>
					</div>
				</div>
			</div>
			<div class="row">
				<div class="col-6">
					<div class="card">
						<div class="card-body">
							<h3 class="card-title">
								{{filtered_data.length}}
							</h3>
							<div class="card-text">
								<pre>{{filtered_data}}</pre>
							</div>
						</div>
					</div>
				</div>
				<div class="col-6">
					<div class="card">
						<div class="card-body">
							<h3 class="card-title">
								{{filtered_taxa.length}}
							</h3>
							<div class="card-text">
								<pre>{{filtered_taxa}}</pre>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="container-fluid" v-else-if="mode == 'map'">
			<IndiaMap :key='timestamp'/>
		</div>
		<div id="table-container" class="container-fluid" v-else-if="mode == 'table'">
			<data-table-22 :data="tableData"
						:headers='table_headers[selected_table_filter]'
						:sort_col="'observations'"
						:sort_dir="'desc'"
			/>
		</div>
		<div id="chart-container" class="container-fluid" v-else-if="mode == 'chart'">
			<species-sunburst :key='timestamp' />
		</div>
		
	</div>
</template>

<script>
import { capitalizeWords } from "../utils/string.js"

import states from '../geojson/states.json'
import DataTable22 from './data-table-2022'
import IndiaMap from './india-map'
import SpeciesSunburst from './species-sunburst_2022'
import DateChart from './date-chart'

import { mapState } from 'vuex'
import store from '../store/index_2022'

	export default {
		name:"result",
		props: ["debug_flag"],
		components: { DataTable22,
						IndiaMap,
						SpeciesSunburst,
						DateChart
					},
		data() {
			return{
				modes: ["map", "table", "chart"],
				mode: "chart",
				filters: {
					years: [2020,2021,2022],
					portals: ["BBM Counts", "iNaturalist", "India Biodiversity Portal", "iFoundButterflies"],
					state: states.features.map(d => d.properties.state).sort(),
					// date: Array.from({length: 30}, (_, i) => i + 1),
					species: []
				},
				table_filters: [ "states", "taxa"],
				selected_table_filter: "states",
				table_headers: {
					states: [
						["State","state"],
						["Observations","observations"],
						["Unique Taxa","unique_taxa"],
						["Years","years"],
						["Users","users"],
						["Portals", "portals"]
					],
					taxa: [
						["Taxa Name", "taxa"],
						["Rank", "rank"],
						["Observations", "observations"],
						["States", "states"],
						["Years", "years"],
						["Users", "users"],
						["Portals", "portals"]
					]
				},
				portal_names: {
					"All": "All",
					"BBM Counts":  "counts",
					"iNaturalist":  "inat",
					"India Biodiversity Portal":  "ibp",
					// "iFoundButterflies":  "ifb",
				}
			}
		},
		created(){
			store.dispatch('fetchData')
			if(this.debug_flag){
				this.modes.unshift("debug")
				this.mode="debug"
			}
			this.init();
		},
		computed: {
			...mapState({
				filtered_data: state => state.filtered_data,
				filtered_taxa: state => state.filtered_taxa,
				selected: state => state.selected,
			}),
			timestamp(){
				return Date.now()
			},
			portal_stats(){
				let op = {}
				let arr = d3.groups(this.filtered_data, d => d.portal)
				arr.forEach(d => {
					op[d[0]] = d[1].reduce((a,b) => a + b.count, 0)
				})
				return op

			},
			tableData(){
				let op = []
				let arr = []
				if(this.selected_table_filter == "states"){
					arr = d3.groups(this.filtered_data, d => d.state)
					arr.map((row) => {
						op.push({
							state: row[0],
							observations: row[1].reduce((a,b) => a + b.count, 0),
							unique_taxa: new Set(row[1].map((r) => r.taxa_id)).size,
							years: [...new Set(row[1].map((r) => r.year))].sort(),
							users: new Set(row[1].map((r) => r.user_id)).size,
							portals: [...new Set(row[1].map((r) => r.portal))].sort()
						})
					})
				} else if(this.selected_table_filter == "taxa"){
					arr = d3.groups(this.filtered_data, d => d.taxa_id)
					
					arr.map((row) => {
						let taxa = this.filtered_taxa.filter((t) => t.id == row[0])[0]
						let name = taxa?.name
						if(taxa?.common_name){
							name += ` (${taxa.common_name})`
						}
						op.push({
							taxa: name,
							rank: taxa?.rank,
							observations: row[1].reduce((a,b) => a + b.count, 0),
							states: [...new Set(row[1].map((r) => r.state))].sort().length,
							years: [...new Set(row[1].map((r) => r.year))].sort(),
							users: new Set(row[1].map((r) => r.user_id)).size,
							portals: [...new Set(row[1].map((r) => r.portal))].sort()
						})
					})
				}
				
				return op
			},
		},
		watch:{
			filtered_taxa(newVal){
				let species = Object.values(newVal)
								.filter((t) => t.rank == "species")
								.map((t) => (t.common_name) ? `${t.name} (${t.common_name})` : t.name)
								.sort()
				this.filters.species = ["All", ...species]
			}
		},
		methods: {
			init(){
				Object.keys(this.filters).forEach((filter) => {
					this.filters[filter].unshift("All")
				})
			},
			capitalizeWords,
			selectFilter(filter, value){
				if(filter == "portals"){
					store.dispatch('setSelected', {
						filter: filter,
						value: this.portal_names[value]}
					)
				} else {
					store.dispatch('setSelected', {filter, value})
				}
				this.closeDropdowns()
			},
			filterBtnText(filter){
				let op = this.capitalizeWords(filter) + " : "
				if(filter == "species"){
					let selected_taxa = this.filtered_taxa.filter((t) => t.id == this.selected[filter])
					if(selected_taxa.length > 0){
						op += selected_taxa[0].name
					} else {
						op += "All"
					}
				} else {
					op += this.selected[filter]
				}
				return op
			},
			closeDropdowns(){
				// close all dropdowns
				// https://stackoverflow.com/a/62600003/1320237
				document.querySelectorAll('.dropdown-menu.show').forEach((el) => {
					el.classList.remove('show');
				});
			}
		},
	};
</script>
