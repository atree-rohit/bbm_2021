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

</style>
<template>
	<div id="result-page" class="container-fluid">
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
		<div class="container-fluid">
			<div class="row">
				{{selected}}
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
		
	</div>
</template>

<script>
import { capitalizeWords } from "../utils/string.js"

import axios from 'axios'
import * as d3Collection from 'd3-collection'
import states from '../geojson/states.json'
import districts from '../geojson/districts.json'
import DataTable from './data-table'
import IndiaMap from './india-map'
import SpeciesSunburst from './species-sunburst'
import DateChart from './date-chart'

import { mapState } from 'vuex'
import store from '../store/index_2022'

	export default {
		name:"result",
		props: ["debug_flag"],
		components: { DataTable,
						IndiaMap,
						SpeciesSunburst,
						DateChart
					},
		data() {
			return{
				modes: ["map", "table", "chart"],
				mode: "map",
				filters: {
					years: [2020,2021,2022],
					portals: ["BBM Counts", "iNaturalist", "India Biodiversity Portal", "iFoundButterflies"],
					state: states.features.map(d => d.properties.state).sort(),
					date: Array.from({length: 30}, (_, i) => i + 1),
					species: []
				},
				portal_names: {
					"All": "All",
					"BBM Counts":  "counts",
					"iNaturalist":  "inat",
					"India Biodiversity Portal":  "ibp",
					"iFoundButterflies":  "ifb",
				}
			}
		},
		created(){
			store.dispatch('fetchTaxa')
			store.dispatch('fetchAllPortalData', 2020)
			this.init();
		},
		computed: {
			...mapState({
				filtered_data: state=> state.filtered_data,
				filtered_taxa: state=> state.filtered_taxa,
				selected: state=> state.selected,
			}),
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
					if(filter != "years"){
						this.filters[filter].unshift("All")
					}
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
					if(filter == "years"){
						store.dispatch('fetchAllPortalData', value)
					}
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
