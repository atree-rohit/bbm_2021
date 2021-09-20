<style>
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
#date-chart-continer svg g rect,
.map-boundary path,
.map-points circle,
.doughnut-chart path
{
	transition: fill .5s;
}
#date-chart-continer svg g rect:hover {
  fill: orangered;
  cursor: pointer;
  background: orangered;
}
.y-grid .tick line{
	stroke: #ccc;
}
.map-boundary path:hover{
	cursor: pointer;
	fill: #ffa;
}
.doughnut-chart path:hover,
.map-points circle:hover{
	cursor: pointer;
	stroke: yellow;
	fill: red;
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
								<th>State</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="(u, id) in userTableData" :class='userTableRowClass(id)'>
								<td v-text="u.id"></td>
								<td v-text="u.name"></td>
								<td v-text="u.observations"></td>
								<td v-text="u.state"></td>
							</tr>
						</tbody>
						
					</table>
				</div>
				<div v-if="tab.title=='Date'">
					<div id="date-chart-continer" class="svg-container"></div>
				</div>
				<div v-if="tab.title=='Location'">
					{{selected_state}}
					<div id="map-container" class="svg-container"></div>
				</div>
				<div v-if="tab.title=='Taxonomy'">
					<div id="taxonomy-chart-continer" class="svg-container"></div>
				</div>
			</ui-tab>
		</ui-tabs>
		<ui-modal ref="update-state-Modal" title="Set / Update Observation State">
				{{selected_point}}
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
		props: ["inat_data", "inat_taxa"],
		data() {
			return{
				user_data:{},
				date_data:{},
				date_table_data:[],
				state_data:{},
				state_unmatched:[],
				selected_state:"",
				selected_point: null,
				state_max:0,
				species:{},
				taxa_level:{},
				taxa_table_data:{},
				tabs:[
					{title:"Users"},
					{title:"Date"},
					{title:"Location"},
					{title:"Taxonomy"},
				],
				taxa_levels_sequence: ['superfamily','family','subfamily','tribe','subtribe','genus','subgenus','species','subspecies','form'],
				taxaFilteredObservations:{},
				selected_taxa: '',
				svg: null,
				svgWidth: 0,
				svgHeight: 0,
				tooltip: null,
				stats:{}
			}
		},
		created() {
		},
		mounted() {
			this.init()
			this.initMap()
			this.renderDateChart()
			this.renderTaxonomyChart()
		},
		computed:{
			userTableData () {
				let op = []
				Object.keys(this.user_data).forEach(u => {
					op.push({
						id: u,
						name: this.user_data[u][0].user_name,
						observations: this.user_data[u].length,
						state: this.user_data[u][0].state
					})
				})

				op.sort((a,b) => (a.observations < b.observations) ? 1 : ((b.observations < a.observations) ? -1 : 0))
				return op
			}
		},
		methods: {
			userTableRowClass(id){
				let op = ""
				if(id < 10){
					op = "table-success"
				} else if (id < 50){
					op = "table-warning"
				} else if (id < 100) {
					op = "table-info"
				}
				return op;
			},
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
			renderDateChart(){
				let height = this.svgHeight / 1.75
				let width = this.svgWidth
				let color = "steelblue"
				let margin = ({top: 30, right: 0, bottom: 30, left: 40})
				let svg = d3.select("#date-chart-continer").append("svg")
  					.attr("viewBox", [0, 0, width, height]);

  				let x = d3.scaleBand()
  							.domain(d3.range(this.date_table_data.length))
  							.range([margin.left, width - margin.right])
  							.padding(0.1)
  				let y = d3.scaleLinear()
							.domain([0, d3.max(this.date_table_data, d => d.value)]).nice()
							.range([height - margin.bottom, margin.top])
				let xAxis = g => g
						.attr("transform", `translate(0,${height - margin.bottom})`)
						.call(d3.axisBottom(x)
							.tickFormat(i => this.date_table_data[i].name)
							.tickSizeOuter(0))
				let yAxis = g => g
					    .attr("transform", `translate(${margin.left},0)`)
					    .call(d3.axisLeft(y).ticks(null, this.date_table_data.format))
					    .call(g => g.select(".domain").remove())
					    .call(g => g.append("text")
					        .attr("x", -margin.left)
					        .attr("y", 10)
					        .attr("fill", "currentColor")
					        .attr("text-anchor", "start")
					        .text(this.date_table_data.y))
				const yGrid = d3.axisLeft()
								.scale(y)
								.tickFormat('')
								.ticks(5)
								.tickSizeInner(-width + margin.left + margin.right)
				
				let that = this
  				svg.append("g")
  					.classed('chart-bars', true)
  					.selectAll("rect")
  					.data(this.date_table_data)
  					.join("rect")
  					.attr("x", (d, i) => x(i))
  					.attr("y", d => y(0))
  					.attr("fill", "#6574cd")
  					.attr("height", d => y(0) - y(d.value))
  					.attr("width", x.bandwidth())
  					.on('mouseover', function (d, i) {
  						that.tooltip.html(`<div>Date: ${d.name}</div><div>Observations: ${d.value}</div>`)
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
					.attr('class', 'y-grid')
					.attr('transform', 'translate(' + margin.left + ', 0)')
					.call(yGrid)

				svg.selectAll("rect")
  					.transition()
  					.duration(400)
  					.attr("y", function(d) { return y(d.value); })
  					.attr("height", function(d) { return y(0) - y(d.value); })
  					.delay(function(d,i){console.log(i) ; return(i*30)})


  				svg.append("g")
  					.call(xAxis);

  				svg.append("g")
  					.call(yAxis);
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
					let that = this

					let shape = base.append("g")
						.data([state])
						.enter().append("path")
						.attr("d", path)
						.attr("stroke", "#333")
						.attr("id", s_name)
						.attr("title", s_name)
						.attr("stroke-width", .5)
						.on("click", (d) => this.select_state(s_name))
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
	  					.on('mouseout', function () {
	  						that.tooltip.html(``).style('visibility', 'hidden');
	  					});
						;

					if(this.state_data[s_name] == undefined){
						shape.attr("fill", (d) => colors(-1))
					} else if (this.selected_state === s_name) {
						shape.attr("fill", "yellow")
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
					let map_points = this.svg.append('g')
						.classed('map-points', true)
						.selectAll("circle")
						.data(points).enter()
						.append("circle")
						.attr("cx", (d) => projection(d)[0])
						.attr("cy", (d) => projection(d)[1])
						.attr("r", "5px")
						.attr("stroke", "red")
						.attr("fill", "white")
						// .on("click", (d) => alert(d[2] + " - " + d[3]))
						map_points.on("click", (d) => this.setMissingState(d))
					// if(this.selected_state == '')
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
			renderTaxonomyChart(){
				let height = this.svgHeight / 1.75
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
			setMissingState (p) {
				console.log(p)
				this.inat_data.forEach(o =>{
					if(o.id = p[2])
						this.selected_point = o
				})
				this.openModal('update-state-Modal')
			},
			select_state(s){
				if(this.selected_state == s){
					this.selected_state = ""
				} else {
					this.selected_state = s;
				}
				this.renderMap();
			},
			openModal(ref) {
				this.$refs[ref].open();
			},
			init(){
				country.features.forEach(s => {
					this.state_data[s.properties.ST_NM] = [];
					this.stats[s.properties.ST_NM] = {
						observations: 0,
						users: new Set(),
						species: new Set()
					}
				})
				this.inat_data.forEach(o => {
					
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
				this.date_table_data = []
				Object.keys(this.date_data).forEach(d => {
					this.date_table_data.push({
						name: d,
						value: this.date_data[d].length
					})
				})
				this.taxa_table_data = {}
				Object.keys(this.taxa_level).forEach(tl => {
					this.taxa_table_data[tl] = Math.log(this.taxa_level[tl].length)
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
				this.tabChanged({title:"superfamily "});
			}
		}
	};
</script>
