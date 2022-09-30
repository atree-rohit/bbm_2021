<style>
    #controls{
        margin: 0 2rem;
    }
	#map-container .state-selected{
		/*fill: #afa;*/
		fill: #ffff55;
		stroke: rgba(255,50,0,.5);
		stroke-width:.5px;
	}
	.poly_text{
		fill: #545;
		font-size: 1.0rem;
		transition: fill .125s;
		text-shadow: 
		0px 0px 1px white,
		0px 0px 2px white,
		0px 0px 3px white,
		0px 0px 4px white,
		0px 0px 5px white;
	}
	.poly_text:hover{
		fill: #00c;
		text-shadow: 0px 0px 5px #fff;
		cursor: pointer;
		font-weight: 1000;
	}

    .map-points circle{
		stroke-width: .5px;
		stroke: red;
		fill: pink;
	}

	.map-boundary path{
		/* stroke: transparent; */
		stroke-linejoin: round;
		stroke-width: .1;
	}
	.map-boundary path:hover{
		cursor: pointer;
		fill: beige;
	}

    table, tr, th,td{
        border: 1px solid white;
    }
    td {
        padding: 0.5rem 1rem;
    }
	@media screen and (max-width: 800px) {
		.poly_text{
			font-size: 3.5vw;
		}
	}
</style>

<template>
	<div>
        <div id="controls">
            <h3>{{mapModes[mapMode]}} - {{selected}}</h3>
            <ui-slider
                v-model="mapMode"
                color="primary-light2"
                :step="1"
                :min="0"
                :max="3"
                show-marker
            />

            <ui-slider
                v-model="hexZoom"
                :step="1"
                :min="0"
                :max="9"
                show-marker
                v-show="mapMode == 3"
            />
        </div>
		<div id="map-container"></div>
	</div>
</template>

