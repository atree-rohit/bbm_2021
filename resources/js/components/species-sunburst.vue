<style scoped>
    .breadcrumbs  a{
        font-size:.7em;
        height:30px;
        line-height:30px;
        vertical-align:middle;
        text-align:center;
        padding:0 7px;
        position:relative;
        display:inline-block;
        background-color: #fff;
        margin: 2px 0;
        color:#000;
        border:2px solid #8ab;
        border-radius:7px;
    }
    .breadcrumb {
        list-style: none;
        overflow: hidden;
        padding: 0;
        margin: 0;
    }
    .breadcrumb li a {
        color: white;
        text-decoration: none;
        padding: 10px 0 10px 55px;
        background: brown; /* fallback color */
        background: #004040;
        position: relative;
        display: block;
        float: left;
    }
    .breadcrumb li a:after {
        content: " ";
        display: block;
        width: 0;
        height: 0;
        border-top: 50px solid transparent;           /* Go big on the size, and let overflow hide */
        border-bottom: 50px solid transparent;
        border-left: 30px solid #004040;
        position: absolute;
        top: 50%;
        margin-top: -50px;
        left: 100%;
        z-index: 2;
    }
    .breadcrumb li a:before {
        content: " ";
        display: block;
        width: 0;
        height: 0;
        border-top: 50px solid transparent;           /* Go big on the size, and let overflow hide */
        border-bottom: 50px solid transparent;
        border-left: 30px solid white;
        position: absolute;
        top: 50%;
        margin-top: -50px;
        margin-left: 1px;
        left: 100%;
        z-index: 1;
    }
    .breadcrumb li:first-child a {
        padding-left: 10px;
    }
    .breadcrumb li:last-child a {
        background: rgb(200,200,0) !important;
    }
    .breadcrumb li:last-child a:after {
        border-left: 30px solid rgb(200,200,0);
    }

    .breadcrumb li:hover a
    {
        color:#0ff;
        text-decoration: underline;
    }
</style>
<template>
    <div>
        <div class="breadcrumb text-center">
            <li v-for="(crumb, i) in breadcrumbs">
                <a href="#" :title="crumbTitle(crumb, i)" @click="crumbClick(crumb)">{{ crumb }}</a>
            </li>
        </div>        
        <div id="sunburstChart" class=""></div>
    </div>
</template>

