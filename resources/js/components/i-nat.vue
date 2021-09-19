<style scoped>
*,
*::before,
*::after {
    box-sizing: border-box;
}

html {
    font-size: 100%;
}

.species-table tbody tr.hover-row:hover{
	background: #ff9;
	cursor: pointer;
}
.overflow-div{
	max-height: 80vh;
	overflow: scroll;
}

</style>
<template>
	<div class="container-fluid p-2 mt-5">
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
				class="overflow-div"
			>
				<div v-if="tab.title=='Users'">
					<table class="table table-sm">
						<thead>
							<tr>
								<th>User ID</th>
								<th>User Name</th>
								<th>Observations</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="(u_data, u_id) in user_data">
								<td v-text="u_id"></td>
								<td v-text="u_data[0].user_name"></td>
								<td v-text="u_data.length"></td>								
							</tr>
						</tbody>
						
					</table>
				</div>
				<div v-if="tab.title=='Date'">
					<table class="table table-sm">
						<thead>
							<tr>
								<th>Date</th>
								<th>Observations</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="(d_data, d_id) in date_data">
								<td v-text="d_id"></td>
								<td v-text="d_data.length"></td>
							</tr>
						</tbody>
						
					</table>
				</div>
				<div v-if="tab.title=='Location'">
					{{selected_state}}
					<div id="map-container" class="svg-container"></div>
				</div>
				<div v-if="tab.title=='Taxonomy'">
					<ui-tabs
						:fullwidth="true"
						:raised="true"
						type="text"
						@tab-change="tabChanged"
					>
						<ui-tab
							:key="t_level"
							:selected="t_level === ''"
							:title="`${t_level} (${taxa_level[t_level].length})`"
							v-for="t_level in taxa_levels_sequence"
							v-if="Object.keys(taxa_level).indexOf(t_level) != -1"
						>
							<table class="table table-sm species-table">
								<thead>
									<tr>
										<th>Sl. No.</th>
										<th>Taxa</th>
										<th>No of Observations</th>
									</tr>
								</thead>
								<tbody>
									<template v-for="(o, t_name) in taxaFilteredObservations">
										<tr class='hover-row' @click="taxaClick(t_name)">
											<td v-text="Object.keys(taxaFilteredObservations).indexOf(t_name)+1"></td>
											<td v-text="t_name"></td>
											<td v-text="o.length"></td>
										</tr>
										<!--  -->
										<tr v-if="selected_taxa == t_name">
											<td colspan="3">
												<div class="d-flex justify-content-between">
													<img v-for="p in o" :src="imgUrl(p.img_url)" @click="gotoObservation(p)">
												</div>
											</td>
											
										</tr>
										
									</template>
								</tbody>
							</table>
						</ui-tab>
					</ui-tabs>

				</div>
			</ui-tab>
		</ui-tabs>
	</div>
</template>

