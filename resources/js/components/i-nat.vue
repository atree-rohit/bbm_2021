<style>
	*,
	*::before,
	*::after {
	    box-sizing: border-box;
	}

	html {
	    font-size: 100%;
	    /*overflow: hidden;*/
	}
	body{
		/*overflow: hidden;*/
	}

	/*.ui-tabs > div,
	.ui-tabs > div > div{
		overflow-x: hidden;
	}*/
	.filter-set .ui-collapsible__header{
		background: #cea;
	}
	.filter-set .ui-collapsible__header:hover{
		background: #ed9 !important;
	}
	.ui-collapsible__header-content span.material-icons{
		color: #777;
		margin: 0 10px;
		transition: all .4s;
	}
	.ui-collapsible:hover .ui-collapsible__header-content span.material-icons{
		color: darkgreen;
	}


	#map-filters{
		max-height: 92vh;
		overflow-y: scroll;
		overflow-x: auto;
	}



	#date-chart-continer svg g rect,
	.map-boundary path,
	.map-points circle,
	.doughnut-chart path
	{
		transition: fill .5s;
	}
	.map-points circle{
		stroke-width: .5px;
		stroke: red;
		fill: pink;
	}
	#date-chart-continer svg g.main-date-chart rect:hover {
	  fill: yellow;
	  cursor: pointer;
	  background: orangered;
	}
	.y-grid .tick line{
		stroke: #ccc;
	}
	.x-ticks .tick text{
		text-anchor: end;
		transform: rotate(-20deg);
		font-size: .5vw;
	}
	.map-boundary path{
		stroke: #333;
		stroke-linejoin: round;
		stroke-width: .1;
	}
	.map-boundary path:hover{
		cursor: pointer;
		fill: beige;
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
	.cards-table {
		font-size: calc(1.5rem + 1.5vw);
	}
	.cards-table,
	.cards-table td{
		padding: 0;
		margin: 0;
	}
	.card-values{
		font-size: calc(1rem + 1vw);
	}
	.map-data-title{
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
	/*#observations-container{
		max-height: 82vh;
		overflow-y: scroll;
	}*/

	#observations-container{
		overflow-y: scroll;
	}
	#gallery{
		/* Prevent vertical gaps */
		/*line-height: 0;*/

		-webkit-column-count: 3;
		-webkit-column-gap:   2px;
		-moz-column-count:    3;
		-moz-column-gap:      2px;
		column-count:         3;
		column-gap:           2px;
	}

	#gallery div {
		/* Just in case there are inline attributes */
		width: 100% !important;
		height: auto !important;
		margin: 2px;
	}
	.observation-img{
		position: relative;
	}
	.observation-img .gallery-item-overlay {
		background: rgba(0,0,0,0.7);
		position: absolute;
		height: 99%;
		width: 100%;
		left: 0;
		top: 0;
		bottom: 0;
		right: 0;
		opacity: 0;
		-webkit-transition: all 0.3s ease-in-out 0s;
		-moz-transition: all 0.3s ease-in-out 0s;
		transition: all 0.3s ease-in-out 0s;
	}

	.observation-img:hover .gallery-item-overlay{
		opacity: 1;
	}

	.observation-img .gallery-item-image{
		width: 100%;
	}

	.observation-img .gallery-item-details {
		position: absolute;
		text-align: center;
		padding-left: 1em;
		padding-right: 1em;
		width: 100%;
		top: 180%;
		left: 50%;
		opacity: 0;
		-webkit-transform: translate(-50%, -50%);
		-moz-transform: translate(-50%, -50%);
		transform: translate(-50%, -50%);
		-webkit-transition: all 0.2s ease-in-out 0s;
		-moz-transition: all 0.2s ease-in-out 0s;
		transition: all 0.2s ease-in-out 0s;
	}

	.observation-img:hover .gallery-item-details{
		top: 50%;
		left: 50%;
		opacity: 1;
		color:  #aaa;
	}

	.gallery-item-details .table-sm,
	.gallery-item-details tr,
	.gallery-item-details td
	{
		padding: 1px;
		margin: 0;
	}
	.place-cell{
		font-size: .6rem;
	}
	.gallery-caption-icon{
		font-size: .9rem;
	}
	#date-chart-continer .tick line{
		stroke:  #aaa;
		stroke-width: 0.5px;
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
        background: #beb;
    }
    .switch-div > span,
    .switch-div > label{
        transition: all .25s;
    }
    .switch-div > span:hover,
    .switch-div > label:hover{
        cursor: pointer;

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
		#gallery {
  			-webkit-column-count: 2;
			-webkit-column-gap:   1px;
			-moz-column-count:    2;
			-moz-column-gap:      1px;
			column-count:         2;
			column-gap:           1px;
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
						<!-- <div id="map-container"></div> -->
						<india-map :map_data="mapData"
								   :selected_state="selected_state"
								   :popup="tooltip"
								   :stateStats="stateStats"
								   @stateSelected='selectState'
						/>
					</div>
					<div id="map-data-table" v-if="tab.title === 'Table'">
						<div class="d-flex justify-content-around text-center">
							<table class="table cards-table">
								<tbody>
									<tr>
										<td v-text="stateStats[selected_state].observations"></td>
										<td v-text="stateStats[selected_state].users.size"></td>
										<td v-text="stateStats[selected_state].species.size"></td>
									</tr>
									<tr class="card-values">
										<td>Observations</td>
										<td>Users</td>
										<td>Unique Taxa</td>
									</tr>

								</tbody>
							</table>
						</div>
				        <div class="d-flex justify-content-center my-3 switch-div">
							<span class="switch-label" :class="!table_switch?'switch-selected':''" @click="table_switch=false">States</span>
							<label class="switch mx-3 my-auto"><input type="checkbox" v-model="table_switch"/>
							<div></div>
							</label>
							<span class="switch-label" :class="table_switch?'switch-selected':''" @click="table_switch=true">Species</span>
						</div>
						<div class="species-data-table">
							<data-table :data="statesTableData"
										:headers='[["State","state"],["Observations","observations"],["Unique Taxa","species"],["Users","users"]]'
										v-if="!table_switch"
										@rowClick="tableSelectState"
							/>
							<data-table :data="stateSpeciesList"
										:headers='speciesTableHeaders'
										v-else
							/>
						</div>
					</div>
					<div id="observations-container" v-if="tab.title === 'Observations'">
						<div id="gallery">
							<div v-for="o in filteredObservationsPaginated">
								<div class="observation-img">
									 <div class="gallery-item-overlay"></div>
									 <img class="gallery-item-image" :src="imgUrl(o.img_url)">
									 <div class="gallery-item-details">
									 	<table class="table table-sm text-light">
									 		<tbody>
									 			<tr>
									 				<td class='gallery-caption-icon'>
									 					<span class="material-icons">
									 						badge
									 					</span>
									 				</td>
								 					<td v-text="speciesName(o.taxa_id)">

									 				</td>
									 			</tr>
									 			<tr>
									 				<td class='gallery-caption-icon'>
									 					<span class="material-icons">
									 						person
									 					</span>
									 				</td>
									 				<td v-text="o.user_id"></td>
									 			</tr>
									 			<tr>
									 				<td class='gallery-caption-icon'>
									 					<span class="material-icons">
									 						calendar_today
									 					</span>
									 				</td><td v-text="fullDate(o.created_at)"></td>
									 			</tr>
									 			<tr>
									 				<td class='gallery-caption-icon'>
									 					<span class="material-icons">
															place
														</span>
									 				</td><td class="place-cell" v-text="o.place_guess"></td>
									 			</tr>
									 			<tr>
									 				<td colspan="2"><ui-button color="green" size="small" raised @click="gotoObservation(o)">Go to Observation</ui-button></td>
									 			</tr>
									 		</tbody>
									 	</table>

									 </div>
								</div>
							</div>
						</div>
					</div>
				</ui-tab>
			</ui-tabs>
		</div>
		<div id="map-filters">
			<ui-collapsible :class="filterClass('portals')" :disableRipple="true" :open="accordions[0]" @open="onAccordionOpen(0)" @close="onAccordionClose(0)">
				<div slot="header" class="d-flex">
					<span class="material-icons">
						pages
					</span>
					<div>
						{{filterTitle('portals')}}
					</div>
				</div>
				<div class="d-flex justify-content-center">
					<button class="mx-2 btn" :class="portalBtnClass('counts')" @click="togglePortal('counts')">Butterfly Counts</button>
					<button class="mx-2 btn" :class="portalBtnClass('inat')" @click="togglePortal('inat')">iNaturalist</button>
				</div>
            </ui-collapsible>

            <ui-collapsible :class="filterClass('users')" :disableRipple="true" :open="accordions[1]" @open="onAccordionOpen(1)" @close="onAccordionClose(1)">
            	<div slot="header" class="d-flex">
					<span class="material-icons">
						people
					</span>
					<div>
						{{filterTitle('users')}}
					</div>
				</div>
				<data-table :data="userTableData"
							:headers='[["Sl No","sl_no"],["User ID","id"],["User Name","name"],["Observations","observations"],["State","state"]]'
							@rowClick="seletUser(u)"
					/>
            </ui-collapsible>

            <ui-collapsible :class="filterClass('date')" :disableRipple="true" :open="accordions[2]" @open="onAccordionOpen(2)" @close="onAccordionClose(2)">
                <div slot="header" class="d-flex">
					<span class="material-icons">
						today
					</span>
					<div>
						{{filterTitle('date')}}
					</div>
				</div>
                <div id="date-filter">
					<date-chart :dateTableData="dateTableData" :selected_dates="selected_dates" :popup="tooltip" @dateRangeSelected='selectDateRange'/>
				</div>
            </ui-collapsible>

            <ui-collapsible :class="filterClass('id_level')" :disableRipple="true" :open="accordions[3]" @open="onAccordionOpen(3)" @close="onAccordionClose(3)">
                <div slot="header" class="d-flex">
					<span class="material-icons">
						account_tree
					</span>
					<div>
						{{filterTitle('id_level')}}
					</div>
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
					<div class="d-flex justify-content-around">
						<button class="btn btn-sm" :class="idLevelBtnClass('all')" @click="idLevelBtnClick('all')">Select All</button>
						<button class="btn btn-sm" :class="idLevelBtnClass('none')" @click="idLevelBtnClick('none')">Select None</button>
					</div>

				</div>
            </ui-collapsible>

            <ui-collapsible :class="filterClass('taxon')" :disableRipple="true" :open="accordions[4]" @open="onAccordionOpen(4)" @close="onAccordionClose(4)">
                <div slot="header" class="d-flex">
					<span class="material-icons">
						data_usage
					</span>
					<div>
						{{filterTitle('taxon')}}
					</div>
				</div>
                <species-sunburst :tree_data="treeData" :selected="selected_taxa" @select-taxon="selectTaxon"/>
            </ui-collapsible>
		</div>
		<ui-modal ref="update-state-Modal" title="Set / Update Observation State" :alignTop="true">
			 <ui-select
                has-search
                label="Select State"
                placeholder="Select State"
                :options="all_states"
                v-model="set_state"
            ></ui-select>
            <ui-button color="green" raised @click="updateState">Submit</ui-button>
        </ui-modal>
	</div>
</template>

<script>
import axios from 'axios';
import country from '../country.json'
import DataTable from './data-table'
import IndiaMap from './india-map'
import SpeciesSunburst from './species-sunburst'
import DateChart from './date-chart'
	export default {
		name:"i-nat",
		props: ["inat_data", "inat_taxa", "form_data"],
		components: { DataTable, IndiaMap, SpeciesSunburst, DateChart },
		data() {
			return{
				table_switch:false,
				all_data:[],
				all_states: [],
				set_state: "",

				selected_portals: ["counts", "inat"],
				selected_users: [],
				selected_dates: [],
				selected_state: "Goa",
				selected_point:  null,
				selected_taxa_levels: [],
				selected_taxa: [],

				levels: ["superfamily", "family", "subfamily", "tribe", "genus", "species"],
				taxa_tree: {},
				tabs: [
					{title:"Location"},
					{title:"Table"},
					{title:"Observations"},
				],
				map_first_render:true,

				svgWidth: window.innerWidth * 0.6,
				svgHeight: window.innerHeight * 0.9,
				tooltip: null,

				observationsPerPage: 100,
				observationsPageNo: 1,
				accordions: {
					0: false,
					1: false,
					2: false,
					3: false
				}
			}
		},
		created() {
			this.init()
		},
		mounted() {
			this.selected_state = "All"
		},
		watch: {
		},
		computed:{
			filteredObservations(){
				let op = this.all_data

				op = this.filterPortal(op)
				op = this.filterState(op)
				op = this.filterUsers(op)
				op = this.filterDates(op)
				op = this.filterTaxaLevels(op)
				op = this.filterTaxa(op)
				op = op.reverse()

				return op
			},
			filteredObservationsPaginated(){
				//
				return  this.filteredObservations.filter(o => o.img_url != '')
							.slice(this.observationsPerPage * (this.observationsPageNo - 1), this.observationsPerPage * (this.observationsPageNo))
			},
			mapData(){
				let op = this.all_data

				op = this.filterPortal(op)
				op = this.filterUsers(op)
				op = this.filterDates(op)
				op = this.filterTaxaLevels(op)
				op = this.filterTaxa(op)

				return op
			},
			userTableData () {
				let user_data = this.all_data
				let op = []

				user_data = this.filterPortal(user_data)
				user_data = this.filterState(user_data)
				user_data = this.filterDates(user_data)
				user_data = this.filterTaxaLevels(user_data)
				user_data = this.filterTaxa(user_data)
				user_data = d3.nest().key(o => o.user_id).object(user_data)

				op = Object.keys(user_data)
						.map((u) => {return {
									id: u,
									name: user_data[u][0].user_name,
									observations: user_data[u].length,
									state: user_data[u][0].state
								}})
				op.sort((a,b) => (a.observations < b.observations) ? 1 : ((b.observations < a.observations) ? -1 : 0))

				op = op.map((o,id) => {
					o.sl_no = id + 1
					return o
				})

				return op
			},
			dateTableData () {
				let op = this.all_data
				let date_data = {}

				op = this.filterPortal(op)
				op = this.filterState(op)
				op = this.filterUsers(op)
				op = this.filterTaxaLevels(op)
				op = this.filterTaxa(op)
				for(var i = 0; i<31; i++){
					date_data[i] = 0
				}
				op.forEach(o => {
					if(Object.keys(date_data).indexOf(o.created_at.toString()) != -1){
						date_data[o.created_at]++
					}
				})
				op = Object.keys(date_data).map( d => { return { name:d, value:date_data[d] } } )

				return op;
			},
			stateStats () {
				let op = {}
				op['All'] = { observations: 0, users: new Set(), species: new Set() }
				country.features.forEach(s => {
					op[s.properties.ST_NM] = { observations: 0, users: new Set(), species: new Set() }
				})

				this.filteredObservations.forEach(o => {
					op['All'].observations++
					op['All'].users.add(o.user_id)
					op['All'].species.add(o.taxa_name)
					if(o.state !== null){
						// console.log(`+${o.state}+`)
						op[o.state].observations++
						op[o.state].users.add(o.user_id)
						op[o.state].species.add(o.taxa_name)
					}
				})

				return op
			},
			stateSpeciesList () {
				let op = []
				this.filteredObservations.forEach(o => {
					let new_flag = true
					op.forEach((oo, oid) => {
						if (o.taxa_name == oo.name){
							new_flag = false
							op[oid].count++
							op[oid].users.add(o.user_id)
							op[oid].states.add(o.state)
						}
					})
					if(new_flag){
						let x = {
							name: o.taxa_name,
							count: 1,
							users: new Set([o.user_id]),
							states: new Set([o.state])
						}
						let common_name = ""
						if(this.inat_taxa[o.taxa_id] != undefined){
							common_name = this.inat_taxa[o.taxa_id].common_name
						}
						else{
							console.log(o.id, o.taxa_id, "Not found")
						}
						x.common_name = common_name
						op.push(x)
					}
				})
				op.sort((a,b) => (a.count < b.count) ? 1 : ((b.count < a.count) ? -1 : 0))
				op.forEach((s, id) => {
					op[id].user_count = s.users.size
					op[id].state_count = s.states.size
				})

				return op
			},
			statesTableData () {
				let op = []

				Object.keys(this.stateStats).forEach(s => {
					if(s != 'All'){
						op.push({
							state: s,
							observations: this.stateStats[s].observations,
							users: this.stateStats[s].users.size,
							species: this.stateStats[s].species.size
						})
					}
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
				this.filteredObservations.map(o => { op[o.taxa_rank]++ })
				return op
			},
			taxaTableData () {
				let filtered_observations = this.all_data
				let op = {superfamily:0, family:0, subfamily:0, tribe:0, subtribe:0, genus:0, subgenus:0, species:0, subspecies:0, form:0}
				let taxa_level = {}

				filtered_observations = this.filterPortal(filtered_observations)
				filtered_observations = this.filterState(filtered_observations)
				filtered_observations = this.filterUsers(filtered_observations)
				filtered_observations = this.filterDates(filtered_observations)
				filtered_observations = this.filterTaxa(filtered_observations)
				taxa_level = d3.nest().key(o => o.taxa_rank).object(filtered_observations)
				Object.keys(taxa_level).forEach(tl => {
					if(taxa_level[tl] != undefined){
						op[tl] = taxa_level[tl].length
					}
				})

				return op
			},
			treeData(){
				let op = []
				let obv_taxonomy = []
				let unique_species_taxonomy = []

				obv_taxonomy = this.filteredObservations.map(o => {
						let hierarchy = {
							id: o.id,
							rank: o.taxa_rank
						}
						hierarchy[o.taxa_rank] = o.taxa_name
						hierarchy.key = o.taxa_name

						if(this.inat_taxa[o.taxa_id] != undefined){
							this.inat_taxa[o.taxa_id].ancestry.split("/").forEach(id => {
								if(this.levels.indexOf(this.inat_taxa[id].rank) != -1){
									hierarchy[this.inat_taxa[id].rank] = this.inat_taxa[id].name
								}
							})
						}
						this.levels.forEach((l, lid) => {
							if( (hierarchy[l] == undefined) && (lid < this.levels.indexOf(o.taxa_rank)) ){
								hierarchy[l] = "none"
							}
						})

						return hierarchy
					})

				//Modify this to handle higer taxa ids
				const unique_species_list = [...new Set(obv_taxonomy.map(item => item.species))]

				unique_species_list.forEach(s => {
					let sp_taxonomy = obv_taxonomy.find(item => item.species == s)
					sp_taxonomy.value = 1
					delete sp_taxonomy.id
					delete sp_taxonomy.rank
					unique_species_taxonomy.push(sp_taxonomy)
				})
				return unique_species_taxonomy
			},
			speciesTableHeaders() {
				let op = [["Taxa Name","name"], ["Common Name","common_name"],["Observations","count"],["Users","user_count"]]
				if(this.selected_state == "All"){
					op.push(["States", "state_count"])
				}
				return op
			}
		},
		methods: {
			portalBtnClass (p) {
				let op = "btn-outline-primary"
				if(this.selected_portals.indexOf(p) != -1)
					op = "btn-success"
				return op
			},
			togglePortal (p) {
				let pos = this.selected_portals.indexOf(p)
				if(pos == -1){
					this.selected_portals.push(p)
				} else {
					this.selected_portals.splice(pos, 1)
				}
			},
			filterPortal(ar){
				let op = ar
				if (this.selected_portals.length > 0) {
					op = op.filter(o => this.selected_portals.indexOf(o.portal) !== -1)
				}
				return op
			},
			filterState(ar){
				let op = ar
				if (this.selected_state != 'All') {
					op = op.filter(o => o.state == this.selected_state)
				}
				return op
			},
			filterUsers(ar){
				let op = ar
				if(this.selected_users.length > 0){
					op = op.filter(x => this.selected_users.indexOf(x.user_id) !== -1)
				}
				return op
			},
			filterDates(ar){
				let op = ar
				if(this.selected_dates.length > 0){
					op = op.filter(x => this.selected_dates.indexOf(x.created_at) !== -1)
				}
				return op
			},
			filterTaxaLevels(ar){
				let op = ar
				if(this.selected_taxa_levels.length > 0){
					op = op.filter(x => this.selected_taxa_levels.indexOf(x.taxa_rank) !== -1)
				}
				return op
			},
			filterTaxa(ar){
				let op = ar
				if(this.selected_taxa.length > 1){
					let taxa_match = []

					op.forEach(o => {
						if(this.inat_taxa[o.taxa_id] != undefined){
							let hierarchy = {}
							let match_flag = true

							hierarchy[o.taxa_rank] = o.taxa_name
							this.inat_taxa[o.taxa_id].ancestry.split("/").forEach(id => {
								if(this.levels.indexOf(this.inat_taxa[id].rank) != -1){
									hierarchy[this.inat_taxa[id].rank] = this.inat_taxa[id].name
								}
							})
							this.selected_taxa.forEach((t,id)  => {
								if(t != hierarchy[this.levels[id]] && t != 'none')
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
			idLevelBtnClass (t) {
				let op = "btn-outline-secondary"
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
			filterTitle(f){
				let op = ""
				switch(f){
					case 'portals': 
						op = "Portals : "
						if (this.selected_portals.length == 2){
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
						op = "Upload Date : "
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
							op += this.selected_taxa.join(" - ")
						} else {
							op += "All selected"
						}
				}
				return op
			},
			filterClass(f){
				let op = ""
				if(this.filterTitle(f).includes(": All selected")){
					op = ""
				} else {
					op = "filter-set"
				}
				return op;
			},
			onAccordionOpen(id) {
				Object.keys(this.accordions).forEach(key => {
					this.accordions[key] = key == id; // eslint-disable-line eqeqeq
				});
			},
			onAccordionClose(key) {
				//
				this.accordions[key] = false;
			},
			updateState () {
				const axios = require('axios');
				let post_data = {
					id: this.selected_point.id,
					state: this.set_state
				}
				var that = this;

				axios.post('/inat/update_state', post_data)
					.then(function (response) {
						if(response.status == 200){
							that.closeModal('update-state-Modal')
						}
					})
					.catch(function (error) {
						console.log(error);
					})
					.then( function () {
						location.reload();
					});
			},
			setMissingState (p) {
				this.inat_data.forEach(o =>{
					if(o.id == p[2]){
						this.selected_point = o
						if(o.state == null){
							this.set_state = ''
						} else {
							this.set_state = o.state
						}
					}
				})
				this.openModal('update-state-Modal')
			},
			seletUser(u){
				var index = this.selected_users.indexOf(u.id);
				if (index !== -1) {
					this.selected_users.splice(index, 1);
				} else {
					this.selected_users.push(u.id)
				}
			},
			imgUrl (url) {
				// let op = ""
				let op = url.replace("square", "medium")
				return op
			},
			fullDate (d) {
				let op = `${d} Sept, 21`
				return op
			},
			speciesName (id) {
				let op = ""
				if (this.inat_taxa[id] !== undefined){
					if (this.inat_taxa[id].common_name !== '' && this.inat_taxa[id].rank === 'species') {
						op = `${this.inat_taxa[id].name} ( ${this.inat_taxa[id].common_name} )`
					} else {
						op = this.inat_taxa[id].name
					}
				}
				return op
			},
			gotoObservation (o) {
				let url = 'https://www.inaturalist.org/observations/' + o.id;
				window.open(url, '_blank').focus();
			},
			selectDateRange(d){
				//
				this.selected_dates = d
			},
			selectState (s) {
				// console.log("emit setter", s)
				this.selected_state = s
			},
			tableSelectState(s){
				let selected = this.statesTableData[s].state
				if (this.selected_state == selected) {
					this.selected_state = 'All'
				} else {
					this.selected_state = selected
				}
			},
			selectTaxon (t) {
				//
				this.selected_taxa = t
				// console.log(this.selected_taxa)
			},
			selectTaxaLevel (tname) {
				let op = this.selected_taxa_levels.indexOf(tname)
				if(op == -1){
					this.selected_taxa_levels.push(tname)
				} else {
					this.selected_taxa_levels.splice(op, 1)
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
			openModal (ref) {
				//
				this.$refs[ref].open()
			},
			closeModal (ref) {
				//
				this.$refs[ref].close()
			},
			init () {
				this.all_data = this.inat_data.concat(this.form_data)
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

				this.all_states = country.features.map(s => s.properties.ST_NM)
			}
		}
	};
</script>
