<style>
	*,
	*::before,
	*::after {
	    box-sizing: border-box;
	}
	*::-webkit-scrollbar-track
    {
        -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
        border-radius: 10px;
        background-color: #F5F5F5;
    }

    *::-webkit-scrollbar
    {
        width: 7px;
        background-color: #F5F5F5;
    }

    *::-webkit-scrollbar-thumb
    {
        border-radius: 10px;
        -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
        background-color: #a7c;
    }

	html {
	    font-size: 100%;
	}

	.filter-set .ui-collapsible__header{
		background: #0a5;
		color: white;
	}
	.filter-set .ui-collapsible__header:hover{
		background: #3A8 !important;
	}

	.ui-collapsible__header-content span.material-icons{
		color: #777;
		margin: 0 10px;
		transition: all .4s;
	}
	.filter-set span.material-icons{
		color: white;
	}

	.ui-collapsible:hover .ui-collapsible__header-content span.material-icons{
		color: darkgreen;
	}


	#map-filters{
		max-height: 92vh;
		overflow-y: auto;
		overflow-x: auto;
	}

	.doughnut-chart path:hover,
	.map-points circle:hover{
		cursor: pointer;
		stroke: yellow;
		fill: red;
	}
	#report-page{
		display: grid;
  		grid-template-columns: repeat(2, 1fr);
  		font-size: .8rem;
  	}
	.cards-table,
	.cards-table td {
	    padding: 0;
	    margin: 0;
	    line-height: 1.25;
	    background: #eef;
	}
	.card-values {
		font-size: calc(1.5rem + 1.5vw);
	}
	.card-labels{
		font-size: calc(1rem + 1vw);
	}

	.ui-tabs__body{
		padding: 0;
	}
	.ui-tab > div{
		height:  87vh;
		overflow-y: hidden;
	}

	.ui-collapsible__body{
		padding: 2px;
	}

	#observations-container{
		overflow-y: scroll;
	}

	#observations-pagination-div{
		background: #cad;
		padding: 10px;
	}

	#date-chart-continer .tick line{
		stroke:  #aaa;
		stroke-width: 0.5px;
	}

	.switch-div{
		background: #ecf;
	}

	.switch input {
        position: absolute;
        opacity: 0;
    }

    .switch {
        display: inline-block;
        font-size: 20px; /* 1 */
        height: 1em;
        width: 2em;
        background: #BDB9A6;
        border-radius: 1em;
    }

    .switch div {
        height: 1em;
        width: 1em;
        border-radius: 1em;
        background: #FFF;
        box-shadow: 0 0.1em 0.3em rgba(0,0,0,0.3);
        -webkit-transition: all 300ms;
         -moz-transition: all 300ms;
              transition: all 300ms;
    }

    .switch input:checked + div {
        -webkit-transform: translate3d(100%, 0, 0);
         -moz-transform: translate3d(100%, 0, 0);
              transform: translate3d(100%, 0, 0);
    }
    .switch-label{
        padding: 5px;
        border-radius: 5px;
        transition: all .5s;
    }
    .switch-selected{
        background: #9e7;
    }
    .switch-div > span,
    .switch-div > label{
        transition: all .25s;
    }
    .switch-div > span:hover,
    .switch-div > label:hover{
        cursor: pointer;
        background: #fef;
        box-shadow: 2px 2px 5px #550;
    }

	@media screen and (max-width: 800px) {
		body{
			overflow: scroll;
		}
		.ui-tabs__body{
			padding: 0;
		}
		.ui-tab > div{
			height: 50vh;
		}
		#report-page{
			grid-template-columns: repeat(1, 1fr);
		}
	}