<script>
import axios from 'axios';
import * as d3 from "d3"
import * as d3Legend from "d3-svg-legend"
import country from '../country.json'
	export default {
		name:"i-nat",
		props: ["inat_data", "inat_taxa"],
		data() {
			return{
				user_data:{},
				date_data:{},
				state_data:{},
				state_unmatched:[],
				selected_state:"",
				state_max:0,
				species:{},
				taxa_level:{},
				tabs:[
					{title:"Users"},
					{title:"Date"},
					{title:"Location"},
					{title:"Taxonomy"},
				],
				taxa_levels_sequence: ['superfamily','family','subfamily','tribe','subtribe','genus','subgenus','species','subspecies','form'],
				taxaFilteredObservations:{},
				selected_taxa:'',
				svg:null,
				svgWidth:0,
				svgHeight:0,
			}
		},
		created() {
		},
		mounted() {
			this.init();
			this.initMap();
		},
		computed:{
		},
		methods: {
			imgUrl(url){
				// return url.replace("square", "medium")
				return url
			},
			taxaClick(t){
				if(this.selected_taxa != t)
					this.selected_taxa = t
				else 
					this.selected_taxa = '';
			},
			gotoObservation(o){
				let url = 'https://www.inaturalist.org/observations/' + o.id;
				window.open(url, '_blank').focus();
			},
			tabChanged(x){
				let rank_text = x.title.split(" ");

				let rank = this.taxa_levels_sequence.indexOf(rank_text[0]);
				this.taxaFilteredObservations = {};
				this.inat_data.forEach(o => {
					if(this.taxa_levels_sequence.indexOf(o.taxa_rank) == rank)
						if(Object.keys(this.taxaFilteredObservations).indexOf(o.taxa_name) != -1){
							this.taxaFilteredObservations[o.taxa_name].push(o)
						} else {
							this.$set(this.taxaFilteredObservations, o.taxa_name, [o])
						}
				});
			},
			initMap(){
				this.svgWidth = window.innerWidth * 0.75;
				this.svgHeight = window.innerHeight * 0.75;

				this.renderMap();
			},
			renderMap() {
				if (!d3.select("#map-container svg").empty()) {
					d3.selectAll("svg").remove()
				}
				this.svg = d3.select("#map-container").append("svg").attr("preserveAspectRatio", "xMinYMin meet")
					.attr("width", this.svgWidth)
					.attr("height", this.svgHeight)
					.style("background-color", "rgb(190, 229, 235)")
					.classed("svg-content d-flex m-auto", true)

				var projection = d3.geoMercator().scale(750).center([89, 29.5])
				const path = d3.geoPath().projection(projection)
				const colors = d3.scaleLinear().domain([0, 1, this.state_max]).range(["#f77", "#6a8", "#7f9"])
				var legend = d3Legend.legendColor().scale(colors).shapeWidth(55).labelFormat(d3.format(".0f")).orient('horizontal').cells(6)
				let base = this.svg.append("g")
					.classed("map-boundary", true)

				let base_text = base.selectAll("text").append("g")
				base = base.selectAll("path").append("g")

				country.features.forEach(state=> {
					let s_name = state.properties.ST_NM

					let shape = base.append("g")
						.data([state])
						.enter().append("path")
						.attr("d", path)
						.attr("stroke", "#333")
						.attr("id", s_name)
						.attr("title", s_name)
						.attr("stroke-width", .5)
						.on("click", (d) => this.select_state(s_name));

					if(this.state_data[s_name] == undefined){
						shape.attr("fill", (d) => colors(-1))
					} else {
						shape.attr("fill", (d) => colors(this.state_data[s_name].length))
					}
				})

				let points = [];
				if(this.selected_state == ''){
					this.state_unmatched.forEach(o => {
						let coords = o.location.split(",")
						points.push([coords[1], coords[0], o.id, o.place_guess]);
					})
				}
				if(this.selected_state != ''){
					this.state_data[this.selected_state].forEach(o => {
						let coords = o.location.split(",")
						points.push([coords[1], coords[0], o.id, o.place_guess]);
					})
				}
				if(points.length > 0){
					this.svg.selectAll("circle")
						.data(points).enter()
						.append("circle")
						.attr("cx", (d) => projection(d)[0])
						.attr("cy", (d) => projection(d)[1])
						.attr("r", "5px")
						.attr("stroke", "red")
						.attr("fill", "white")
						.on("click", (d) => alert(d[2] + " - " + d[3]))
				}

				let that = this;
				let zoom = d3.zoom()
					.scaleExtent([.5, 7.5])
					.translateExtent([[-that.svgWidth,-that.svgHeight],[2 * that.svgWidth,2 * that.svgHeight]])
					.on('zoom', function() {
						that.svg.selectAll('.poly_text')
							.attr('transform', d3.event.transform),
						that.svg.selectAll('path')
							.attr('transform', d3.event.transform),
						that.svg.selectAll('circle')
							.attr('transform', d3.event.transform)
							.attr("r", 5 / d3.event.transform.k);
					});
				this.svg.call(zoom);
			},
			select_state(s){
				if(this.selected_state == s){
					this.selected_state = ""
				} else {
					this.selected_state = s;
				}
				this.renderMap();
			},
			init(){
				country.features.forEach(s => {
					this.state_data[s.properties.ST_NM] = [];
				})
				this.inat_data.forEach(o => {
					let date = o.inat_created_at.split("T");
					
					if(Object.keys(this.user_data).indexOf(o.user_id) != -1){
						this.user_data[o.user_id].push(o)
					} else {
						this.$set(this.user_data,o.user_id,[o])
					}

					if(Object.keys(this.date_data).indexOf(date[0]) != -1){
						this.date_data[date[0]].push(o)
					} else {
						this.$set(this.date_data,date[0],[o])
					}

					if(o.state == null){
						this.state_unmatched.push(o);
					} else if(Object.keys(this.state_data).indexOf(o.state) != -1){
						this.state_data[o.state].push(o)
					} else {
						this.$set(this.state_data,o.state,[o])
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
				this.tabChanged({title:"superfamily "});
			}
		}
	};
</script>
