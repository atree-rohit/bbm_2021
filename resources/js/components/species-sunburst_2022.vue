<style>
    .breadcrumb {
        list-style: none;
        padding: 0;
        margin: 0;
    }
    .breadcrumb{
    background: #eee;
    border-width: 1px;
    border-style: solid;
    border-color: #f5f5f5 #e5e5e5 #ccc;
    border-radius: 5px;
    box-shadow: 0 0 2px rgba(0,0,0,.2);
    overflow: hidden;
    width: 100%;
  }

  .breadcrumb li{
    float: left;
  }

  .breadcrumb a{
    padding: .7em 1em .7em 2em;
    float: left;
    text-decoration: none;
    color: #303;
    position: relative;
    text-shadow: 0 1px 0 rgba(255,255,255,.5);
    background-color: #ddd;
    background-image: linear-gradient(to right, #7c9, #aec);
  }

  .breadcrumb li:first-child a{
    padding-left: 1em;
    border-radius: 5px 0 0 5px;
  }

  .breadcrumb a:hover{
    background: #fff;
  }

  .breadcrumb a::after,
  .breadcrumb a::before{
    content: "";
    position: absolute;
    top: 50%;
    margin-top: -1.5em;
    border-top: 1.5em solid transparent;
    border-bottom: 1.5em solid transparent;
    border-left: 1em solid;
    right: -1em;
  }

  .breadcrumb a::after{
    z-index: 2;
    border-left-color: #aec;
  }

  .breadcrumb a::before{
    border-left-color: #5a3;
    right: -1.1em;
    z-index: 1;
  }

  .breadcrumb a:hover::after{
    border-left-color: #fff;
  }

  .breadcrumb .current,
  .breadcrumb .current:hover{
    font-weight: bold;
    background: none;
  }

  .breadcrumb .current::after,
  .breadcrumb .current::before{
    content: normal;
  }

.breadcrumb li:hover a
{
    color: #282 !important;
    text-decoration: none;
    text-shadow: 1px 1px 5px rgba(100,255,100,.25);
}
.taxa-selected{
    fill: red !important;
}

path[fill-opacity="0"] {
    display: none;
}
</style>
<template>
    <div>
        <ul class="breadcrumb text-center">
            <li v-for="(crumb, i) in breadcrumbs" :key="i">
                <a href="#" :title="`${taxa_level_labels[i]}: ${crumb}`" @click="crumbClick(crumb)">{{ crumb }}</a>
            </li>
        </ul>
        <div id="sunburstChart" class=""></div>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import store from '../store/index_2022'
	export default {
		name:"species-sunburst",
		data(){
			return {
                width: 0,
        		height:0,
        		radius: 0,
                font_size:0,
        		g:"",
        		path:"",
        		parent:"",
        		label:"",
        		species_data:[],
        		root:{},
                breadcrumbs:[],
                taxa_levels: ["superfamily","family","subfamily","tribe","genus","species"],
                taxa_level_labels: ["Super-family", "Family", "Sub-family", "Tribe", "Genus", "Species"],
			}
		},
		computed: {
            ...mapState({
				filtered_data: state => state.all_data,
				all_taxa: state => state.taxa,
                selected: state => state.selected,
			}),
            color () {
                return d3.scaleOrdinal(d3.quantize(d3.interpolateWarm, this.species_data.children.length +4))
            },
		},
        mounted(){
            this.init()
            if(this.selected.taxa != "Papilionoidea"){
                let taxa_name = this.all_taxa.find(taxa => taxa.id == this.selected.taxa).name
                this.crumbClick(taxa_name)
            }
        },
		watch: {
            'selected.taxa': function(newVal){
                let taxa_name = this.all_taxa.find(taxa => taxa.id == newVal).name
                this.crumbClick(taxa_name)
            }
		},
		methods: {
            init () {
                if(window.innerWidth < 800){
                    this.width = window.innerWidth * 1.75
                    this.height = window.innerHeight * 1.5
                    this.font_size = 1
                } else {
                    this.width = window.innerWidth * 0.5
                    this.height = window.innerHeight * 0.4
                    this.font_size = 0.5
                }
                this.radius = Math.min(this.height, this.width) * 0.15

                this.initTree()
                this.renderChart()
                if(this.selected.taxa == "All"){
                    this.crumbClick("Papilionoidea")
                }
            },
            initTree(){
                var speciesTree = [];
                let tree_data = [];
                
                [...new Set (this.filtered_data.map((d) => d.taxa_id))].map((t) => {
                    let taxa = this.all_taxa.find((d) => d.id == t)
                    let ancestry = this.getAncestry(taxa.ancestry)
                    Object.keys(ancestry).map((a) => taxa[a] = ancestry[a])
                    taxa[taxa.rank] = taxa.name
                    tree_data.push(taxa)
                })

                tree_data.forEach(d => {
                    speciesTree.push([d.superfamily,d.family, d.subfamily, d.tribe, d.genus, d.species])
                })
                this.species_data = this.createTree(speciesTree, "Reset")
                this.root = this.partition(this.species_data)
                this.root.each(d => d.current = d)
            },
            getAncestry(ancestry){
                let ancestors = ancestry.split("/")
                let op = {}
                ancestors.map((a) => {
                    let taxa = this.all_taxa.find((d) => d.id == a)
                    if(this.taxa_levels.indexOf(taxa.rank) != -1){
                        op[taxa.rank] = taxa.name
                    }
                })
                return op
            },
            renderChart(){
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
                        .attr("fill", (d) => {
                            while (d.depth > 2) {
                                d = d.parent
                            }
                            return this.color(d.data.name)
                        })
                        .attr("fill-opacity", (d) => this.arcVisible(d.current) ? (d.children ? 0.3 : 0.1) : 0)
                        .attr("stroke", "white")
            			.attr("stroke-width", (d) => this.arcVisible(d.current) ? (d.children ? "1px" : "1px") : "0px")
            			.attr("d", (d) => arc(d.current))

            	this.path.filter((d) => d.current)
            	    .style("cursor", "pointer")
            		.on("mouseover", (d) => d3.select(d.currentTarget).classed("taxa-selected", true))
            		.on("mouseout", (d) => d3.select(d.currentTarget).classed("taxa-selected",false))
            		.on("click", (event, d) =>  {
                        if(d.depth < 6){
                            this.clicked(d)
                        }
                    })


            	this.path.append("title")
            		.text( (d) => `${d.ancestors().map((d1) => d1.data.name).reverse().join(" > ").replace("Reset > ", "")} - ${d.value}`);

            	this.label = this.g.append("g")
            		.classed("d3-arcs-labels", true)
            		.attr("pointer-events", "none")
            		.attr("text-anchor", "middle")
            		.selectAll("text")
                        .data(this.root.descendants().slice(1))
            			.join("text")
            			.attr("dy", "0.35em")
            			.attr("fill-opacity", d => +this.labelVisible(d.current))
            			.attr("transform", d => this.labelTransform(d.current))
                        .style("font-size", this.font_size.toString() + "rem")
                            .text(d => d.data.name)

                this.parent = this.g.append("circle")
            		.datum(this.root)
            		.attr("r", this.radius)
            		.attr("fill", "none")
            		.attr("pointer-events", "all")
            		.on("click", (event, d) => this.clicked(d))
            },
            clicked(p) {
                var selected_taxon = null
                if(p.data?.name){
                    selected_taxon = p.data.name
                } else {
                    console.log(p)
                }

                if(selected_taxon == 'Reset'){
                    alert("Root of the Tree")
                } else {
                    this.breadcrumbs = this.populate_breadcrumbs(p,[]);
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
                    this.path.transition(t)
    					.tween("data", d => {
    						const i = d3.interpolate(d.current, d.target);
    						return t => d.current = i(t);
    					})
    					.filter((d, i, nodes) => +d3.select(nodes[i]).attr("fill-opacity") || this.arcVisible(d.target))
    					.attr("fill-opacity", (d) => this.arcVisible(d.target) ? (d.children ? 0.6 : 0.4) : 0)
    					.attrTween("d", (d) => () => arc(d.current))
        			this.label.filter((d, i, nodes) =>  +d3.select(nodes[i]).attr("fill-opacity") || this.labelVisible(d.target)).transition(t)
    					.attr("fill-opacity", d => +this.labelVisible(d.target))
    					.attrTween("transform", d => () => this.labelTransform(d.current))
                    store.dispatch('selectTaxa', selected_taxon)
                }
			},
            arcVisible(d){
                return ((d.y1 <= 3) && (d.y0 >= 1) && (d.x1 > d.x0))
            },
            labelVisible(d) {
                return ((d.y1 <= 3) && (d.y0 >= 1) && ((d.y1 - d.y0) * (d.x1 - d.x0) > 0.03))
            },
            labelTransform(d) {
                const x = (d.x0 + d.x1) / 2 * 180 / Math.PI
                const y = (d.y0 + d.y1) / 2 * this.radius
                return `rotate(${x-90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`
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
            partition(data) {
                this.root = d3.hierarchy(data)
                    .sum(d => 1)
                    .sort((a, b) => b.value - a.value)
                return d3.partition()
                    .size([2 * Math.PI, this.root.height + 1])
					(this.root)
			},
            createTree(structure, topItem) {
                const node = (name) => ({name, children: []});
                const top = node(topItem);
                const addNode = (parent, child) => (parent.children.push(child), child);
                const findNamedNode = (name, parent) => {
                    for (const child of parent.children) {
                        if (child.name === name) { return child }
                        const found = findNamedNode(name, child);
                        if (found) { return found }
                    }
				}
                var current;
                for (const children of structure) {
                    current = top;
                    for (const name of children) {
                        const found = findNamedNode(name, current);
                        current = found ? found : addNode(current, node(name, current.name));
                    }
                }

                return this.trimTree(top)
            },
            trimTree(tree){
                let level = 0
                tree.children.forEach((superfamily, sf_id) => {
                    superfamily.children.forEach((family, f_id) => {
                        family.children.forEach((subfamily, su_id) => {
                            subfamily.children.forEach((tribe, t_id) => {
                                tribe.children.forEach((genus, g_id) => {
                                    genus.children.forEach((species, s_id) => {
                                        if(species.name==undefined){
                                            tree.children[sf_id].children[f_id].children[su_id].children[t_id].children[g_id].children.splice(s_id, 1)
                                        }
                                    })
                                })
                            })
                        })
                    })
                })
                return tree
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
                let taxon = ""
                if(text != undefined){
                    taxon = text.charAt(0).toUpperCase() + text.slice(1) + ": "

                }
                return  taxon + "-" + depth
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