<style>
	#map-container .selected{
		fill: #afa;
		stroke: rgba(10,100,10,.75);
		stroke-width:.5px;
	}

</style>

<template>
	<div id="map-container"></div>
</template>

<script>
import country from '../country.json'
export default {
	name:"india-map",
	props: ["map_data", "selected_state", "height", "width", "popup", "stateStats"],
	data() {
		return{
			state_data: {},
			state_max: 0,
			tooltip:this.popup,
			map_first_render:true,
		}
	},
	mounted(){
		this.init()
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
			if (this.selected_state !== 'All') {
				Object.keys(country.features).forEach(c => {
					if (country.features[c].properties.ST_NM === this.selected_state) {
						op = country.features[c]
					}
				})
			}
			return op
		}
	},
	watch: {
		map_data () {
			this.init()
			// this.renderMap()
		},
	},
	methods:{
		init () {
			this.map_first_render = true
			country.features.forEach(s => {
				this.state_data[s.properties.ST_NM] = [];
			})

			this.map_data.forEach(o => {
				if(Object.keys(this.state_data).indexOf(o.state) != -1){
					this.state_data[o.state].push(o)
				} else {
					// console.log("unmatched state name", o.state, o)
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

			this.renderMap()
		},
		renderMap () {
			let that = this
			let height = this.height
			let width = this.width
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
					} else if (s_name == this.selected_state) {
						current_state.classed("selected", true)
					} else {
						current_state.attr("fill", (d) => colors(this.stateData[s_name].length))
					}
			})

			let zoom = d3.zoom()
			.scaleExtent([.1, 50])
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

			if(this.map_first_render){
				// console.log(this.selected_state)
				map_init(this.selectedGeoJson)
				this.map_first_render = false
				mapPoints()
			}
			function map_init(d) {
				let state = d.properties.ST_NM
				let [[x0, y0], [x1, y1]] = [[0,0],[0,0]]
				states.transition().style("fill", null);
				if(that.selected_state != 'All'){
					d3.select("#" + that.selected_state.replaceAll(" ", "_").replaceAll("&", "")).transition().style("fill", null);
				}
				if(that.selected_state == 'All'){
					[[x0, y0], [x1, y1]] = path.bounds(country)
				} else {
					[[x0, y0], [x1, y1]] = path.bounds(d)
					d3.select(this).transition().style("fill", "gold")
				}

				svg.transition().duration(751).call(
					zoom.transform,
					d3.zoomIdentity
					.translate(width / 2, height / 2)
					.scale(Math.min(8, 0.9 / Math.max((x1 - x0) / width, (y1 - y0) / height)))
					.translate(-(x0 + x1) / 2, -(y0 + y1) / 2),
				);
			}

			function clicked(d) {
				that.tooltip.html(``).style('visibility', 'hidden')
				let state = d.properties.ST_NM
				let [[x0, y0], [x1, y1]] = [[0,0],[0,0]]
				states.transition().style("fill", null);
				if(that.selected_state != 'All'){
					d3.select("#" + that.selected_state.replaceAll(" ", "_").replaceAll("&", "")).transition().style("fill", null);
				}
				if(that.selected_state == state){
					[[x0, y0], [x1, y1]] = path.bounds(country)
					that.$emit('stateSelected', 'All')
				} else {
					[[x0, y0], [x1, y1]] = path.bounds(d);
					that.$emit('stateSelected', state)
					d3.select(this).transition().style("fill", "gold");
				}
				svg.transition().duration(750).call(
					zoom.transform,
					d3.zoomIdentity
					.translate(width / 2, height / 2)
					.scale(Math.min(8, 0.9 / Math.max((x1 - x0) / width, (y1 - y0) / height)))
					.translate(-(x0 + x1) / 2, -(y0 + y1) / 2),
				);
			}

			function mapPoints(){
				if (!d3.select("#map-container .map-points").empty()) {
					d3.selectAll(".map-points").remove()
				}
				let points = [];
				if(that.selected_state != 'All'){
					// console.log(that.selected_state);
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
	}
};
</script>