</style>
<template>
	<div class="container-fluid" id="report-page">
		<div id="locations-tab">
			<ui-tabs
				:fullwidth="true"
				:raised="true"
				type="text"
				backgroundColor="clear"
			>
				<ui-tab
					:key="tab.title"
					:selected="tab.title === 'Location'"
					:title="tab.title"
					v-for="tab in tabs"
				>
					<div id="map-container" v-if="tab.title === 'Location'">
						<india-map :map_data="mapData"
								   :selected_area="selected_area"
								   :popup="tooltip"
								   :areaStats="areaStats"
								   :set_polygon="set_polygon_switch"
								   @stateSelected='selectState'
								   
						/>
					</div>
					<div id="map-data-table" v-if="tab.title === 'Table'">
						<div class="d-flex justify-content-around text-center">
							<table class="table cards-table">
								<tbody>
									<tr class="card-values">
										<td v-text="cardValues('observations')"></td>
										<td v-text="cardValues('users')"></td>
										<td v-text="cardValues('species')"></td>
									</tr>
									<tr class="card-labels">
										<td>Observations</td>
										<td>Users</td>
										<td>Unique Taxa</td>
									</tr>

								</tbody>
							</table>
						</div>
						<div class="d-flex justify-content-center py-1 switch-div">
							<div class="me-5" v-if="selected_area.state != 'All'">
								<button class="btn btn-sm btn-outline-danger" @click="selected_area = {area: 'All', state: 'All', district: 'All'}">
									Back to All States
								</button>
							</div>
							<span class="switch-label" :class="!table_switch?'switch-selected':''" @click="table_switch=false">States</span>
							<label class="switch mx-3 my-auto"><input type="checkbox" v-model="table_switch"/>
							<div></div>
							</label>
							<span class="switch-label" :class="table_switch?'switch-selected':''" @click="table_switch=true">Species</span>
						</div>
						<div class="species-data-table">
							<data-table :data="statesTableData"
										:headers='[["State","state"],["Observations","observations"],["Unique Taxa","species"],["Users","users"], ["Portals", "portals"]]'
										:selected='[selected_area.state]'
										:selected_col="'state'"
										:sort_col="'observations'"
										:sort_dir="'desc'"
										@rowClick="selectTableState"
										v-if="!table_switch"
							/>
							<data-table :data="speciesTableData"
										:headers='speciesTableHeaders'
										:selected="[]"
										:selected_col="''"
										:sort_col="'observations'"
										:sort_dir="'desc'"
										@rowClick="tableSelectTaxa"
										v-else
							/>
						</div>
					</div>
				</ui-tab>
			</ui-tabs>
		</div>
		<div id="map-filters">
			<ui-collapsible :class="accordianClass('portals')" :disableRipple="true" :open="accordions[1]" @open="onAccordionOpen(1)" @close="onAccordionClose(1)">
				<div slot="header" class="d-flex">
					<span class="material-icons">
						pages
					</span>
					<div>
						{{accordianTitle('portals')}}
					</div>
					<button class="badge rounded-pill ms-2 btn-danger"
							v-if="selected_portals.length > 0 && selected_portals.length <3"
							@click.stop='selected_portals = ["counts", "inat", "ibp", "ifb"]'
						>Reset</button>
				</div>
				<div class="d-flex justify-content-center">
					<button class="mx-2 btn" :class="portalBtnClass('counts')" @click="selectPortal('counts')">Butterfly Counts</button>
					<button class="mx-2 btn" :class="portalBtnClass('inat')" @click="selectPortal('inat')">iNaturalist</button>
					<button class="mx-2 btn" :class="portalBtnClass('ibp')" @click="selectPortal('ibp')">India Biodiversity Portal</button>
					<button class="mx-2 btn" :class="portalBtnClass('ifb')" @click="selectPortal('ifb')">iFoundButterflies</button>
				</div>
            </ui-collapsible>

            <ui-collapsible :class="accordianClass('users')" :disableRipple="true" :open="accordions[2]" @open="onAccordionOpen(2)" @close="onAccordionClose(2)">
            	<div slot="header" class="d-flex">
					<span class="material-icons">
						people
					</span>
					<div>
						{{accordianTitle('users')}}
					</div>
					<button class="badge rounded-pill ms-2 btn-danger"
							v-if="selected_users.length > 0"
							@click.stop='selected_users = []'
						>Reset</button>
				</div>
				<data-table :data="userTableData"
							:headers='[["Sl No","sl_no"],["User ID","id"],["Observations","observations"],["State","state"], ["Portals", "portals"]]'
							:selected='selected_users'
							:selected_col="'id'"
							:sort_col="'sl_no'"
							:sort_dir="'asc'"
							@rowClick="seletUser"
					/>
            </ui-collapsible>

            <ui-collapsible :class="accordianClass('date')" :disableRipple="true" :open="accordions[3]" @open="onAccordionOpen(3)" @close="onAccordionClose(3)">
                <div slot="header" class="d-flex">
					<span class="material-icons">
						today
					</span>
					<div>
						{{accordianTitle('date')}}
					</div>
					<button class="badge rounded-pill ms-2 btn-danger"
							v-if="selected_dates.length > 0"
							@click.stop='selected_dates = []'
						>Reset</button>
				</div>
                <div id="date-filter">
                	<div class="d-flex justify-content-center py-1 switch-div">
						<span class="switch-label" :class="!date_switch?'switch-selected':''" @click="date_switch=false">Observed on</span>
						<label class="switch mx-3 my-auto"><input type="checkbox" v-model="date_switch"/>
						<div></div>
						</label>
						<span class="switch-label" :class="date_switch?'switch-selected':''" @click="date_switch=true">Created on</span>
					</div>
					<date-chart :dateTableData="dateTableData" :selected_dates="selected_dates" :popup="tooltip" @dateRangeSelected='selectDateRange'/>
				</div>
            </ui-collapsible>

            <ui-collapsible :class="accordianClass('id_level')" :disableRipple="true" :open="accordions[4]" @open="onAccordionOpen(4)" @close="onAccordionClose(4)">
                <div slot="header" class="d-flex">
					<span class="material-icons">
						account_tree
					</span>
					<div>
						{{accordianTitle('id_level')}}
					</div>
					<button class="badge rounded-pill ms-2 btn-danger"
							v-if="selected_taxa_levels.length > 0 && selected_taxa_levels.length < 10"
							@click.stop='selected_taxa_levels = []'
						>Reset</button>
				</div>
                <div id="taxon-level-filter">
					<div id="taxa-level-btns" class="d-flex flex-wrap justify-content-center">
						<button
							v-for="(t, tname) in taxaTableData"
							class="btn btn-sm m-1"
							:key="tname"
							:class="taxaLevelBtnClass(tname, t)"
							v-text="`${tname} (${t})`"
							@click="selectTaxaLevel(tname)"
						>
						</button>
					</div>
					<div class="d-flex justify-content-center mt-3">
						<button class="btn btn-sm mx-3" :class="idLevelBtnClass('all')" @click="idLevelBtnClick('all')">Select All</button>
						<button class="btn btn-sm mx-3" :class="idLevelBtnClass('none')" @click="idLevelBtnClick('none')">Select None</button>
					</div>

				</div>
            </ui-collapsible>

            <ui-collapsible :class="accordianClass('taxon')" :disableRipple="true" :open="accordions[5]" @open="onAccordionOpen(5)" @close="onAccordionClose(5)">
                <div slot="header" class="d-flex">
					<span class="material-icons">
						data_usage
					</span>
					<div>
						{{accordianTitle('taxon')}}
					</div>
					<button class="badge rounded-pill ms-2 btn-danger"
							v-if="selected_taxa.length > 1"
							@click.stop='selected_taxa = []'
						>Reset</button>
				</div>
                <species-sunburst :tree_data="treeData" :selected="selected_taxa" @select-taxon="selectTaxon"/>
            </ui-collapsible>
			
			<ui-collapsible :class="accordianClass('debug')" :disableRipple="true" :open="accordions[6]" @open="onAccordionOpen(6)" @close="onAccordionClose(6)" v-if="debug_flag">
                <div slot="header" class="d-flex">
					<span class="material-icons">
						data_usage
					</span>
					<div>
						{{accordianTitle('debug')}}
					</div>
				</div>
                <div>
					<span class="switch-label" :class="!set_polygon_switch?'switch-selected':''" @click="set_polygon_switch=false">Set Polygon - Off</span>
					<label class="switch mx-3 my-auto"><input type="checkbox" v-model="set_polygon_switch"/>
						<div></div>
					</label>
					<span class="switch-label" :class="set_polygon_switch?'switch-selected':''" @click="set_polygon_switch=true">Set Polygon - On</span>
				</div>
				<div>
					<div>
						<label for="">IDs</label>
						<input type="text" v-model="set_location_data.ids" />
					</div>
					<div>
						<label for="">State</label>
						<select v-model="set_location_data.state" @change="updateDistricts">
							<option v-for='(s, i) in select_options.states' :key="i" :value="s" v-text="s" />
						</select>
					</div>
					<div>
						<label for="">District</label>
						<select v-model="set_location_data.district">
							<option v-for='(d, i) in select_options.districts' :key="i" :value="d" v-text="d" />
						</select>
					</div>
					<button @click="setStateSubmit">Submit</button>
				</div>
            </ui-collapsible>
		</div>
	</div>
