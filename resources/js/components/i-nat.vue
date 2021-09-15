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
				:selected="tab.title === 'Taxonomy'"
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
						LOCATION
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
	export default {
		name:"i-nat",
		props: ["inat_data", "inat_taxa"],
		data() {
			return{
				user_data:{},
				date_data:{},
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
			}
		},
		created() {
		},
		mounted() {
			this.init();
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
			init(){
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
					if(Object.keys(this.taxa_level).indexOf(o.taxa_rank) != -1){
						this.taxa_level[o.taxa_rank].push(o)
					} else {
						this.$set(this.taxa_level,o.taxa_rank,[o])
					}
				})
				this.tabChanged({title:"superfamily "});
			}
		}
	};
</script>
