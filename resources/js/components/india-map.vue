<style>
	#map-container .state-selected{
		/*fill: #afa;*/
		fill: #ff5;
		stroke: rgba(255,50,0,.5);
		stroke-width:.5px;
	}
	.poly_text{
		fill: #545;
		font-size: 0.5vw;
		transition: fill,text-shadow .125s;
	}
	.poly_text:hover{
		fill: #00c;
		text-shadow: 0px 0px 5px #fff;
		cursor: pointer;
		font-weight: 1000;
	}
	@media screen and (max-width: 800px) {
		.poly_text{
			font-size: 3.5vw;
		}
	}

</style>

<template>
	<div>
		<div id="map-container"></div>
	</div>
</template>

<script>
import * as d3Legend from "d3-svg-legend"
import country from '../country.json'
export default {
	name:"india-map",
	props: ["map_data", "selected_state", "popup", "stateStats", "selected_region"],
	data() {
		return{
			states: null,
			path: null,
			svg: {},
			projection: {},
			colors: {},
			legend: {},

			state_data: {},
			selected:"All",
			state_max: 0,
			height: 600 ,
			width: 800,
			tooltip:this.popup,
			map_first_render:true,
			region_colors: {
				north: "#f8df81",
				south: "#badfda",
				west: "#f6aa90",
				east: "#d5b6d5"
			}
		}
	},
	mounted(){
		this.init()
		this.regionalStats()
		// this.clicked(this.selectedGeoJson)
		// this.map_first_render = false
		// alert(`${this.width} x ${this.height}`)
	},
	computed:{
		stateData () {
			let op = {}

			country.features.forEach(s => {
				op[s.properties.ST_NM] = [];
			})
			this.map_data.forEach(o => {
				if(o.state !== null){
					op[o.state].push(o)
				}
			})
			return op
		},
		selectedGeoJson () {
			let op = {properties:{ST_NM: 'All'}}
			if (this.selected !== 'All') {
				Object.keys(country.features).forEach(c => {
					if (country.features[c].properties.ST_NM === this.selected) {
						op = country.features[c]
					}
				})
			}
			return op
		},
		zoom() {
			let that = this
			return d3.zoom()
					.scaleExtent([.5, 50])
					.translateExtent([[-0.5 * this.width,-0.75 * this.height],[2.5 * this.width, 2.5 * this.height]])
					.on('zoom', function() {

						that.svg.selectAll('.poly_text')
							.attr('transform', d3.event.transform),
						that.svg.selectAll('path')
							.attr('transform', d3.event.transform),
						that.svg.selectAll('circle')
							.attr('transform', d3.event.transform)
						.attr("r", 2 / d3.event.transform.k)
					})
		},
	},
	watch: {
		map_data () {
			this.init()

		},
		selected_state (newVal, oldVal) {
			if (!d3.select("#map-container .map-points").empty()) {
				d3.selectAll(".map-points").remove()
			}

			this.init()
		}
	},
	methods:{
		regionalStats(){
			let region_states = {}
			let regions = [...new Set(country.features.map((s) => s.properties.region))]
			let region_stats = {}
			regions.map((r) => {
				region_stats[r] = {
					region: r,
					observations: []
				}
			})
			// Total observations, total users, total unique taxa with counts

			country.features.forEach((s) => {
				if(region_states[s.properties.region] == undefined){
					region_states[s.properties.region] = []
				}
				region_states[s.properties.region].push(s.properties.ST_NM)
			})
			
			this.map_data.forEach((o) => {
				let region = Object.keys(region_states).filter((rs) => region_states[rs].indexOf(o.state) != -1)[0]
				region_stats[region].observations.push(o)
			})
			
			regions.map((r) => {
				region_stats[r].users = [...new Set(region_stats[r].observations.map((o) => o.user_id))]
				region_stats[r].user_counts = region_stats[r].users.map((u) => {
					return {
						name: u,
						count: region_stats[r].observations.filter((o) => o.user_id == u).length
					}
				})
				region_stats[r].user_counts.sort((a,b) => b.count - a.count)
				region_stats[r].taxa = [...new Set(region_stats[r].observations.map((o) => o.taxa_name))]
				region_stats[r].taxa_counts = region_stats[r].taxa.map((t) => {
					return {
						name: t,
						count: region_stats[r].observations.filter((o) => o.taxa_name == t).length
					}
				})
				region_stats[r].taxa_counts.sort((a,b) => b.count - a.count)
				
			})
			console.table(region_stats)
			let x = regions.map((r) => {
				return {
					name: r,
					observations: region_stats[r].observations.length,
					users: region_stats[r].users.length,
					taxa: region_stats[r].taxa.length,
					top_taxa: region_stats[r].taxa_counts.slice(0,5).map((t) => `${t.name} (${t.count})`).join(", "),
					top_users: region_stats[r].user_counts.slice(0,5).map((u) => `${u.name} (${u.count})`).join(", "),
				}
			})
			console.log(x.map((r) => [r.name, r.top_users]))
		},
		init () {
			this.map_first_render = true
			this.states = null
			this.path = null
			this.svg = {}
			this.projection = {}
			this.colors = {}
			this.legend = {}


			this.state_data = {}
			this.state_max = 0
			this.height = window.innerHeight * 0.85
			this.width = window.innerWidth * 0.5
			if(window.innerWidth < 800){
				this.height = window.innerHeight * 0.5
				this.width = window.innerWidth * 0.9
			}
			country.features.forEach(s => {
				this.state_data[s.properties.ST_NM] = [];
			})

			this.map_data.forEach(o => {
				if(Object.keys(this.state_data).indexOf(o.state) != -1){
					this.state_data[o.state].push(o)
				} else {
					console.log("unmatched state name", o.state, o)
				}
			});

			Object.keys(this.state_data).forEach(s => {
				if(this.state_data[s].length > this.state_max)
				this.state_max = this.state_data[s].length;
			})
			this.colors = d3.scaleLinear()
				.domain([0, 1, this.state_max*.25, this.state_max])
				.range(["#f77", "#ca0", "#ada", "#3d3"])

			this.legend = d3Legend.legendColor()
								.shapeWidth(45)
								.scale(this.colors)
								.labelFormat(d3.format(".0f"))
								.orient('horizontal')
								.labelOffset(-10)
								.labelAlign("start")
								.cells(6)
								// .shapePadding(47)

			this.renderMap()
			this.clicked(this.selectedGeoJson)
			this.map_first_render = false
		},
		renderMap () {
			this.selected = this.selected_state

			if (!d3.select("#map-container svg").empty()) {
				d3.selectAll("#map-container svg").remove()
			}
			this.svg = d3.select("#map-container")
						.append("svg")
							.attr("preserveAspectRatio", "xMinYMin meet")
							.attr("width", this.width)
							.attr("height", this.height)
							// .style("background-color", "rgb(190, 229, 235)")
							.classed("svg-content d-flex m-auto", true)

			this.projection = d3.geoMercator().scale(850).center([87, 25.5])
			this.path = d3.geoPath().projection(this.projection)


			if(this.height > this.width){
				this.legend.shapeWidth(35)
				.cells(4)
				// .shapePadding(37)
			}


			let base = this.svg.append("g")
			.classed("map-boundary", true)

			let base_text = base.selectAll("text").append("g")
			base = base.selectAll("path").append("g")
			this.states = base.append("g").classed("states", true)
			let that = this

			country.features.forEach(state=> {
				let s_name = state.properties.ST_NM
				let region = state.properties.region
				let that = this

				let current_state = this.states.append("g")
				.data([state])
				.enter().append("path")
				.attr("d", this.path)
				.attr("id", this.stateID(s_name))
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
				.on("click", this.clicked)


				// if(this.stateData[s_name] == undefined){
				// 	current_state.attr("fill", (d) => colors(-1))
				// } else if (s_name == this.selected) {
				// 	current_state.classed("state-selected", true)
				// } else {
				// 	current_state.attr("fill", (d) => this.colors(this.stateData[s_name].length))
				// }

				current_state.attr("fill", (d) => this.region_colors[region])
			})
			if(this.selected == "All"){
				country.features.forEach(state=> {
					let s_name = state.properties.ST_NM
					let label = base_text.append("g")
						.data([state])
						.enter().append("text")
						.classed("poly_text", true)
						.attr("x", (h) => this.path.centroid(h)[0] )
						.attr("y", (h) => this.path.centroid(h)[1] )
						.attr("text-anchor", "middle")
						.text(this.stateData[s_name].length)
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
						.on("click", this.clicked)
				})
			}

			this.svg.append("g")
				.attr("transform", "translate("+this.width*.5+", 50)")
				.call(this.legend)
				// .append("text")
				// .classed("map_label", true)
				// .attr("dx", 5)
				// .attr("dy", -10)
				// .classed("h1", true)
				// .text(this.selected)

			this.svg.call(this.zoom)
			this.mapPoints()

			// if(this.map_first_render){
			// 	this.clicked(this.selectedGeoJson)
			// 	this.map_first_render = false

			// }
		},
		stateID(s){
			return s.replaceAll(" ", "_").replaceAll("&", "")
		},
		clicked(d) {
			this.tooltip.html(``).style('visibility', 'hidden')
			let state = d.properties.ST_NM

			if(state == this.selected && state != 'All')
				if (!d3.select("#map-container .poly_text").empty()) {
					d3.selectAll("#map-container .poly_text").remove()
				}
			let [[x0, y0], [x1, y1]] = [[0,0],[0,0]]

			this.states.transition().style("fill", null)

			if(d3.select(".state-selected")["_groups"][0][0] != null){
				d3.select("#" + d3.select(".state-selected")["_groups"][0][0].id).attr("class", null)

			}

			if(this.map_first_render){
				if(state == "All"){
					[[x0, y0], [x1, y1]] = this.path.bounds(country)
				} else {
					[[x0, y0], [x1, y1]] = this.path.bounds(d)
					d3.select("#" + this.stateID(state)).classed("state-selected", true)
				}
			} else {
				if(this.selected == state){
					[[x0, y0], [x1, y1]] = this.path.bounds(country)
				} else {
					[[x0, y0], [x1, y1]] = this.path.bounds(d)
					d3.select("#" + this.stateID(state)).classed("state-selected", true)
				}
				if(this.selected == state){
					this.$emit('stateSelected', 'All')
				} else {
					this.$emit('stateSelected', state)
				}
			}

			this.svg.transition().duration(750).call(
				this.zoom.transform,
				d3.zoomIdentity
				.translate(this.width / 2, this.height / 2)
				.scale(Math.min(8, 0.9 / Math.max((x1 - x0) / this.width, (y1 - y0) / this.height)))
				.translate(-(x0 + x1) / 2, -(y0 + y1) / 2),
			)
			/*
			*/
		},
		mapPoints(){
			let points = []

			if(this.selected != 'All'){
				this.state_data[this.selected].forEach(o => {
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
				.attr("cx", (d) => this.projection(d)[0])
				.attr("cy", (d) => this.projection(d)[1])
				.attr("r", "0px")

				// map_points.on("click", (d) => that.setMissingState(d))
			}
		},
	}
};
</script>