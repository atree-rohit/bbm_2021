<style>
	*,
	*::before,
	*::after {
	    box-sizing: border-box;
	}

	html {
	    font-size: 100%;
	    overflow: hidden;
	}

	.ui-tabs > div, 
	.ui-tabs > div > div{
		overflow-x: hidden;
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
		height: 70vh;
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
	#date-chart-continer svg g rect:hover {
	  fill: orangered;
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
	#locations-tab{
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
	.all-states-table tbody tr:hover{
		background: #ffa;
		cursor: pointer;
	}
	.species-data-table{
		height: 50vh;
		overflow-y: scroll;
	}
	.tableFixHead{
		overflow: auto;
		height: 100px;
	}
	.tableFixHead thead th{
		position: sticky;
		top: 0;
		z-index: 1;
	}

	#observation-container{
		height: 70vh;
		overflow-y: scroll;
	}
	#gallery{
		/* Prevent vertical gaps */
		/*line-height: 0;*/

		-webkit-column-count: 6;
		-webkit-column-gap:   2px;
		-moz-column-count:    6;
		-moz-column-gap:      2px;
		column-count:         6;
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

	.table-sm{
		padding: 1px;
	}
	.place-cell{
		font-size: .8rem;
	}
	.gallery-table-title{
		background: #330;
		font-size: .9rem;
		font-weight: 600;
	}


	@media screen and (max-width: 800px) {
		.container-fluid,
		.ui-tabs__body{
			padding: 0;
		}
		#locations-tab{
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
	<div class="container-fluid">
		<div id="locations-tab">
			<ui-tabs
				:fullwidth="true"
				:raised="true"
				type="text"
			>
				<ui-tab
					:key="tab.title"
					:selected="tab.title === 'Location'"
					:title="tab.title"
					v-for="tab in tabs"
				>

					<div id="map-container" class="svg-container" v-if="tab.title === 'Location'"></div>
					<div id="map-data-table" v-if="tab.title === 'Table'">
						<div class="text-center p-2 bg-info map-data-title">{{selected_state}}</div>
						<div class="d-flex justify-content-around text-center">
							<table class="table cards-table">
								<tbody>
									<tr v-if="selected_state != ''"	>
										<td v-text="stats[selected_state].observations"></td>
										<td v-text="stats[selected_state].users.size"></td>
										<td v-text="stats[selected_state].species.size"></td>
									</tr><tr class="card-values">
										<td>Observations</td>
										<td>Users</td>
										<td>Unique Taxa</td>
									</tr>

								</tbody>
							</table>
						</div>
						<div class="species-data-table">
							<table class="table tableFixHead all-states-table" v-if="selected_state == 'All'">
								<thead class="table-secondary">
									<tr>
										<th>State</th>
										<th>Observations</th>
										<th>Unique Taxa</th>
										<th>Users</th>
									</tr>
								</thead>
								<tbody>
									<tr v-for="row in statesTableData" @click='selectState(row.state)'>
										<td v-text="row.state"></td>
										<td v-text="row.observations"></td>
										<td v-text="row.species"></td>
										<td v-text="row.users"></td>
									</tr>
								</tbody>
							</table>
							<table class="table tableFixHead" v-else>
								<thead class="table-secondary">
									<tr>
										<th>Taxa Name</th>
										<th>Observations</th>
										<th>Users</th>
									</tr>
								</thead>
								<tbody>
									<tr v-for="row in stateSpeciesList">
										<td v-text="row.name"></td>
										<td v-text="row.count"></td>
										<td v-text="row.users.size"></td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
<<<<<<< HEAD
					<div id="observations-continer"v-if="tab.title === 'Observations'">
						Observations
					</div>

				</ui-tab>
			</ui-tabs>
			<div id="map-filters">
				<ui-collapsible title="Users" :open="accordions[0]" @open="onAccordionOpen(0)" @close="onAccordionClose(0)">
	                <div id="user-filter">
						<div id="users-table-container">
							<table class="table table-sm tableFixHead">
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
									<tr v-for="(u, id) in userTableData" :class='userTableRowClass(id, u)' @click="seletUser(u)">
										<td v-text="id + 1"></td>
										<td v-text="u.id"></td>
										<td v-text="u.name"></td>
										<td v-text="u.observations"></td>
										<td v-text="u.state"></td>
									</tr>
								</tbody>
								
							</table>
							
=======
				</div>
				<div v-if="tab.title=='Taxonomy'">
					<div id="taxa-level-btns" class="text-center">
						<ui-button size="small"
							v-for="(t, tname) in taxaLevelCounts"
							:key="tname"
							:color="taxaLevelBtnClass(tname)"
							:class=""
							v-text="`${tname} (${t})`"
							@click="selectTaxaLevel(tname)"
						>
						</ui-button>
					</div>
					<div id="taxonomy-chart-continer" class="svg-container"></div>
				</div>
				<div v-if="tab.title=='Observations'">
					<div id="observation-container">
						<div id="gallery">
							<div v-for="(o, k) in paginatedObservations" v-if="k < 100">
								<div class="observation-img">
									 <div class="gallery-item-overlay"></div>
									 <img class="gallery-item-image" :src="imgUrl(o.img_url)">
									 <div class="gallery-item-details">
									 	<table class="table table-sm text-light">
									 		<tbody>
									 			<tr>
									 				<td class='gallery-table-title'>Name</td><td v-text="speciesName(o.taxa_id)"></td>
									 			</tr>
									 			<tr>
									 				<td class='gallery-table-title'>User</td><td v-text="o.user_id"></td>
									 			</tr>
									 			<tr>
									 				<td class='gallery-table-title'>Date</td><td v-text="fullDate(o.inat_created_at)"></td>
									 			</tr>
									 			<tr>
									 				<td class='gallery-table-title'>Place</td><td class="place-cell" v-text="o.place_guess"></td>
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
						<div class="text-center">
							<ui-button size="small"
								color="primary"
								v-text="'Previous'"
								@click="observationsPageNo--"
								v-if="observationsPageNo > 1"
							>
							</ui-button>
							{{observationsPageNo}}
							<ui-button size="small"
								color="primary"
								v-text="'Next'"
								@click="observationsPageNo++"
							>
							</ui-button>
>>>>>>> 7fa3e3fde45440581323e3537284e524e30f1d9e
						</div>
					</div>
	            </ui-collapsible>

	            <ui-collapsible title="Upload Date" :open="accordions[1]" @open="onAccordionOpen(1)" @close="onAccordionClose(1)">
	                <div id="date-filter">
						<div id="date-chart-continer" class="svg-container"></div>
					</div>
	            </ui-collapsible>

	            <ui-collapsible title="ID Level" :open="accordions[2]" @open="onAccordionOpen(2)" @close="onAccordionClose(2)">
	                <div id="taxon-level-filter">
						<div id="taxa-level-btns" class="text-center">
							{{selected_taxa_levels}}<br>
							<ui-button size="small" 
								v-for="(t, tname) in taxa_table_data"
								:key="tname"
								:color="taxaLevelBtnClass(tname)"
								:class=""
								v-text="`${tname} (${t})`"
								@click="selectTaxaLevel(tname)"
							>
							</ui-button>
						</div>
						<div id="taxonomy-chart-continer" class="svg-container"></div>
					</div>
	            </ui-collapsible>
			</div>

		</div>

		<!-- <div >
			<div id="observation-container">
				<div id="gallery">
					<div v-for="o in filteredObservationsPaginated">
						<div class="observation-img">
							 <div class="gallery-item-overlay"></div>
							 <img class="gallery-item-image" :src="imgUrl(o.img_url)"">
							 <div class="gallery-item-details">
							 	<table class="table table-sm text-light">
							 		<tbody>
							 			<tr>
							 				<td class='gallery-table-title'>Name</td><td v-text="speciesName(o.taxa_id)"></td>
							 			</tr>
							 			<tr>
							 				<td class='gallery-table-title'>User</td><td v-text="o.user_id"></td>
							 			</tr>
							 			<tr>
							 				<td class='gallery-table-title'>Date</td><td v-text="fullDate(o.inat_created_at)"></td>
							 			</tr>
							 			<tr>
							 				<td class='gallery-table-title'>Place</td><td class="place-cell" v-text="o.place_guess"></td>
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
		</div> -->
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
import * as d3 from "d3"
import * as d3Legend from "d3-svg-legend"
import country from '../country.json'
	export default {
		name:"i-nat",
		props: ["inat_data", "inat_taxa", "inat_tree"],
		data() {
			return{
				user_data: {},
				date_data: {},
				state_data: {},

				state_unmatched: [],
				all_states: [],
				set_state: "",
				state_max: 0,

				selected_users: [],
				selected_dates: [],
				selected_state: "All",
				selected_point:  null,
				selected_taxa_levels: ["superfamily", "family", "subfamily", "tribe", "subtribe", "genus", "subgenus", "species", "subspecies", "form"],
				selected_taxa: '',
				
				date_table_data: [],
				stats: {},

				taxa_level: {},
				taxa_tree: this.inat_tree,
				tabs: [
					{title:"Location"},
					{title:"Table"},
					{title:"Observations"},
				],
				
				svgWidth: window.innerWidth * 0.75,
				svgHeight: window.innerHeight * 0.75,
				tooltip: null,
				
				observationsPerPage: 100,
				observationsPageNo: 1,
				accordions: {
					0: true,
					1: false,
					2: false
				}
			}
		},
		created() {
			this.init()
		},
		mounted() {
			this.renderMap()
			this.renderDateChart()
<<<<<<< HEAD
			this.renderTaxonomyChart()
			console.log(this.dateTableData)
			console.log(this.date_table_data)
		},
		watch: {
			dateTableData: function (val) {
				this.renderDateChart();
			},
			// filteredObservations(){
			// 	this.renderMap();
			// }
=======
			// this.renderTaxonomyChart()
>>>>>>> 7fa3e3fde45440581323e3537284e524e30f1d9e
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
<<<<<<< HEAD
=======
				if(this.selected_taxa_levels.length > 0){
					op = op.filter(x => this.selected_taxa_levels.indexOf(x.taxa_rank) !== -1)
				}
>>>>>>> 7fa3e3fde45440581323e3537284e524e30f1d9e

				op = op.reverse()
				return op
			},
<<<<<<< HEAD
			filteredObservationsPaginated(){
				return  this.filteredObservations.slice(this.observationsPerPage * (this.observationsPageNo - 1), this.observationsPerPage * (this.observationsPageNo))
=======
			paginatedObservations()  {
				return this.filteredObservations.slice(this.observationsPerPage * (this.observationsPageNo - 1), this.observationsPerPage * (this.observationsPageNo))
>>>>>>> 7fa3e3fde45440581323e3537284e524e30f1d9e
			},
			userTableData () {
				let op = []
				Object.keys(this.user_data).forEach(u => {
					if(this.selected_state === this.user_data[u][0].state || this.selected_state === 'All'){
						op.push({
							id: u,
							name: this.user_data[u][0].user_name,
							observations: this.user_data[u].length,
							state: this.user_data[u][0].state
						})						
					}
				})

				op.sort((a,b) => (a.observations < b.observations) ? 1 : ((b.observations < a.observations) ? -1 : 0))
				return op
			},
			dateTableData () {
				let op = []
				let date_data = {}

				this.filteredObservations.reverse().forEach(o => {
					if(Object.keys(date_data).indexOf(o.inat_created_at) != -1){
						date_data[o.inat_created_at].push(o)
					} else {
						date_data[o.inat_created_at] = [o]
					}
				})

				Object.keys(date_data).forEach(d => {
					op.push({
						name: d,
						value: date_data[d].length
					})
				})
				// op = this.date_data.map((d, k) => {return {name: k, value: d.length}})
				
				return op;
			},
			stateObservations () {
				let op = []
				if(this.selected_state != ''){
					this.inat_data.forEach(o => {
						if(o.state == this.selected_state){
							op.push(o)
						}
					})
				}
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
				
				return op
			},
			statesTableData () {
				let op = []
				Object.keys(this.stats).forEach(s => {
					if(s != 'All'){
						op.push({
							state: s,
							observations: this.stats[s].observations,
							users: this.stats[s].users.size,
							species: this.stats[s].species.size
						})
					}
				})
				op.sort((a,b) => (a.observations < b.observations) ? 1 : ((b.observations < a.observations) ? -1 : 0))
				return op
			},
<<<<<<< HEAD
=======
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
			}
>>>>>>> 7fa3e3fde45440581323e3537284e524e30f1d9e
		},
		methods: {
			onAccordionOpen(id) {
				Object.keys(this.accordions).forEach(key => {
					this.accordions[key] = key == id; // eslint-disable-line eqeqeq
				});
			},
			onAccordionClose(key) {
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
			userTableRowClass (id, u) {
				let op = ""
				if(this.selected_users.indexOf(u.id) !== -1){
					op = "user-selected"
				} else {
					if(id < 10){
						op = "first-10"
					} else if (id < 50){
						op = "second-50"
					} else if (id < 100) {
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
				let op = d.split("-")
				op = `${op[0]} Sept, 21`
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
				let height = this.svgHeight/2
				let width = this.svgWidth/0.9
				let color = "steelblue"
				let margin = ({top: 30, right: 0, bottom: 30, left: 40})

				if (!d3.select("#date-chart-continer svg").empty()) {
					d3.selectAll("#date-chart-continer svg").remove()
				}

				let svg = d3.select("#date-chart-continer").append("svg")
  					.attr("viewBox", [0, 0, width, height]);

  				let x = d3.scaleBand()
  							.domain(d3.range(this.dateTableData.length))
  							.range([margin.left, width - margin.right])
  							.padding(0.1)
  				let y = d3.scaleLinear()
							.domain([0, d3.max(this.dateTableData, d => d.value)]).nice()
							.range([height - margin.bottom, margin.top])
				let xAxis = g => g
						.attr("transform", `translate(0,${height -  margin.bottom})`)
						.classed("x-ticks", true)
						.call(d3.axisBottom(x)
							.tickFormat(i => this.dateTableData[i].name)
							.tickSizeOuter(0))
				let yAxis = g => g
					    .attr("transform", `translate(${margin.left},0)`)
					    .call(d3.axisLeft(y).ticks(null, this.dateTableData.format))
					    .call(g => g.select(".domain").remove())
					    .call(g => g.append("text")
					        .attr("x", -margin.left)
					        .attr("y", 10)
					        .attr("fill", "currentColor")
					        .attr("text-anchor", "start")
					        .text(this.dateTableData.y))
				const yGrid = d3.axisLeft()
								.scale(y)
								.tickFormat('')
								.ticks(5)
								.tickSizeInner(-width + margin.left + margin.right)
				
				let that = this
  				svg.append("g")
  					.classed('chart-bars', true)
  					.selectAll("rect")
  					.data(this.dateTableData)
  					.join("rect")
  					.attr("x", (d, i) => x(i))
  					.attr("y", d => y(0))
  					.attr("fill", d => (this.selected_dates.indexOf(d.name) !== -1)?"green":"#6574cd")
  					.attr("height", d => y(0) - y(d.value))
  					.attr("width", x.bandwidth())
  					.on('mouseover', function (d, i) {
  						that.tooltip.html(`<div>Date: ${d.name}</div><div>Observations: ${d.value}</div>`)
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
  					.on("click", d => this.selectDate(d))

  				svg.append('g')
					.attr('class', 'y-grid')
					.attr('transform', 'translate(' + margin.left + ', 0)')
					.call(yGrid)

				svg.selectAll("rect")
  					.transition()
  					.duration(400)
  					.attr("y", function(d) { return y(d.value); })
  					.attr("height", function(d) { return y(0) - y(d.value); })
  					.delay(function(d,i){return(i*30)})


  				svg.append("g")
  					.call(xAxis);

  				svg.append("g")
  					.call(yAxis);
			},
			selectDate (d) {
				var index = this.selected_dates.indexOf(d.name);
				if (index !== -1) {
					this.selected_dates.splice(index, 1);
				} else {
					this.selected_dates.push(d.name)
				}
				this.renderDateChart()
			},
			renderMap () {
				let that = this
				let height = this.svgHeight
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

				var projection = d3.geoMercator().scale(750).center([89, 29.5])
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
	  							<tr><td>Observations</td><td>${that.stats[s_name].observations}</td></tr>
	  							<tr><td>Users</td><td>${that.stats[s_name].users.size}</td></tr>
	  							<tr><td>Unique Taxa</td><td>${that.stats[s_name].species.size}</td></tr>
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

					if(this.state_data[s_name] == undefined){
						current_state.attr("fill", (d) => colors(-1))
					} else {
						current_state.attr("fill", (d) => colors(this.state_data[s_name].length))
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

				clicked({properties:{ST_NM: 'All'}})
				mapPoints()

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
							map_points.on("click", (d) => that.setMissingState(d))
					}
				}
			},
			selectState (s) {
				if (this.selected_state == s) {
					this.selected_state = 'All'
				} else {
					this.selected_state = s					
				}
				// this.renderMap()
			},
			renderTaxonomyChart () {
				let height = this.svgHeight
				let width = this.svgWidth
				let margin = 40
				let data = this.taxa_table_data
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
			selectTaxaLevel (tname) {
				let levels = ["superfamily", "family", "subfamily", "tribe", "subtribe", "genus", "subgenus", "species", "subspecies", "form"]
				var index = levels.indexOf(tname)
				this.selected_taxa_levels = levels.filter((l,lid) => lid <= index)
			},
			taxaLevelBtnClass (tname) {
				let op = "default"
				let levels = ["superfamily", "family", "subfamily", "tribe", "subtribe", "genus", "subgenus", "species", "subspecies", "form"]
				// if (this.selected_taxa_levels.indexOf(tname)) {

				// }
				if (this.selected_taxa_levels.indexOf(tname) != -1) {
					// console.log("select-" + tname, this.selected_taxa_levels)
						op = "primary"

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
				this.stats['All'] = {
						observations: 0,
						users: new Set(),
						species: new Set()
					}
				country.features.forEach(s => {
					this.state_data[s.properties.ST_NM] = [];
					this.stats[s.properties.ST_NM] = {
						observations: 0,
						users: new Set(),
						species: new Set()
					}
				})
				this.inat_data.forEach(o => {
					this.stats['All'].observations++
					this.stats['All'].users.add(o.user_id)
					this.stats['All'].species.add(o.taxa_name)
					if(Object.keys(this.user_data).indexOf(o.user_id) != -1){
						this.user_data[o.user_id].push(o)
					} else {
						this.$set(this.user_data,o.user_id,[o])
					}

					if(Object.keys(this.date_data).indexOf(o.inat_created_at) != -1){
						this.date_data[o.inat_created_at].push(o)
					} else {
						this.$set(this.date_data,o.inat_created_at,[o])
					}

					if(o.state == null){
						this.state_unmatched.push(o);
					} else if(Object.keys(this.state_data).indexOf(o.state) != -1){
						this.state_data[o.state].push(o)
						this.stats[o.state].observations++
						this.stats[o.state].users.add(o.user_id)
						this.stats[o.state].species.add(o.taxa_name)
					} else {
						this.$set(this.state_data,o.state,[o])
						console.log("strange state name", o.state, o)
					}

					if(Object.keys(this.taxa_level).indexOf(o.taxa_rank) != -1){
						this.taxa_level[o.taxa_rank].push(o)
					} else {
						this.$set(this.taxa_level,o.taxa_rank,[o])
					}
				});

				Object.keys(this.state_data).forEach(s => {
					if(this.state_data[s].length > this.state_max)
						this.state_max = this.state_data[s].length;
				})
<<<<<<< HEAD

				this.taxa_table_data = {superfamily:0, family:0, subfamily:0, tribe:0, subtribe:0, genus:0, subgenus:0, species:0, subspecies:0, form:0}
				Object.keys(this.taxa_level).forEach(tl => {
					this.taxa_table_data[tl] = this.taxa_level[tl].length
=======
				this.date_table_data = []
				Object.keys(this.date_data).forEach(d => {
					this.date_table_data.push({
						name: d,
						value: this.date_data[d].length
					})
>>>>>>> 7fa3e3fde45440581323e3537284e524e30f1d9e
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