<script>
import * as d3 from "d3"
import * as d3Legend from "d3-svg-legend"
import * as h3 from "h3-js"
import regions from '../geojson/regions.json'
import states from '../geojson/states.json'
import districts from '../geojson/districts.json'
export default {
	name:"IndiaMap",
    props: ["map_data", "selected_state", "popup", "areaStats", "selected_region", "set_polygon"],
	data() {
		return{
            mapMode: 0,
            mapModes: ["Region", "State", "District", "Hexagons"],
			mapLayers: [regions, states, districts],
			hexZoom: 5,
			polygons: null,
			path: null,
			svg: {},
			projection: {},
			colors: {},
			legend: {},
			state_data: {},
			selected:"All",
			max: 0,
			state_max: 0,
			height: 600 ,
			width: 800,
			tooltip:null,
            regions: {
				"east":["Arunachal Pradesh","Assam","Manipur","Meghalaya","Mizoram","Nagaland","Sikkim","Tripura","Bihar","Odisha","Jharkhand","West Bengal"],
				"north":["Chandigarh","Punjab","Uttarakhand","Ladakh","Jammu and Kashmir","NCT of Delhi","Haryana","Himachal Pradesh","Uttar Pradesh"],
				"south":["Karnataka","Telangana","Kerala","Andaman and Nicobar","Lakshadweep","Tamil Nadu","Andhra Pradesh","Puducherry"],
				"west":["Rajasthan","Madhya Pradesh","Gujarat","Dadra and Nagar Haveli", "Daman and Diu","Chhattisgarh","Goa","Maharashtra"]
			},
			region_colors: {
				north: "#f8df81",
				south: "#badfda",
				west: "#f6aa90",
				east: "#d5b6d5"
			},
			observation_counts: {},
			hexagons: {},
			locations: [],
		}
	},
	created() {
	},
	mounted(){
		this.init_tooltip()
		this.init()
		this.data_fns()
		// console.clear()
	},
	computed:{
		observations(){ //final output from here
            return this.map_data
        },
		zoom() {
			return d3.zoom()
				.scaleExtent([.5, 250])
				.translateExtent([[-0.5 * this.width,-0.75 * this.height],[2.5 * this.width, 2.5 * this.height]])
				.on('zoom', this.handleZoom)
		},
	},
	watch: {
		map_data () {
			this.init()
		},
		selected_state (newVal, oldVal) {
			if (!d3.select("#map-container svg").empty()) {
				d3.selectAll("#map-container svg").remove()
			}
			this.init()
		},
        mapMode(newVal) {
            this.init()
			if(newVal == 3)
			this.init_hexagons()
        },
		hexZoom() {
			this.init_hexagons()
		},
		observations() {
			this.data_fns()
		}
	},
	methods:{
		data_fns(){
			const formatDate = d3.timeFormat("%Y")
			let o  = d3.group(this.observations, o => formatDate(new Date(o.date)),o => o.portal, o => o.date)
            let loc = d3.groups(this.observations, o => o.lat + "," + o.lon)
			let lo = []
			loc.forEach((l) => {
				let state = l[1][0].state
				let region = null
				let district = l[1].filter((o) => o.district)
                if(district.length ==0 ){
                    district = null                    
                } else {
                    district = l[1].filter((o) => o.district)[0].district
                }
				Object.keys(this.regions).forEach((k) => {
					if(this.regions[k].indexOf(state) != -1){
						region = k
					}
				})
				// if(["West Bengal", "Sikkim"].indexOf(state) != -1)
				lo.push({
					region: region,
					state: state,
					district: district,
					latitude: parseFloat(l[1][0].lat),
					longitude: parseFloat(l[1][0].lon),
					observation_count: l[1].length,
					observations: l[1]
				})
			})
			// console.log("data_fns", lo)
			this.locations = lo
			this.init()
		},
        color_polygon(polygon) {
			let region = polygon.region ?? null
			let state = polygon.state ?? null
			let district = polygon.district ?? null
            let op = this.colors(0)

            if(this.mapMode === 0){
				op = this.colors(this.get_observation_count("region", region))
            } else if (this.mapMode === 1){
                // op = `hsl(${parseInt(s_data.statecode) * 19}, 50%, 50%)`
					op = this.colors(this.get_observation_count("state", state)) 
            } else if (this.mapMode === 2){
				// op = `hsl(${parseInt(s_data.objectid) * 19}, 50%, 50%)` 
				op = this.colors(this.get_observation_count("district", district)) 
			} else if(this.mapMode === 3){
				op = 'hsl(200,100%, 80%)'
			}
            return op
        },
		color_hexagon(val){
			return this.colors(val)
		},
		get_observation_count(mode, name){
			let op = 0
			// console.log("Get Observation count: ", name)
			if(mode == "region"){
				op = this.areaStats.region[name].observations
			} else if (mode == "state" && this.areaStats.state[name].observations != undefined) {
                op = this.areaStats.state[name].observations
			} else if (mode == "district" && this.areaStats.district[name].observations != undefined) {
                op = this.areaStats.district[name].observations
			}
			return op
		},
        handleZoom(e){
			let text_size = (1/e.transform.k)
            this.svg.selectAll('.poly_text')
                .attr('transform', e.transform)
				.style('font-size', `${text_size}rem`)
            this.svg.selectAll('path')
                .attr('transform', e.transform)
            this.svg.selectAll('circle')
                .attr('transform', e.transform)
				.attr("r", text_size)
        },
		init () {
			this.polygons = null
			this.path = null
			this.svg = {}
			this.projection = {}
			this.height = window.innerHeight * 0.85
			this.width = window.innerWidth * 0.5
			if(window.innerWidth < 800){
				this.height = window.innerHeight * 0.5
				this.width = window.innerWidth * 0.9
			}

			if(this.set_polygons){
				this.mapMode = 2
			}

			this.init_observation_counts()
			this.init_legend()
			this.renderMap()
		},
        init_tooltip(){
            this.tooltip = d3.select('body')
							    .append('div')
							    .attr('class', 'd3-tooltip')
							    .style('position', 'absolute')
							    .style('top', '0')
							    .style('z-index', '10')
							    .style('visibility', 'hidden')
							    .style('padding', '10px')
							    .style('background', 'rgba(0,0,0,0.6)')
							    .style('border-radius', '4px')
							    .style('color', '#fff')
							    .text('a simple tooltip')

        },
		init_observation_counts() {
			// console.log("init_observation_counts: ", this.areaStats)
			let scales = ["region", "state", "district"]
			scales.forEach((s) => {
				this.observation_counts[s] = {}
			})
			this.locations.forEach((l) => {
				if(this.observation_counts.region[l.region] == undefined){
					this.observation_counts.region[l.region] = 0
				}
				this.observation_counts.region[l.region] += l.observation_count

				if(this.observation_counts.state[l.state] == undefined){
					this.observation_counts.state[l.state] = 0
				}
				this.observation_counts.state[l.state] += l.observation_count

				if(this.observation_counts.district[l.district] == undefined){
					this.observation_counts.district[l.district] = 0
				}
				this.observation_counts.district[l.district] += l.observation_count
			})
			// console.log("observation_counts", this.observation_counts)
		},
		init_legend() {
			this.colors = {}
			this.legend = {}
			this.max = 0
			if(this.mapMode == 0 ){
				Object.values(this.observation_counts.region).forEach((n) => {
					if(n > this.max)
						this.max = n
				})
				this.colors = d3.scaleLinear()
					.domain([0, 5500, this.max])
					// .interpolator(d3.interpolateRainbow);
					.range(["#f77", "#33d", "#3d3"])
			} else if (this.mapMode == 1){
				Object.values(this.observation_counts.state).forEach((n) => {
					if(n > this.max)
						this.max = n
				})
				this.colors = d3.scaleLinear()
					.domain([0, 1, this.max*0.1, this.max])
					.range(["#f77", "#ca0", "#cda", "#3d3"])
			} else if (this.mapMode == 2 ){
				Object.values(this.observation_counts.district).forEach((n) => {
					if(n > this.max)
						this.max = n
				})
				this.colors = d3.scaleLinear()
					.domain([0, 1, this.max*.25, this.max])
					.range(["#f77", "#ca0", "#ada", "#3d3"])

				if(this.set_polygon){
					this.colors = d3.scaleLinear()
						.domain([0, 1, this.max*.25, this.max])
						.range(["#77f", "#ca0", "#ada", "#3d3"])

				}
			} else if (this.mapMode == 3 ){
				Object.values(this.hexagons).map((h) => h.observations).forEach((n) => {
					if(n > this.max)
						this.max = n
				})
				let hex_opacity = 0.75
				this.colors = d3.scaleLog()
					.domain([0, 1, this.max*.25, this.max])
					.range([`rgba(255, 119, 119, ${hex_opacity})`, `rgba(204, 170, 0, ${hex_opacity})`, `rgba(170, 221, 170, ${hex_opacity})`, `rgba(51, 221, 51, ${hex_opacity})`])
			}
			this.legend = d3Legend.legendColor()
								.shapeWidth(45)
								.scale(this.colors)
								.labelFormat(d3.format(".0f"))
								.orient('horizontal')
								.labelOffset(-10)
								.labelAlign("start")
								.cells(6)

		},
		init_hexagons(){
			this.hexagons = {}
			if(this.locations != undefined){
				this.locations.forEach((l) => {
					let hex = h3.latLngToCell(l.latitude, l.longitude, this.hexZoom)
					if(this.hexagons[hex] == undefined){
						this.hexagons[hex] = {
							observations: 0,
							geometry: h3.cellToBoundary(hex)
						}
					}
					this.hexagons[hex].observations += l.observation_count
				})
				// this.generateHexGeoJson()
				this.init()
			}
		},
		generateHexGeoJson(){
			let hexagons = []
			
			Object.values(this.hexagons).forEach((h) => {
				let coords = h.geometry.map((p) => [p[1], p[0]])
				coords.push(coords[0])
				hexagons.push({
					type: "Feature",
					geometry: {
						type: "Polygon",
						coordinates: [JSON.parse(JSON.stringify(coords))]
					},
					properties: {
						count: h.observations
					}
				})

			})
			console.log("hex", hexagons)
		},				
		renderMap () {
			this.selected = this.selected_state
			if (!d3.select("#map-container svg").empty()) {
				d3.select("#map-container svg").remove()
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
				.selectAll("path").append("g")
			let base_text = this.svg.append("g")
				.classed("map-labels", true)
				.selectAll("text").append("g")
			this.polygons = base.append("g")
				.classed("polygons", true)
			
			if(this.mapMode == 3){
				this.mapLayers[1].features.forEach((polygon) => {
					this.drawPolygon(polygon)
				})
				this.render_hex()
			} else {
				this.mapLayers[this.mapMode].features.forEach((polygon) => {
					this.drawPolygon(polygon)
				})
				this.mapLayers[this.mapMode].features.forEach((polygon) => {
					this.drawPolygonLabel(base_text, polygon)
				})
			}

			this.svg.append("g")
				.attr("transform", "translate("+this.width*.5+", 50)")
				.call(this.legend)

			this.svg.call(this.zoom)
			this.mapPoints()
		},
		drawPolygon(polygon){
			let region = polygon.properties.region ?? null
			let state = polygon.properties.state ?? null
			let district = polygon.properties.district ?? null
			let names = [region, state, district]
			let table_text = ""
			if(this.mapMode < 3){
				for(let i = 0 ; i <= this.mapMode ; i++){
					let level = this.mapModes[i]
					table_text += `<tr><td>${level}</td><td>${this.capatilizeWords(names[i])} - ${this.get_observation_count(level.toLowerCase(), names[i])}</td></tr>`
				}
			}

			let current_polygon = this.polygons.append("g")
				.data([polygon])
				.enter().append("path")
				.attr("d", this.path)
				.attr("id", this.getPolygonId(polygon.properties))
			if(this.mapMode !== 3){
				current_polygon.on('mouseover', (d, i) => {
					this.tooltip.html(`<table>${table_text}</table>`)
						.style('visibility', 'visible')
				})
				.on('mousemove', (event, d) => {
					this.tooltip
						.style('top', event.pageY - 10 + 'px')
						.style('left', event.pageX + 10 + 'px')
				})
				.on('mouseout', () => this.tooltip.html(``).style('visibility', 'hidden'))
				.on("click", (d) => this.clicked(d))
			}
			
			if(region == null){
				console.log(state, region)
			}
			current_polygon.attr("fill", (d) => this.color_polygon(polygon.properties))
			// current_polygon.attr("stroke", (d) => this.color_polygon(region, polygon.properties))
		},
		drawPolygonLabel(base_text, polygon){
			let region = polygon.properties.region ?? null
			let state = polygon.properties.state ?? null
			let district = polygon.properties.district ?? null
			let name = [region, state, district][this.mapMode]
			let mode = this.mapModes[this.mapMode].toLowerCase()
			let observations = this.get_observation_count(mode, name)
			if(observations > 0) {
				let x = base_text.append("g")
					.data([polygon])
					.enter().append("text")
					.classed("poly_text", true)
					.attr("x", (h) => this.path.centroid(h)[0] )
					.attr("y", (h) => this.path.centroid(h)[1] )
					.classed("small-text" , this.mapMode === 2)
					.attr("text-anchor", "middle")
					.text(observations)
					.on('mouseover', () => {
						this.tooltip.html(
							`<table>
							<tr><td>${this.capatilizeWords(mode)}</td><td>${this.capatilizeWords(name)}</td></tr>
							<tr><td>Observations</td><td>${this.areaStats[mode][name].observations}</td></tr>
							<tr><td>Users</td><td>${this.areaStats[mode][name].users.size}</td></tr>
							<tr><td>Unique Taxa</td><td>${this.areaStats[mode][name].species.size}</td></tr>
							</table>`)
							.style('visibility', 'visible');
					}
						)
					.on('mousemove', (event, d) => {
						this.tooltip
							.style('top', event.pageY - 10 + 'px')
							.style('left', event.pageX + 10 + 'px')
					})
					.on('mouseout', () => this.tooltip.html(``).style('visibility', 'hidden'))
					.on("click", this.clicked)
			}
		},
		render_hex(){
			let hex_layer = this.svg.append("g")
				.classed("map-hexagons", true)
			Object.values(this.hexagons).forEach((h) => {
				let l = hex_layer.selectAll("g").append("g")
					.data([this.get_geojson(h)])
					.enter().append("path")
					.classed("hex", true)
					.attr("d", this.path)
					.attr("fill", (d) => this.color_hexagon(d.properties.observations))
					.on('mouseover', (d, i) => {
						this.tooltip.html(
							`<table>
							<tr><td>Observations</td><td>${i.properties.observations}</td></tr>
							</table>`)
							.style('visibility', 'visible')
						})
					.on('mousemove', (event, d) => {
						this.tooltip
							.style('top', event.pageY - 10 + 'px')
							.style('left', event.pageX + 10 + 'px')
					})
					.on('mouseout', () => this.tooltip.html(``).style('visibility', 'hidden'))
			})
		},
		get_geojson(hex){
			let points = Array.from(Array.from(hex.geometry).map((p) => [p[1], p[0]]).reverse())
			points.push(points[0])
			let op = {
				type: 'Feature',
				geometry: {
					type: 'Polygon',
					coordinates: [points]
				},
				properties: {
					observations: hex.observations
				}
			}
			return op
		},
		stateID(s){
			return s.replaceAll(" ", "_").replaceAll("&", "")
		},
		getPolygonId(polygon){
			let op = polygon.region
			let replace_chars = [" ", "&", "(", ")"]
			if(polygon.state != undefined){
				op = polygon.state
			}
			if(polygon.district != undefined){
				op = polygon.district
			}
			replace_chars.forEach((c) => {
				op = op.replaceAll(c, "_")
			})
			return op
		},
		clicked(d) {
			let props = d.target.__data__.properties
			let region = props.region ?? null
			let state = props.state ?? null
			let district = props.district ?? null
			let name = [region, state, district][this.mapMode]
			let polygon = this.mapLayers[this.mapMode].features
				.filter((p) => p.properties[["region", "state", "district"][this.mapMode]] == name)[0]
			this.tooltip.html(``).style('visibility', 'hidden')
            
			let [[x0, y0], [x1, y1]] = [[0,0],[0,0]]
			
			d3.selectAll(".state-selected").classed("state-selected", false)
			if(this.selected == "All" || this.selected != name){
				this.selected = name;
				[[x0, y0], [x1, y1]] = this.path.bounds(polygon);
				d3.select("#" + this.getPolygonId(props)).classed("state-selected", true)
			} else {
				this.selected = "All";
				[[x0, y0], [x1, y1]] = this.path.bounds(regions);
				// this.renderMap()
			}
			this.$emit('stateSelected', this.selected)
			

			// let state = d.target.__data__.properties.statename
			/*
				if(state == this.selected && state != 'All')
				if (!d3.select("#map-container .poly_text").empty()) {
					d3.selectAll("#map-container .poly_text").remove()
				}
				{
					if(this.selected == state){
						
					} else {
					}
					if(this.selected == state){
						this.$emit('stateSelected', 'All')
					} else {
						this.$emit('stateSelected', state)
					}
				}
			*/

			this.svg.transition().duration(750).call(
				this.zoom.transform,
				d3.zoomIdentity
				.translate(this.width / 2, this.height / 2)
				.scale(Math.min(8, 0.9 / Math.max((x1 - x0) / this.width, (y1 - y0) / this.height)))
				.translate(-(x0 + x1) / 2, -(y0 + y1) / 2),
			)
			
		},
		mapPoints(){
			// let points = this.locations.filter((l) => window.unmatched_districts.indexOf(l.district) != -1).map((l) => [l.longitude, l.latitude, l.id, l])
			let points = this.locations.map((l) => [l.longitude, l.latitude, l.id, l])
			// if(this.selected != 'All'){
				// 	console.log("mapPoints", this.selected)
				// 	this.state_data[this.selected].forEach(o => {
					// 		let coords = o.location.split(",")
					// 		points.push([coords[1], coords[0], o.id, o.place_guess]);
					// 	})
					// }
			if((points.length > 0 && points.length < 1500) || this.set_polygon ){
				// console.log("mapPoints", points)
				let map_points = this.svg.append('g')
				.classed('map-points', true)
				.selectAll("circle")
				.data(points).enter()
				.append("circle")
				.attr("cx", (d) => this.projection(d)[0])
				.attr("cy", (d) => this.projection(d)[1])
				.attr("r", "2px")
				.attr("stroke", "yellow")
				.attr("stroke-width", "0.25px")
				.attr("fill", "green")
				.on('mouseover', (d, i) => {
						this.tooltip.html(
							`<table>
							<tr><td>Region</td><td>${JSON.stringify(i)}</td></tr>
							</table>`)
							.style('visibility', 'visible')
						})
				.on('mousemove', (event, d) => {
					this.tooltip
						.style('top', event.pageY - 10 + 'px')
						.style('left', event.pageX + 10 + 'px')
				})
				.on('mouseout', () => this.tooltip.html(``).style('visibility', 'hidden'))
				map_points.on("click", (d) => this.$emit('pointSelected', d.target["__data__"]))
			}
		},
		capatilizeWords(str){
			return str.split(" ").map((w) => w[0].toUpperCase() + w.substr(1)).join(" ")
		},
	}
};
</script>