<script>
	import * as d3 from "d3"
	export default {
		name:"species-sunburst",
		props: ["tree_data", "selected"],
		data(){
			return {
                width: 1200,
        		height:600,
        		radius: 90,
        		margin: {
        			top: 50,
        			right: 50,
        			left: 50,
        			bottom: 50,
        		},
        		g:"",
        		path:"",
        		parent:"",
        		label:"",
        		speciesData:[],
        		root:{},
                breadcrumbs:[],
                watch_click:false,
			}
		},
		computed: {
            color () {
                return d3.scaleOrdinal(d3.quantize(d3.interpolateWarm, this.speciesData.children.length +4))
            },
		},
		watch: {
            tree_data () {
                this.init()
                //click on selected
                this.watch_click = true
                this.crumbClick(this.selected[this.selected.length - 1])
                this.watch_click = false
                // this.crumbClick("Coliadinae")
            }
		},
        mounted() {
    		this.init()
            this.crumbClick("Papilionoidea")
		},
		methods: {
            init () {
                var speciesTree = [];

                this.tree_data.forEach(d => {
                    speciesTree.push([d.superfamily,d.family, d.subfamily, d.tribe, d.genus, d.species])
                })
                this.speciesData = this.createTree(speciesTree, "Reset")
                this.root = this.partition(this.speciesData)
                this.root.each(d => d.current = d)

            
            	if (!d3.select("#sunburstChart svg").empty()) {
                    d3.selectAll("#sunburstChart svg").remove()
                }
                const svg = d3.select("#sunburstChart")
            		.append("svg")
            		.classed("bg-light text-center border boorder-primary rounded", true)
            		.attr("viewBox", [0,0, this.width, this.height])

            	const arc = d3.arc()
            		.startAngle(d => d.x0)
            		.endAngle(d => d.x1)
            		.padAngle(d => Math.min((d.x1 - d.x0) / 2, 0.01))
            		.padRadius(this.radius * 1.5)
            		.innerRadius(d => d.y0 * this.radius)
            		.outerRadius(d => Math.max(d.y0 * this.radius, d.y1 * this.radius))

            	this.g = svg.append("g")
            	         .attr("transform", `translate(${this.width / 2},${this.height / 2})`)

            	this.path = this.g.append("g")
            		.classed("d3-arcs", true)
            		.selectAll("path")
                        .data(this.root.descendants().slice(1))
                        .join("path")
                        .attr("fill", d => {
                            while (d.depth > 2) d = d.parent; return this.color(d.data.name);
                        })
                        .attr("fill-opacity", d => this.arcVisible(d.current) ? (d.children ? 0.3 : 0.1) : 0)
                        .attr("stroke", "white")
            			.attr("stroke-width", d => this.arcVisible(d.current) ? (d.children ? "1px" : "1px") : "0px")
            			.attr("d", d=> arc(d.current))

            	this.path.filter(d => d.current)
            	.style("cursor", "pointer")
            		.on("mouseover", function (d){ d3.select(this).classed("selected", true)})
            		.on("mouseout", function (d){ d3.select(this).classed("selected",false)})
            		.on("click", (d) => {
                        // console.log(d.data.children.length)
                        if (d.data.children){
                            if(d.data.children.length > 0){
                                return this.clicked(d)
                            } else {
                                alert(d.data.name)
                            }
                        }
                    })

            	this.path.append("title")
            		.text( d => `${d.ancestors().map(d => d.data.name).reverse().join(" > ")} - ${d.value}`);

            	this.label = this.g.append("g")
            		.classed("d3-arcs-labels", true)
            		.attr("pointer-events", "none")
            		.attr("text-anchor", "middle")
            		// .style("user-select", "none")
            		.selectAll("text")
                        .data(this.root.descendants().slice(1))
            			.join("text")
            			.attr("dy", "0.35em")
            			.attr("fill-opacity", d => +this.labelVisible(d.current))
            			.attr("transform", d => this.labelTransform(d.current))
                            .text(d => d.data.name)

                this.parent = this.g.append("circle")
            		.datum(this.root)
            		.attr("r", this.radius)
            		.attr("fill", "none")
            		.attr("pointer-events", "all")
            		.on("click", this.clicked)
            },
            clicked(p) {
                var selected_taxon = p.data.name
                // console.log(selected_taxon, p)

                this.breadcrumbs = this.populate_breadcrumbs(p,[]);
                if(this.watch_click == false ){
                    this.$emit('select-taxon', this.breadcrumbs)
                }
                const arc = d3.arc()
					.startAngle(d => d.x0)
					.endAngle(d => d.x1)
					.padAngle(d => Math.min((d.x1 - d.x0) / 2, 0.01))
					.padRadius(this.radius * 1.5)
					.innerRadius(d => d.y0 * this.radius)
					.outerRadius(d => Math.max(d.y0 * this.radius, d.y1 * this.radius))


				this.parent.datum(p.parent || this.root);
				this.root.each(d => d.target = {
					x0: Math.max(0, Math.min(1, (d.x0 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
					x1: Math.max(0, Math.min(1, (d.x1 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
					y0: Math.max(0, d.y0 - p.depth),
					y1: Math.max(0, d.y1 - p.depth)
				})

                const t = this.g.transition().duration(750)
                const that = this
                this.path.transition(t)
					.tween("data", d => {
						const i = d3.interpolate(d.current, d.target);
						return t => d.current = i(t);
					})
					.filter(function(d) {
						return +this.getAttribute("fill-opacity") || that.arcVisible(d.target)
					})
					.attr("fill-opacity", d => that.arcVisible(d.target) ? (d.children ? 0.6 : 0.4) : 0)
					.attrTween("d", d => () => arc(d.current))
    			that.label.filter(function(d) {
					return +this.getAttribute("fill-opacity") || that.labelVisible(d.target)
                }).transition(t)
					.attr("fill-opacity", d => +that.labelVisible(d.target))
					.attrTween("transform", d => () => that.labelTransform(d.current))
			},
            arcVisible(d){
                // 
                return d.y1 <= 3 && d.y0 >= 1 && d.x1 > d.x0
            },
            labelVisible(d) {
                // 
                return d.y1 <= 3 && d.y0 >= 1 && (d.y1 - d.y0) * (d.x1 - d.x0) > 0.03
            },
            labelTransform(d) {
                const x = (d.x0 + d.x1) / 2 * 180 / Math.PI
                const y = (d.y0 + d.y1) / 2 * this.radius
                return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`
            },
            arc(d){
                d3.arc()
                    .startAngle(d => d.x0)
                    .endAngle(d => d.x1)
                    .padAngle(d => Math.min((d.x1 - d.x0) / 2, 0.005))
                    .padRadius(this.radius * 1.5)
                    .innerRadius(d => d.y0 * this.radius)
                    .outerRadius(d => Math.max(d.y0 * this.radius, d.y1 * this.radius))

                this.data.forEach(d => {
					if(d.species == n)
						match = d.id
				})
				return match
			},
            format(d){
                // 
                return d3.format(d)
			},
            partition(data) {
                this.root = d3.hierarchy(data)
                    .sum(d => 1)
                    .sort((a, b) => b.value - a.value)
                return d3.partition()
                    .size([2 * Math.PI, this.root.height + 1])
					(this.root);
			},
            createTree(structure, topItem) {
                const node = (name) => ({name, children: []});
                const addNode = (parent, child) => (parent.children.push(child), child);
                const findNamedNode = (name, parent) => {
                    for (const child of parent.children) {
                        if (child.name === name) { return child }
                        const found = findNamedNode(name, child);
                        if (found) { return found }
                    }
				}
                const topName = topItem;
                const top = node(topName);
                var current;
                for (const children of structure) {
                    current = top;
                    for (const name of children) {
                        const found = findNamedNode(name, current);
                        current = found ? found : addNode(current, node(name, current.name));
                    }
                }
                return top;
            },
            populate_breadcrumbs(p,result){
                if(p.data != null && p.data.name != "Reset"){
                    if(p.parent != null){
                        result = this.populate_breadcrumbs(p.parent, result);
                    }
                    result.push(p.data.name)
                } 
                return result
            },
            crumbTitle(text, depth){
                var taxon = ""
                if(text != undefined){
                    if(depth > 0){
                        taxon = text.charAt(0).toUpperCase() + text.slice(1) + ": "
                    }                    
                }
                return  taxon
            },
            crumbClick(text){
                this.root.descendants().forEach(a => {
                    if(a.data.name == text){
                        this.clicked(a)
                    }
                })
            },

		}
    };
</script>