</template>

<script>
import axios from 'axios'
import * as d3Collection from 'd3-collection'
import states from '../geojson/states.json'
import districts from '../geojson/districts.json'
import DataTable from './data-table'
import IndiaMap from './india-map'
import SpeciesSunburst from './species-sunburst'
import DateChart from './date-chart'
	export default {
		name:"result",
		props: ["taxa", "all_portal_data", "debug_flag"],
		components: { DataTable,
						IndiaMap,
						SpeciesSunburst,
						DateChart
					},
		data() {
			return{
				selected_portals: ["counts", "inat", "ibp", "ifb"],
				selected_users: [],
				selected_dates: [],
				selected_area: {
					region: "All",
					state: "All",
					district: "All",
				},
				selected_taxa_levels: [],
				selected_taxa: [],
				filteredObservations: [],

				levels: ["superfamily", "family", "subfamily", "tribe", "genus", "species"],
				
				set_location_data: {
					ids: null,
					state: null,
					district: null
				},
				select_options: {
					states: states.features.map((s) => s.properties.state).sort(),
					districts: districts.features.map((s) => s.properties.district).sort(),
				},
				tooltip: null,
				tabs: [
					{title:"Location"},
					{title:"Table"},
				],

				date_switch:false,
				table_switch:false,
				accordions: {
					0: false,
					1: false,
					2: false,
					3: false,
					4: false,
					5: false,
					6: true,
				},
				set_polygon_switch: false,
			}
		},
		created() {
			this.init()
		},
		mounted() {
		},
		watch: {
		},
		computed:{
			mapData (){
				let op = this.getFilteredObservations("states")

				if(this.set_polygon_switch){
					op = op.filter((r) => r.state == null)
				}

				return op
			},
			userTableData () {
				let op = []
				let user_data = this.getFilteredObservations("users")
				user_data = d3Collection.nest().key(o => o.user_id).object(user_data)

				op = Object.keys(user_data)
						.map((u) => {
							let states = new Set(user_data[u].map(u => u.state))
							let portals = new Set(user_data[u].map(u => u.portal))
							return {
									id: u,
									// name: user_data[u][0].user_name,
									observations: user_data[u].length,
									state: [...states].join(", "),
									portals: [...portals].join(", ")
							}
						})
				op.sort((a,b) => (a.observations < b.observations) ? 1 : ((b.observations < a.observations) ? -1 : 0))

				op = op.map((o,id) => { return { ...o, sl_no: id+1 } })
				console.log("UTD", op, user_data)
				return op
			},
			dateTableData () {
				let date_data = {}
				let op = this.getFilteredObservations("dates")

				for(var i = 0; i<=31; i++){
					date_data[i] = 0
				}
				op.forEach(o => {
					let key = parseInt(o[this.selectDateType].replace("2022-09-", ""), 10).toString()
					if(Object.keys(date_data).indexOf(key) != -1){
						date_data[key]++
					}
				})
				op = Object.keys(date_data).map( d => { return { name:d, value:date_data[d] } } )
				return op;
			},
			areaStats(){
				let all_observations = this.filteredObservations
				let op = {
					all: { observations: 0, users: new Set(), species: new Set(), portals: new Set() },
					region: {},
					state: {},
					district: {}
				}
				let regions = {}
				states.features.forEach((s) => {
					if(regions[s.properties.region] == undefined){
						regions[s.properties.region] = []
					}
					regions[s.properties.region].push(s.properties.state)
				})
				districts.features.forEach((d) => {
					if(op.region[d.properties.region] == undefined){
						op.region[d.properties.region] = { observations: 0, users: new Set(), species: new Set(), portals: new Set() }
					}
					if(op.state[d.properties.state] == undefined){
						op.state[d.properties.state] = { observations: 0, users: new Set(), species: new Set(), portals: new Set() }
					}
					if(op.district[d.properties.district] == undefined){
						op.district[d.properties.district] = { observations: 0, users: new Set(), species: new Set(), portals: new Set() }
					}
				})
				
				if(this.set_polygon_switch == true){
					all_observations = all_observations.filter((r) => r.state == null)
				}
				all_observations.forEach((o) => {
					let current_region = null
					op.all.observations++,
					op.all.users.add(o.user_id)
					op.all.species.add(o.taxa_id)
					op.all.portals.add(o.portal)

					Object.keys(regions).forEach((r) => {
						if(regions[r].indexOf(o.state) != -1){
							current_region = r
						}
					})
					if(current_region != null){
						op.region[current_region].observations++
						op.region[current_region].users.add(o.user_id)
						op.region[current_region].species.add(o.taxa_id)
						op.region[current_region].portals.add(o.portal)
					}
					if(o.state !== null){
						op.state[o.state].observations++
						op.state[o.state].users.add(o.user_id)
						op.state[o.state].species.add(o.taxa_id)
						op.state[o.state].portals.add(o.portal)
					}
					if(o.district !== null){
						op.district[o.district].observations++
						op.district[o.district].users.add(o.user_id)
						op.district[o.district].species.add(o.taxa_id)
						op.district[o.district].portals.add(o.portal)						
					}
				})
				return op
			},
			speciesTableData () {
				let op = []
				this.filteredObservations.forEach(o => {
					let new_flag = true
					let taxa_name = ""
					if (this.taxa[o.taxa_id] != undefined){
						taxa_name = this.taxa[o.taxa_id].name
						op.forEach((oo, oid) => {
							if (taxa_name == oo.name){
								new_flag = false
								op[oid].count++
								op[oid].users.add(o.user_id)
								op[oid].states.add(o.state)
								op[oid].portals.add(o.portal)
							}
						})
						if(new_flag){
							op.push({
								name: taxa_name,
								common_name: this.taxa[o.taxa_id].common_name,
								count: 1,
								users: new Set([o.user_id]),
								states: new Set([o.state]),
								portals: new Set([o.portal])
							})
						}
					} else {
						console.log(o.id, o.taxa_id, "Not found")
					}
				})
				op.sort((a,b) => (a.count < b.count) ? 1 : ((b.count < a.count) ? -1 : 0))
				op.forEach((s, id) => {
					op[id].user_count = s.users.size
					op[id].state_count = s.states.size
					op[id].portals = [...s.portals].join(", ")
				})
				
				return op
			},
			statesTableData () {
				let op = []

				Object.keys(this.areaStats.state).forEach(s => {
					op.push({
						state: s,
						observations: this.areaStats.state[s].observations,
						users: this.areaStats.state[s].users.size,
						species: this.areaStats.state[s].species.size,
						portals: [...this.areaStats.state[s].portals].join(", ")
					})
				})
				op.sort((a,b) => (a.observations < b.observations) ? 1 : ((b.observations < a.observations) ? -1 : 0))
				return op
			},
			taxaLevelCounts () {
				let op = {}
				let levels = ["superfamily", "family", "subfamily", "tribe", "subtribe", "genus", "subgenus", "species", "subspecies", "form"]
				levels.forEach(t => {
					op[t] = 0
				})
				this.filteredObservations.map(o => { op[o.rank]++ })
				return op
			},
			taxaTableData () {
				let op = {superfamily:0, family:0, subfamily:0, tribe:0, subtribe:0, genus:0, subgenus:0, species:0, subspecies:0, form:0}
				let taxa_level = {}
				let filtered_observations = this.getFilteredObservations("taxa")
				
				taxa_level = d3Collection.nest().key(o => o.rank).object(filtered_observations)
				Object.keys(taxa_level).forEach(tl => {
					if(taxa_level[tl] != undefined){
						op[tl] = taxa_level[tl].length
					}
				})

				return op
			},
			treeData (){
				let op = []
				let filtered_observations = this.getFilteredObservations("tree")

				filtered_observations.forEach(o => {
					if(o.taxa_id != undefined && this.taxa[o.taxa_id].rank == "species"){
						let taxa = this.taxa[o.taxa_id]
						let hierarchy = {}
						hierarchy[taxa.rank] = taxa.name
						hierarchy.key = taxa.name
						this.taxa[taxa.id].ancestry.split("/").forEach(id => {
							if(this.levels.indexOf(this.taxa[id].rank) != -1){
								hierarchy[this.taxa[id].rank] = this.taxa[id].name
							}
						})
						this.levels.forEach((l, lid) => {
							if( (hierarchy[l] == undefined) && (lid < this.levels.indexOf(taxa.rank)) ){
								hierarchy[l] = "Incertae sedis"
							}
						})
						if(op.map(e => e.species).indexOf(hierarchy.species) == -1){
							hierarchy.value = 1
							op.push(hierarchy)
						}
					}
				})

				return op
			},
			speciesTableHeaders () {
				let op = [["Taxa Name","name"], ["Common Name","common_name"],["Observations","count"],["Users","user_count"]]
				if(this.selected_area.state == "All"){
					op.push(["States", "state_count"])
				}
				op.push(["Portals", "portals"])
				return op
			},
			selectDateType () {
				let op = "date"
				if(this.date_switch)
					op = "date_created"
				return op
			},
		},
		methods: {
			getFilteredObservations (type = null){
				let portals = (this.selected_portals.length == 0) ? Object.keys(this.all_portal_data) : this.selected_portals
				
				let op =  portals.map((p) => this.all_portal_data[p]).reduce((pre, curr) => pre.concat(curr))
				console.log(op)

				if (type != "states" && this.selected_area.state != 'All') {
					op = op.filter((r) => r.state == this.selected_area.state)
				}

				if(type != "users" && this.selected_users.length > 0){
					op = op.filter((r) => this.selected_users.indexOf(r.user_id) != -1)
				}

				if(type != "dates" && this.selected_dates.length > 0){
					op = op.filter((r) => this.selected_dates.indexOf(parseInt(r.date.replace("2022-09-", ""), 10)) != -1)
				}
				
				if(type != "taxa" && this.selected_taxa_levels.length > 0){
					op = op.filter((r) => this.selected_taxa_levels.indexOf(r.rank) != -1)
				}

				if(type != "tree" ){
					op = this.filterTaxa(op)
				}

				return op
			},
			filterTaxa (ar){
				let op = ar
				if(this.selected_taxa.length > 1){
					let taxa_match = []

					op.forEach(o => {
						if(this.taxa[o.taxa_id] != undefined){
							let hierarchy = {}
							let match_flag = true

							hierarchy[o.rank] = o.taxa_name
							this.taxa[o.taxa_id].ancestry.split("/").forEach(id => {
								if(this.levels.indexOf(this.taxa[id].rank) != -1){
									hierarchy[this.taxa[id].rank] = this.taxa[id].name
								}
							})
							this.selected_taxa.forEach((t,id)  => {
								if(t != hierarchy[this.levels[id]] && t != 'Incertae sedis')
									match_flag = false
							})
							if(match_flag){
								taxa_match.push(o)
							}
						}

					})
					op = taxa_match
				}
				return op
			},
			selectPortal (p) {
				let pos = this.selected_portals.indexOf(p)
				if(pos == -1){
					this.selected_portals.push(p)
				} else {
					this.selected_portals.splice(pos, 1)
				}
			},
			selectState (s) {
				let area_names = {
					regions: [],
					states: [],
					districts: [],
				}
				this.selected_area.region = "All"
				this.selected_area.state = "All"
				this.selected_area.district = "All"
				districts.features.map((d) => {
					if(area_names.regions.indexOf(d.properties.region) == -1){
						area_names.regions.push(d.properties.region)
					}
					if(area_names.states.indexOf(d.properties.state) == -1){
						area_names.states.push(d.properties.state)
					}
					area_names.districts.push(d.properties.district)
				})
				if(area_names.regions.indexOf(s) != -1){
					this.selected_area.region = s
				} else if(area_names.states.indexOf(s) != -1){
					this.selected_area.region = districts.features.filter((d) => d.properties.state == s)[0].properties.region
					this.selected_area.state = s
				} else if(area_names.districts.indexOf(s) != -1){
					this.selected_area.region = districts.features.filter((d) => d.properties.district == s)[0].properties.region
					this.selected_area.state = districts.features.filter((d) => d.properties.district == s)[0].properties.state
					this.selected_area.district = s
				}				
			},
			setPoint(p){
				let ids = {
					ibp: p[3].observations.filter((o) => o.portal == "ibp").map((o) => o.id).join(","),
					inat: p[3].observations.filter((o) => o.portal == "inat").map((o) => o.id).join(","),
				}
				this.set_location_data.ids = ids
			},
			updateDistricts(){
				this.select_options.districts = districts.features.filter((d) => d.properties.state == this.set_location_data.state ).map((d) => d.properties.district).sort()
				console.log("update districts", this.set_location_data)
			},
			setStateSubmit(){
				console.log("axios post", this.set_location_data)
				axios.post("/result/set_state", this.set_location_data)
					.then((response) => {
						console.log("added", response.data.added)
						this.set_location_data.ids = ""
					})
			},
			selectTableState (s){
				let selected = this.statesTableData[s].state
				this.selected_area.state = (this.selected_area.state == selected) ? 'All' : selected
			},
			seletUser (u){
				let selected = this.userTableData[u]
				let index = this.selected_users.indexOf(selected.id)
				if (index !== -1) {
					this.selected_users.splice(index, 1);
				} else {
					this.selected_users.push(selected.id)
				}
			},
			selectDateRange (d){
				this.selected_dates = d
			},
			selectTaxaLevel (tname) {
				let op = this.selected_taxa_levels.indexOf(tname)
				if(op == -1){
					this.selected_taxa_levels.push(tname)
				} else {
					this.selected_taxa_levels.splice(op, 1)
				}
			},
			selectTaxon (t) {
				this.selected_taxa = t
			},
			tableSelectTaxa (t) {
				console.log("select Taxa", this.speciesTableData[t])
			},
			portalBtnClass (p) {
				let op = "btn-outline-primary"
				if(this.selected_portals.indexOf(p) != -1)
					op = "btn-success"
				return op
			},
			idLevelBtnClass (t) {
				let op = "btn-outline-danger"
				switch(t){
					case 'all':
						if(this.selected_taxa_levels.length < 10){
							op = "btn-primary"
						}
						break;
					case 'none':
						if(this.selected_taxa_levels.length > 0){
							op = "btn-primary"
						}
						break;
				}
				return op
			},
			idLevelBtnClick (t) {
				switch(t){
					case 'all':
							this.selected_taxa_levels = ["superfamily", "family", "subfamily", "tribe", "subtribe", "genus", "subgenus", "species", "subspecies", "form"]
						break;
					case 'none':
							this.selected_taxa_levels = []
						break;
				}
			},
			taxaLevelBtnClass (tname, no) {
				let op = "btn-outline-secondary"
				if (this.selected_taxa_levels.indexOf(tname) != -1) {
					if( no == 0){
						op = "btn-danger"
					} else {
						op = "btn-success"
					}
				} else if( no == 0) {
					op = "btn-outline-danger"
				}
				return op
			},
			accordianClass (f){
				let op = ""
				if(this.accordianTitle(f).includes(": All selected") || f == "debug"){
					op = ""
				} else {
					op = "filter-set"
				}
				return op;
			},
			accordianTitle (f){
				let op = ""
				switch(f){
					case 'portals':
						op = "Portals : "
						if (this.selected_portals.length == 4){
							op += "All selected"
						} else {
							op += `${this.selected_portals.length} selected`
						}
						break
					case'users':
						op = "Users : "
						if(this.selected_users.length > 0) {
							op += `${this.selected_users.length} selected`
						} else {
							op += "All selected"
						}
						break
					case 'date':
						op = "Date : "
						if(this.selected_dates.length > 0 && this.selected_dates.length < 30) {
							op += `${Math.min(...this.selected_dates)} - ${Math.max(...this.selected_dates)} Sept, 2021`
						} else {
							op += "All selected"
						}
						break
					case 'id_level':
						op = "ID Level : "
						if(this.selected_taxa_levels.length > 0 && this.selected_taxa_levels.length < 10) {
							op += `${this.selected_taxa_levels.length} selected`
						} else {
							op += "All selected"
						}
						break
					case 'taxon':
						op = "Taxon: "
						if(this.selected_taxa.length > 1){
							op += this.selected_taxa.join(" > ")
						} else {
							op += "All selected"
						}
						break
					case 'debug':
						op = "Debug: "
				}
				return op
			},
			cardValues (card) {
				let root = this.areaStats.all
				let op = ""
				if(this.selected_area.state != "All"){
					root = this.areaStats.state[this.selected_area.state]
				}
				if(!root){
					if(["north", "south", "east", "west"].indexOf(this.selected_area.state) != -1){
						root = this.areaStats.region[this.selected_area.state]
					} else {
						root = this.areaStats.district[this.selected_area.state]
					}
				}
				switch(card){
					case "observations": op = root.observations
						break;
					case "users": op = root.users.size
						break;
					case "species": op = root.species.size
						break;
				}
				return op
			},
			onAccordionOpen (id) {
				Object.keys(this.accordions).forEach(key => {
					this.accordions[key] = key == id; // eslint-disable-line eqeqeq
				});
			},
			onAccordionClose (key) {
				this.accordions[key] = false;
			},
			init () {
				if(this.debug_flag){
					this.set_polygon_switch = true
				}
				this.filteredObservations = this.getFilteredObservations()
				this.tooltip = d3.select('body')
							    .append('div')
							    .attr('class', 'd3-tooltip')
							    .style('position', 'absolute')
							    .style('z-index', '10')
							    .style('visibility', 'hidden')
							    .style('padding', '10px')
							    .style('background', 'rgba(0,0,0,0.6)')
							    .style('border-radius', '4px')
							    .style('color', '#fff')
							    .text('a simple tooltip')
			}
		}
	};
</script>
