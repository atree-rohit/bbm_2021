import axios from 'axios'
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        taxa: {},
        all_portal_data: [],
        all_data: [],
        selected: {
            portals: "All",
            years: "All",
            state: "All",
            date: "All",
            taxa: "All"
        },
        filtered_data: [],
        filtered_taxa: [],
    },
    mutations: {
        SET_DATA(state, data){
            state.taxa = data.taxa
            let all_data = []
            
            Object.keys(data.data).forEach((state) => {
                Object.keys(data.data[state]).forEach((district) => {
                    Object.keys(data.data[state][district]).forEach((year) => {
                        Object.keys(data.data[state][district][year]).forEach((portal) => {
                            Object.keys(data.data[state][district][year][portal]).forEach((taxa) => {
                                Object.keys(data.data[state][district][year][portal][taxa]).forEach((r) => {
                                    let row = data.data[state][district][year][portal][taxa][r]
                                    all_data.push({
                                        state: state,
                                        district: district,
                                        year: parseInt(year),
                                        portal: portal,
                                        taxa_id: parseInt(taxa),
                                        user_id: row[0],
                                        date: row[1],
                                        count: row[2]
                                    })                                    
                                })
                            })
                        })
                    })
                })
            })
            state.all_data = all_data
            console.log("fetching data - Set_data complete")
        },
        SET_SELECTED(state, selected) {
            if(selected.filter == "species"){
                let species_name = selected.value
                if(selected.value == "All"){
                    state.selected.species = "All"
                } else {
                    if(species_name.includes("(")){
                        species_name = species_name.split("(")[0].trim()
                    }
                    state.selected.species = state.filtered_taxa.filter((t) => t.name == species_name)[0].id
                }
            } else {
                state.selected[selected.filter] = selected.value
            }
        },
        SET_FILTERED_DATA(state) {            
            state.filtered_data = state.all_data.filter((d) => {

                if (state.selected.years != "All" && d.year != state.selected.years) {
                    return false
                }
                
                if (state.selected.portals != "All" && d.portal != state.selected.portals) {
                    return false
                }

                if (state.selected.state != "All" && d.state != state.selected.state) {
                    return false
                }

                if (state.selected.date != "All" && d.date != state.selected.date) {
                    return false
                }

                if (state.selected.taxa != "All"){
                    let ancestry = state.taxa.find((t) => t.id == d.taxa_id).ancestry
                    return ancestry.includes(state.selected.taxa.toString())
                }
                return true
            })
            console.log("fetching data - filtered_data complete")
        },
        SET_FILTERED_TAXA(state) {
            let all_taxa = [...new Set(state.filtered_data.map((d) => parseInt(d.taxa_id)))]
            let all_taxa_set = new Set(all_taxa)
            let levels = ['family', 'superfamily', 'genus', 'species', 'subfamily', 'tribe']
            all_taxa.map((t) => {
                state.taxa.find((taxa) => taxa.id == t).ancestry
                    .split("/")
                    .map((a) => parseInt(a))
                    .map((a) => all_taxa_set.add(a))
            })
            all_taxa = [...all_taxa_set]
            state.filtered_taxa = Object.values(state.taxa)
                .filter((t) => all_taxa.includes(t.id) && levels.includes(t.rank))
            
            // console.log(all_taxa, all_taxa_set, state.filtered_taxa)
            console.log("fetching data - filtered_taxa complete")
        },
        SELECT_TAXA(state, taxa_name){
            let name = ""
            if(taxa_name.includes("(")){
                name = taxa_name.split("(")[0].trim()
            } else {
                name = taxa_name
            }
            state.selected.taxa = state.taxa.filter((t) => t.name == name)[0].id
        }
    },
    actions: {
        fetchData({commit}){
            console.log("fetching data - Start")
            return axios.get('/api/grouped_data')
                .then((response) => commit('SET_DATA', response.data))
                .then(() => commit('SET_FILTERED_DATA'))
                .then(() => commit('SET_FILTERED_TAXA'))
        },
        setSelected({commit}, payload) {
            console.log("setSelected", payload)
            if(payload.filter == "taxa"){
                commit('SELECT_TAXA', payload.value)
            } else {
                commit('SET_SELECTED', payload)
            }
            commit('SET_FILTERED_DATA')
        },
        selectTaxa({commit}, payload){
            console.log("selectTaxa", payload)
            commit('SELECT_TAXA', payload)
            commit('SET_FILTERED_DATA')
        }
    },
})

export default store