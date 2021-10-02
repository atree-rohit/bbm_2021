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
		background: #aea;
	}
	.species-table tbody tr.hover-row:hover{
		background: #ff9;
		cursor: pointer;
	}
	.overflow-div{
		max-height: 95vh;
		overflow: scroll;
	}
	#users-table-container {
		max-height: 50vh;
		overflow-y: scroll;
	}
	#users-table-container tbody tr:hover {
		background: #ffd !important;
		cursor: pointer;
	}
	#users-table-container .user-selected {
		background: #080;
		color: #ffa;
		font-weight: 600;
	}
	#users-table-container .first-10 {
		background: #d7f3e3;
	}
	#users-table-container .second-50 {
		background: #e2f0fb;
	}
	#users-table-container .third-100 {
		background: #fdd;
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
		height:  80vh;
		overflow: hidden;
	}

	.ui-collapsible__body{
		padding: 2px;
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
					<div class="svg-container" v-if="tab.title === 'Location'">
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
						<div class="species-data-table">
							<data-table :data="statesTableData"
										:headers='[["State","state"],["Observations","observations"],["Unique Taxa","species"],["Users","users"]]'
										v-if="selected_state == 'All'"
										@rowClick="tableTelectState"
							/>
							<data-table :data="stateSpeciesList"
										:headers='[["Taxa Name","name"],["Observations","count"],["Users","user_count"]]'
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
									 				</td><td v-text="fullDate(o.inat_created_at)"></td>
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
			<ui-collapsible :class="filterClass('users')" :disableRipple="true" :title="filterTitle('users')" :open="accordions[0]" @open="onAccordionOpen(0)" @close="onAccordionClose(0)">
				<data-table :data="userTableData"
							:headers='[["Sl No","sl_no"],["User ID","id"],["User Name","name"],["Observations","observations"],["State","state"]]'
							@rowClick="seletUser(u)"
					/>
				<!-- <table class="table table-sm tableFixHead">
					<thead class="table-secondary">
						<tr>
							<th>Sl No</th>
							<th>User ID</th>
							<th>User Name</th>
							<th>Observations</th>
							<th>State</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="u in userTableData" :class='userTableRowClass(u)' @click="seletUser(u)">
							<td v-text="u.sl_no"></td>
							<td v-text="u.id"></td>
							<td v-text="u.name"></td>
							<td v-text="u.observations"></td>
							<td v-text="u.state"></td>
						</tr>
					</tbody>

				</table> -->
            </ui-collapsible>

            <ui-collapsible :class="filterClass('date')" :disableRipple="true" :title="filterTitle('date')" :open="accordions[1]" @open="onAccordionOpen(1)" @close="onAccordionClose(1)">
                <div id="date-filter">
					<div id="date-chart-continer" class="svg-container"></div>
				</div>
            </ui-collapsible>

            <ui-collapsible :class="filterClass('id_level')" :disableRipple="true" :title="filterTitle('id_level')" :open="accordions[2]" @open="onAccordionOpen(2)" @close="onAccordionClose(2)">
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

            <ui-collapsible :class="filterClass('taxon')" :disableRipple="true" :title="filterTitle('taxon')" :open="accordions[3]" @open="onAccordionOpen(3)" @close="onAccordionClose(3)">
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
import SpeciesSunburst from './species-sunburst'
import IndiaMap from './india-map'
	export default {
		name:"i-nat",
		props: ["inat_data", "inat_taxa"],
		components: { DataTable, SpeciesSunburst, IndiaMap },
		data() {
			return{
				state_data: {},

				state_unmatched: [],
				all_states: [],
				set_state: "",
				state_max: 0,

				selected_users: [],
				selected_dates: [],
				selected_state: "All",
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
			// this.renderMap()
			this.renderDateChart()
			// this.renderTaxonomyChart()

		},
		watch: {
			// selected_users () {
			// 	this.renderMap()
			// 	this.renderDateChart()
			// },
			// selected_dates () {
			// 	this.renderMap()
			// },
			// selected_taxa_levels () {
			// 	this.renderMap()
			// 	this.renderDateChart()
			// },
			// selected_state () {
			// 	// this.renderMap()
			// 	this.renderDateChart()
			// }
		},
		computed:{
			filteredObservations(){
				let op = []
				//filter state state
				if (this.selected_state === "All"){
					op = this.inat_data
				} else {
					op = this.inat_data.filter(x => x.state === this.selected_state)
				}

				if(this.selected_users.length > 0){
					op = op.filter(x => this.selected_users.indexOf(x.user_id) !== -1)
				}

				if(this.selected_dates.length > 0){
					op = op.filter(x => this.selected_dates.indexOf(x.inat_created_at) !== -1)
				}
				if(this.selected_taxa_levels.length > 0){
					op = op.filter(x => this.selected_taxa_levels.indexOf(x.taxa_rank) !== -1)
				}


				if(this.selected_taxa.length > 1){
					let taxa_match = []

					op.forEach(o => {
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

					})
					op = taxa_match
				}



				op = op.reverse()
				return op
			},
			filteredObservationsPaginated(){
				//
				return  this.filteredObservations.slice(this.observationsPerPage * (this.observationsPageNo - 1), this.observationsPerPage * (this.observationsPageNo))
			},
			mapData(){
				let op = this.inat_data
				//filter state state
				

				if(this.selected_users.length > 0){
					op = op.filter(x => this.selected_users.indexOf(x.user_id) !== -1)
				}

				if(this.selected_dates.length > 0){
					op = op.filter(x => this.selected_dates.indexOf(x.inat_created_at) !== -1)
				}
				if(this.selected_taxa_levels.length > 0){
					op = op.filter(x => this.selected_taxa_levels.indexOf(x.taxa_rank) !== -1)
				}


				if(this.selected_taxa.length > 1){
					let taxa_match = []

					op.forEach(o => {
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

					})
					op = taxa_match
				}



				op = op.reverse()
				return op
			},
			userTableData () {
				let user_data = this.inat_data
				let op = []
				let sl_no = 1

				if (this.selected_state != "All"){
					user_data = user_data.filter(x => x.state === this.selected_state)
				}

				if(this.selected_dates.length > 0){
					user_data = user_data.filter(x => this.selected_dates.indexOf(x.inat_created_at) !== -1)
				}
				if(this.selected_taxa_levels.length > 0){
					user_data = user_data.filter(x => this.selected_taxa_levels.indexOf(x.taxa_rank) !== -1)
				}
				user_data = d3.nest().key(o => o.user_id).object(user_data)

				Object.keys(user_data).forEach(u => {
					op.push({
						id: u,
						name: user_data[u][0].user_name,
						observations: user_data[u].length,
						state: user_data[u][0].state
					})
				})

				op.sort((a,b) => (a.observations < b.observations) ? 1 : ((b.observations < a.observations) ? -1 : 0))

				op.forEach((o,id) => {
					op[id].sl_no = sl_no
					sl_no++;
				})

				return op
			},
			dateTableData () {
				let observations = this.inat_data
				let op = []
				let date_data = {}

				if (this.selected_state != "All"){

					observations = this.inat_data.filter(x => x.state === this.selected_state)
				}

				if(this.selected_users.length > 0){
					observations = observations.filter(x => this.selected_users.indexOf(x.user_id) !== -1)
				}

				if(this.selected_taxa_levels.length > 0){
					observations = observations.filter(x => this.selected_taxa_levels.indexOf(x.taxa_rank) !== -1)
				}
				for(var i = 0; i<31; i++){
					date_data[i] = 0
				}
				observations.forEach(o => {
					if(Object.keys(date_data).indexOf(o.inat_created_at.toString()) != -1){
						date_data[o.inat_created_at]++
					}
				})


				op = Object.keys(date_data).map( d => { return { name:d, value:date_data[d] } } )

				return op;
			},
			stateObservations () {
				let state_observations = []
				if(this.selected_state != ''){
					state_observations = this.filteredObservations.filter(x => x.state === this.selected_state)
				}

				return state_observations
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
						op[o.state].observations++
						op[o.state].users.add(o.user_id)
						op[o.state].species.add(o.taxa_name)
					}
				});

				return op
			},
			stateSpeciesList () {
				let op = []
				this.stateObservations.forEach(o => {
					let new_flag = true
					op.forEach((oo, oid) => {
						if (o.taxa_name == oo.name){
							new_flag = false
							op[oid].count++
							op[oid].users.add(o.user_id)
						}
					})
					if(new_flag)
						op.push({
							name: o.taxa_name,
							count: 1,
							users: new Set([o.user_id])
						})
				})

				op.sort((a,b) => (a.count < b.count) ? 1 : ((b.count < a.count) ? -1 : 0))
				op.forEach((s, id) => {
					op[id].user_count = s.users.size
				})
				// console.log(unique_taxa, op)
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
				this.filteredObservations.forEach(o => {
					op[o.taxa_rank]++;
				})
				return op
			},
			taxaTableData () {
				let filtered_observations = []
				let op = {superfamily:0, family:0, subfamily:0, tribe:0, subtribe:0, genus:0, subgenus:0, species:0, subspecies:0, form:0}

				if (this.selected_state === "All"){
					filtered_observations = this.inat_data
				} else {
					filtered_observations = this.inat_data.filter(x => x.state === this.selected_state)
				}

				if(this.selected_users.length > 0){
					filtered_observations = filtered_observations.filter(x => this.selected_users.indexOf(x.user_id) !== -1)
				}

				if(this.selected_dates.length > 0){
					filtered_observations = filtered_observations.filter(x => this.selected_dates.indexOf(x.inat_created_at) !== -1)
				}


				let taxa_level = d3.nest().key(o => o.taxa_rank).object(filtered_observations)

				Object.keys(taxa_level).forEach(tl => {
					if(taxa_level[tl] != undefined)
						op[tl] = taxa_level[tl].length
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


						this.inat_taxa[o.taxa_id].ancestry.split("/").forEach(id => {
							if(this.levels.indexOf(this.inat_taxa[id].rank) != -1){
								hierarchy[this.inat_taxa[id].rank] = this.inat_taxa[id].name
							}
						})
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
		},
		methods: {
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
					case'users':
						op = "Users : "
						if(this.selected_users.length > 0) {
							op += `${this.selected_users.length} selected`
						} else {
							op += "All selected"
						}
						break;
					case 'date':
						op = "Upload Date : "
						if(this.selected_dates.length > 0 && this.selected_dates.length < 30) {
							op += `${Math.min(...this.selected_dates)} - ${Math.max(...this.selected_dates)} Sept, 2021`
						} else {
							op += "All selected"
						}
						break;
					case 'id_level':
						op = "ID Level : "
						if(this.selected_taxa_levels.length > 0 && this.selected_taxa_levels.length < 10) {
							op += `${this.selected_taxa_levels.length} selected`
						} else {
							op += "All selected"
						}
						break;
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
			userTableRowClass (u) {
				let op = ""
				if(this.selected_users.indexOf(u.id) !== -1){
					op = "user-selected"
				} else {
					if(u.sl_no < 10){
						op = "first-10"
					} else if (u.sl_no < 50){
						op = "second-50"
					} else if (u.sl_no < 100) {
						op = "third-100"
					}
				}
				return op;
			},
			imgUrl (url) {
				// let op = ""
				let op = url.replace("square", "medium")
				return op
			},
			taxaClick (t) {
				if(this.selected_taxa != t)
					this.selected_taxa = t
				else
					this.selected_taxa = '';
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
			renderDateChart () {
				let margin = {top: 20, right: 20, bottom: 90, left: 50}
				let margin2 = {top: this.svgHeight * .6 - 70, right: 20, bottom: 30, left: 50}
				let width = this.svgWidth * .9 - margin.left - margin.right
				let height = this.svgHeight * .6 - margin.top - margin.bottom
				let height2 = this.svgHeight *.6 - margin2.top - margin2.bottom
				let that = this

				if (!d3.select("#date-chart-continer svg").empty()) {
					d3.selectAll("#date-chart-continer svg").remove()
				}

				let svg = d3.select("#date-chart-continer").append("svg")
					// .attr("viewBox", [0, 0, width, height])
					.attr("viewBox", [0, 0, width+margin.left+margin.right, height+margin.top+margin.bottom])
						// .attr("width",width+margin.left+margin.right)
						// .attr("height",height+margin.top+margin.bottom);

				let focus = svg.append("g")
								.classed("main-date-chart", true)
								.attr("transform", `translate(${margin.left}, ${margin.top})`)
				let context = svg.append("g")
								.attr("transform", `translate(${margin2.left}, ${margin2.top})`)

				let dataset = this.dateTableData.map(d => d.value)


				var maxHeight=d3.max(dataset,function(d){return d})
                var minHeight=d3.min(dataset,function(d){return d})

                var yScale = d3.scaleLinear().range([0,height]).domain([maxHeight*1.1,0])
				var xScale = d3.scaleBand().rangeRound([0,width]).domain(d3.range(1,dataset.length,1)).padding(0.1)
				var yScale2 = d3.scaleLinear().range([0,height2]).domain([maxHeight*1.1,0])
				var xScale2 = d3.scaleBand().rangeRound([0,width]).domain(d3.range(1,dataset.length,1)).padding(0.1)

				var yAxis = d3.axisLeft(yScale).tickSize(-width)
				var yAxisGroup = focus.append("g").call(yAxis)
				var xAxis = d3.axisBottom(xScale)
				var xAxisGroup = focus.append("g").call(xAxis).attr("transform", "translate(0,"+height+")")

				var xAxis2 = d3.axisBottom(xScale2)
				var xAxisGroup2 = context.append("g").call(xAxis2).attr("transform", "translate(0,"+height2+")")

				var bars1 = focus.selectAll("rect").data(dataset).enter().append("rect")
				bars1.attr("x",function(d,i){
					return xScale(i)//i*(width/dataset.length)
				})
					.attr("y",function(d){
						return yScale(d)
					})//for bottom to top
					.attr("width", xScale.bandwidth()/*width/dataset.length-barpadding*/)
					.attr("height", function(d){
						return height-yScale(d)
					})

				bars1.attr("fill","steelblue")
					.on('mouseover', function (d, i) {
  						that.tooltip.html(`<div>${d} Observations</div>`)
  							.style('visibility', 'visible')
  						})
  					.on('mousemove', function () {
  						that.tooltip
  							.style('top', d3.event.pageY - 10 + 'px')
  							.style('left', d3.event.pageX + 10 + 'px')
  						})
  					.on('mouseout', function () {
  						that.tooltip.html(``).style('visibility', 'hidden')
  						})

				var bars2 = context.selectAll("rect").data(dataset).enter().append("rect");
				bars2.attr("x",function(d,i){
					return xScale2(i);//i*(width/dataset.length);
				})
					.attr("y",function(d){
						return yScale2(d);
					})//for bottom to top
						.attr("width", xScale2.bandwidth()/*width/dataset.length-barpadding*/)
						.attr("height", function(d){
						return height2-yScale2(d);
					})
				bars2.attr("fill", "red")

				var brush = d3.brushX()
						.extent([[0,0],[width,height2]])//(x0,y0)  (x1,y1)
						.on("brush",brushed)//when mouse up, move the selection to the exact tick //start(mouse down), brush(mouse move), end(mouse up)
						.on("end",brushend);
				context.append("g")
				.attr("class","brush")
				.call(brush)
				.call(brush.move,xScale2.range());



				function brushed(){
					if (!d3.event.sourceEvent) return; // Only transition after input.
					if (!d3.event.selection) return; // Ignore empty selections.
					if(d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return; // ignore brush-by-
						//scaleBand of bar chart is not continuous. Thus we cannot use method in line chart.
						//The idea here is to count all the bar chart in the brush area. And reset the domain
					var newInput = [];
					var brushArea = d3.event.selection;
					if(brushArea === null) brushArea = xScale.range();

					xScale2.domain().forEach(function(d){
						var pos = xScale2(d) + xScale2.bandwidth()/2;
						if (pos >= brushArea[0] && pos <= brushArea[1]){
						  newInput.push(d);
						}
					});

					xScale.domain(newInput);
					//	console.log(xScale.domain());
					//realocate the bar chart
					bars1.attr("x",function(d,i){//data set is still data
						return xScale(i)/*xScale(xScale.domain().indexOf(i))*/;
					})
						.attr("y",function(d){
							return yScale(d);
						})//for bottom to top
						.attr("width", xScale.bandwidth())//if you want to change the width of bar. Set the width to xScale.bandwidth(); If you want a fixed width, use xScale2.bandwidth(). Note because we use padding() in the scale, we should use xScale.bandwidth()
						.attr("height", function(d,i){
							if(xScale.domain().indexOf(i) === -1){
								return 0;
							}
							else
								return height-yScale(d);
						})

					xAxisGroup.call(xAxis);
				}
				function brushend(){
					if (!d3.event.sourceEvent) return; // Only transition after input.
					if (!d3.event.selection) return; // Ignore empty selections.
					if(d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return; // ignore brush-by-
						//scaleBand of bar chart is not continuous. Thus we cannot use method in line chart.
						//The idea here is to count all the bar chart in the brush area. And reset the domain
					var newInput = []
					var brushArea = d3.event.selection
					if(brushArea === null) brushArea = xScale.range()

					xScale2.domain().forEach(function(d){
						var pos = xScale2(d) + xScale2.bandwidth()/2;
						if (pos >= brushArea[0] && pos <= brushArea[1]){
							newInput.push(d);
						}
					})

					//relocate the position of brush area
					var increment = 0;
					var left = xScale2(d3.min(newInput));
					var right = xScale2(d3.max(newInput))+xScale2.bandwidth();
					that.selected_dates = newInput
					d3.select(this).transition().call(d3.event.target.move,[left,right]);//The inner padding determines the ratio of the range that is reserved for blank space between bands.
				}
			},
			selectDate (d) {
				var index = this.selected_dates.indexOf(d.name);
				if (index !== -1) {
					this.selected_dates.splice(index, 1);
				} else {
					this.selected_dates.push(d.name)
				}
			},
			srenderMap () {
				let that = this
				let height = this.svgHeight * .9
				let width = this.svgWidth
				if(height > width){
					height /= 3
				}

				if (!d3.select("#map-container svg").empty()) {
					d3.selectAll("#map-container svg").remove()
				}
				let svg = d3.select("#map-container").append("svg").attr("preserveAspectRatio", "xMinYMin meet")
					.attr("viewBox", [0,0, width, height])
					.style("background-color", "rgb(190, 229, 235)")
					.classed("svg-content d-flex m-auto", true)

				var projection = d3.geoMercator().scale(850).center([87, 25.5])
				const path = d3.geoPath().projection(projection)
				const colors = d3.scaleLinear().domain([0, 1, this.state_max]).range(["#f77", "#6a8", "#7f9"])
				var legend = d3Legend.legendColor().scale(colors).shapeWidth(55).labelFormat(d3.format(".0f")).orient('horizontal').cells(6)
				let base = svg.append("g")
					.classed("map-boundary", true)

				let base_text = base.selectAll("text").append("g")
				base = base.selectAll("path").append("g")
				let states = base.append("g").classed("states", true)

				country.features.forEach(state=> {
					let s_name = state.properties.ST_NM
					let that = this

					let current_state = states.append("g")
						.data([state])
						.enter().append("path")
						.attr("d", path)
						.attr("id", s_name.replaceAll(" ", "_").replaceAll("&", ""))
						.attr("title", s_name)
						.on('mouseover', function (d, i) {
	  						that.tooltip.html(
	  							`<table>
	  							<tr><td>State</td><td>${s_name}</td></tr>
	  							<tr><td>Observations</td><td>${that.stateStats[s_name].observations}</td></tr>
	  							<tr><td>Users</td><td>${that.stateStats[s_name].users.size}</td></tr>
	  							<tr><td>Unique Taxa</td><td>${that.stateStats[s_name].species.size}</td></tr>
	  							</table>`)
	  							.style('visibility', 'visible');
	  						})
	  					.on('mousemove', function () {
	  						that.tooltip
	  							.style('top', d3.event.pageY - 10 + 'px')
	  							.style('left', d3.event.pageX + 10 + 'px');
	  						})
	  					.on('mouseout', () => that.tooltip.html(``).style('visibility', 'hidden'))
	  					.on("click", clicked);

					if(this.stateData[s_name] == undefined){
						current_state.attr("fill", (d) => colors(-1))
					} else {
						current_state.attr("fill", (d) => colors(this.stateData[s_name].length))
					}
				})
				let zoom = d3.zoom()
					.scaleExtent([.25, 20])
					.translateExtent([[-width,-height],[2 * width,2 * height]])
					.on('zoom', function() {
						svg.selectAll('.poly_text')
							.attr('transform', d3.event.transform),
						svg.selectAll('path')
							.attr('transform', d3.event.transform),
						svg.selectAll('circle')
							.attr('transform', d3.event.transform)
							.attr("r", 2 / d3.event.transform.k);
					});
				svg.call(zoom);

				mapPoints()
				if(this.map_first_render){
					clicked({properties:{ST_NM: this.selected_state}})
					this.map_first_render = false
				}

				function clicked(d) {
					let state = d.properties.ST_NM
					let [[x0, y0], [x1, y1]] = [[0,0],[0,0]]
				    states.transition().style("fill", null);
					if(that.selected_state != 'All'){
						d3.select("#" + that.selected_state.replaceAll(" ", "_").replaceAll("&", "")).transition().style("fill", null);
					}
					if(that.selected_state == state){
						[[x0, y0], [x1, y1]] = path.bounds(country)
						that.selected_state = 'All'
					} else {
				    	[[x0, y0], [x1, y1]] = path.bounds(d);
						that.selected_state = state
						d3.select(this).transition().style("fill", "gold");
					}
				    svg.transition().duration(750).call(
				      zoom.transform,
				      d3.zoomIdentity
				        .translate(width / 2, height / 2)
				        .scale(Math.min(8, 0.9 / Math.max((x1 - x0) / width, (y1 - y0) / height)))
				        .translate(-(x0 + x1) / 2, -(y0 + y1) / 2),
				    );
				    mapPoints()
				}

				function mapPoints(){
					if (!d3.select("#map-container .map-points").empty()) {
						d3.selectAll(".map-points").remove()
					}
					let points = [];
					if(that.selected_state == 'All'){
						that.state_unmatched.forEach(o => {
							let coords = o.location.split(",")
							points.push([coords[1], coords[0], o.id, o.place_guess]);
						})
					}
					if(that.selected_state != 'All'){
						that.state_data[that.selected_state].forEach(o => {
							let coords = o.location.split(",")
							points.push([coords[1], coords[0], o.id, o.place_guess]);
						})
					}
					if(points.length > 0){
						let map_points = svg.append('g')
							.classed('map-points', true)
							.selectAll("circle")
							.data(points).enter()
							.append("circle")
							.attr("cx", (d) => projection(d)[0])
							.attr("cy", (d) => projection(d)[1])
							.attr("r", "0px")

						// map_points.on("click", (d) => that.setMissingState(d))
					}
				}
			},
			selectState (s) {
					this.selected_state = s
			},
			tableTelectState(s){
				let selected = this.statesTableData[s].state
				if (this.selected_state == selected) {
					this.selected_state = 'All'
				} else {
					this.selected_state = selected
				}
			},
			renderTaxonomyChart () {
				let height = this.svgHeight
				let width = this.svgWidth
				let margin = 40
				let data = this.taxaTableData
				let total_observations = this.inat_data.length

  				var radius = Math.min(width, height) / 2 - margin

  				var svg = d3.select("#taxonomy-chart-continer")
  							.append("svg")
  							.classed('doughnut-chart d-flex m-auto', true)
  							.attr("width", width)
  							.attr("height", height)
  							.append("g")
  								.classed('doughnut-chart', true)
  								.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
  				// set the color scale
  				var color = d3.scaleOrdinal()
  								.domain(data)
  								.range(d3.schemeSet2);

  				// Compute the position of each group on the pie:
  				var pie = d3.pie()
  					.value(function(d) {return d.value; })
  				var data_ready = pie(d3.entries(data))

  				var arcGenerator = d3.arc()
										.innerRadius(50)
										.outerRadius(radius)



  				// Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
  				let that = this
				svg.selectAll('mySlices')
					.data(data_ready)
					.enter()
					.append('path')
					.attr('d', arcGenerator)
					.attr('fill', function(d){ return(color(d.data.key)) })
					.attr("stroke", "black")
					.style("stroke-width", ".25px")
					.style("opacity", 0.7)
					.on('mouseover', function (d, i) {
  						that.tooltip.html(`<div>Rank: ${d.data.key}</div><div>Observations: ${Math.round(Math.exp(d.value))}</div><div>Percent of Total: ${Math.round(Math.round(Math.exp(d.value))/total_observations*10000)/100}%`)
  							.style('visibility', 'visible');
  						})
  					.on('mousemove', function () {
  						that.tooltip
  							.style('top', d3.event.pageY - 10 + 'px')
  							.style('left', d3.event.pageX + 10 + 'px');
  						})
  					.on('mouseout', function () {
  						that.tooltip.html(``).style('visibility', 'hidden');
  					});
				svg.append('g')
					.classed('doughnut-labels', true)
					.selectAll('mySlices')
					.data(data_ready)
					.enter()
					.append('text')
					.text(function(d){ return d.data.key})
					.attr("transform", function(d) { return "translate(" + arcGenerator.centroid(d) + ")";  })
					.style("text-anchor", "middle")
					.style("font-size", 15)
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
				this.$refs[ref].open();
			},
			closeModal (ref) {
				//
				this.$refs[ref].close();
			},
			init () {
				if (this.svgWidth > 800){
					this.svgWidth = window.innerWidth / 2
				}

				country.features.forEach(s => {
					this.state_data[s.properties.ST_NM] = [];
				})

				this.inat_data.forEach(o => {
					if(o.state == null){
						this.state_unmatched.push(o);
					} else if(Object.keys(this.state_data).indexOf(o.state) != -1){
						this.state_data[o.state].push(o)
					} else {
						this.state_data[o.state].push(o)
						console.log("strange state name", o.state, o)
					}
				});

				Object.keys(this.state_data).forEach(s => {
					if(this.state_data[s].length > this.state_max)
						this.state_max = this.state_data[s].length;
				})



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
							    .text('a simple tooltip');

				this.all_states = country.features.map(s => s.properties.ST_NM)
			}
		}
	};
</script>
