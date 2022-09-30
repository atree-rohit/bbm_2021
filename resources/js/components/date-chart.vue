<style scoped>
#date-chart-continer svg g rect,
.map-boundary path,
.map-points circle,
.doughnut-chart path
{
    transition: fill .5s;
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
</style>

<template>
	<div>
		<div id="date-chart-continer"></div>
	</div>
</template>

<script>
export default {
	name:"date-chart",
	props: [ "dateTableData", "selected_dates", "popup" ],
	data() {
		return{
			tooltip:this.popup,
			width: window.innerWidth * 0.5,
			height: window.innerHeight * 0.5,
			xScale: {},
			xScale2: {},
			yScale: {},
			yScale2: {},
			bars1: {},
			xAxis: {},
			xAxisGroup: {},
			watch_init_flag: false,
		}
	},
	mounted(){
	},
	computed:{

	},
	watch: {
		dateTableData(){
			this.watch_init_flag = true
			this.init()
			this.watch_init_flag = false
		}
	},
	methods:{
		init () {
			this.width = window.innerWidth * 0.48
			this.height = window.innerHeight * 0.48
			this.xScale = {}
			this.xScale2 = {}
			this.yScale = {}
			this.yScale2 = {}
			this.bars1 = {}
			this.xAxis = {}
			this.xAxisGroup = {}
			if(this.height > this.width){
				this.width = window.innerWidth * .9
				this.height = window.innerHeight *.5
			}

			this.renderChart()
		},
		renderChart () {
			let margin = {top: 20, right: 20, bottom: 90, left: 50}
			let margin2 = {top: this.height - 70, right: 20, bottom: 30, left: 50}
			this.width = this.width - margin.left - margin.right
			this.height = this.height - margin.top - margin.bottom
			let height2 = 50

			if (!d3.select("#date-chart-continer svg").empty()) {
				d3.selectAll("#date-chart-continer svg").remove()
			}

			let svg = d3.select("#date-chart-continer").append("svg")
				// .attr("viewBox", [0, 0, this.width+margin.left+margin.right, this.height+margin.top+margin.bottom])
					.attr("width",this.width+margin.left+margin.right)
					.attr("height",this.height+margin.top+margin.bottom);

			let focus = svg.append("g")
							.classed("main-date-chart", true)
							.attr("transform", `translate(${margin.left}, ${margin.top})`)
			let context = svg.append("g")
							.attr("transform", `translate(${margin2.left}, ${margin2.top})`)

			let dataset = this.dateTableData.map(d => d.value)


			var maxHeight=d3.max(dataset,(d) => d)
            var minHeight=d3.min(dataset,(d) => d)

            this.yScale = d3.scaleLinear().range([0,this.height]).domain([maxHeight*1.1,0])
			this.xScale = d3.scaleBand().rangeRound([0,this.width]).domain(d3.range(1,dataset.length,1)).padding(0.1)
			this.yScale2 = d3.scaleLinear().range([0,height2]).domain([maxHeight*1.1,0])
			this.xScale2 = d3.scaleBand().rangeRound([0,this.width]).domain(d3.range(1,dataset.length,1)).padding(0.1)

			var yAxis = d3.axisLeft(this.yScale).tickSize(-this.width)
			var yAxisGroup = focus.append("g").call(yAxis)
			this.xAxis = d3.axisBottom(this.xScale)
			this.xAxisGroup = focus.append("g").call(this.xAxis).attr("transform", "translate(0,"+this.height+")")

			var xAxis2 = d3.axisBottom(this.xScale2)
			var xAxisGroup2 = context.append("g").call(xAxis2).attr("transform", "translate(0,"+height2+")")

			this.bars1 = focus.selectAll("rect").data(dataset).enter().append("rect")
			this.bars1.attr("x", (d,i) => this.xScale(i)) //i*(width/dataset.length)
					.attr("y", (d) => this.yScale(d)) //for bottom to top
					.attr("width", this.xScale.bandwidth()/*width/dataset.length-barpadding*/)
					.attr("height", (d) =>  this.height - this.yScale(d))

			this.bars1.attr("fill","steelblue")
				.on('mouseover', (event, d) => this.tooltip.html(`<div>${d} Observations</div>`).style('visibility', 'visible'))
				.on('mousemove', (event, d) => {
					this.tooltip
						.style('top', event.pageY - 10 + 'px')
						.style('left', event.pageX + 10 + 'px')
				})
				
				.on('mouseout', () => this.tooltip.html('').style('visibility', 'hidden'))

			var bars2 = context.selectAll("rect").data(dataset).enter().append("rect")
			bars2.attr("x", (d,i) => this.xScale2(i))
				.attr("y",(d) => this.yScale2(d))//for bottom to top
				.attr("width", this.xScale2.bandwidth()/*width/dataset.length-barpadding*/)
					.attr("height", (d) => height2 - this.yScale2(d))
			bars2.attr("fill", "red")

			var brush = d3.brushX()
					.extent([[0,0],[this.width,height2]])//(x0,y0)  (x1,y1)
					.on("brush",this.brushed)//when mouse up, move the selection to the exact tick //start(mouse down), brush(mouse move), end(mouse up)
					.on("end",this.brushend)

			if (this.watch_init_flag && this.selected_dates.length > 0) {
				let extent = [this.xScale2(Math.min(...this.selected_dates)), this.xScale2(Math.max(...this.selected_dates))]
				this.renderBrushedChart(this.selected_dates)
				context.append("g")
					.attr("class","brush")
					.call(brush)
					.call(brush.move,extent);
			} else {
				context.append("g")
					.attr("class","brush")
					.call(brush)
					.call(brush.move,this.xScale2.range());
			}

		},
		brushed (event) {
			if (!event.sourceEvent) return // Only transition after input.
			if (!event.selection) return // Ignore empty selections.
			if(event.sourceEvent && event.sourceEvent.type === "zoom") return // ignore brush-by-
				//scaleBand of bar chart is not continuous. Thus we cannot use method in line chart.
				//The idea here is to count all the bar chart in the brush area. And reset the domain
			var newInput = []
			var brushArea = event.selection

			if(brushArea === null) brushArea = this.xScale.range()

			this.xScale2.domain().forEach((d) => {
				var pos = this.xScale2(d) + this.xScale2.bandwidth()/2
				if (pos >= brushArea[0] && pos <= brushArea[1]){
				  newInput.push(d)
				}
			})

			this.renderBrushedChart(newInput)
		},
		brushend (event) {
			if (!event.sourceEvent) return; // Only transition after input.
			if (!event.selection) return; // Ignore empty selections.
			if(event.sourceEvent && event.sourceEvent.type === "zoom") return; // ignore brush-by-
				//scaleBand of bar chart is not continuous. Thus we cannot use method in line chart.
				//The idea here is to count all the bar chart in the brush area. And reset the domain
			var newInput = []
			var brushArea = event.selection
			if(brushArea === null) brushArea = this.xScale.range()

			this.xScale2.domain().forEach((d) => {
				var pos = this.xScale2(d) + this.xScale2.bandwidth()/2;
				if (pos >= brushArea[0] && pos <= brushArea[1]){
					newInput.push(d);
				}
			})

			//relocate the position of brush area
			var increment = 0;
			var left = this.xScale2(d3.min(newInput));
			var right = this.xScale2(d3.max(newInput))+this.xScale2.bandwidth();
			this.emitDate(newInput)
		},
		renderBrushedChart (data){
			this.xScale.domain(data)
			let that = this

			this.bars1.attr("x",(d,i) => that.xScale(i))
					.attr("y",(d) => that.yScale(d))
				.attr("width", this.xScale.bandwidth())//if you want to change the width of bar. Set the width to this.xScale.bandwidth() If you want a fixed width, use this.xScale2.bandwidth(). Note because we use padding() in the scale, we should use this.xScale.bandwidth()
				.attr("height", (d,i) => {
					if(that.xScale.domain().indexOf(i) === -1){
						return 0
					}
					else
						return that.height-that.yScale(d)
				})
			this.xAxisGroup.call(this.xAxis)
		},
		emitDate(d){
			if(this.watch_init_flag == false){
					this.$emit('dateRangeSelected', d)
			}
		}
	}
};
</script>