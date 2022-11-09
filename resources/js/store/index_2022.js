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
            years: 2020,
            state: "All",
            date: "All",
            species: "All",
        },
        filtered_data: [],
        filtered_taxa: [],
    },
    mutations: {
        SET_TAXA(state, taxa) {
            state.taxa = taxa
        },
        SET_ALL_PORTAL_DATA(state, all_portal_data) {
            state.all_data = []
            state.all_portal_data = all_portal_data
            Object.keys(all_portal_data).forEach((portal) => {
                Object.keys(all_portal_data[portal]).forEach((ind_state) => {
                    Object.keys(all_portal_data[portal][ind_state]).forEach((district) => {
                        state.all_data.push(all_portal_data[portal][ind_state][district].map((data) => {
                            return {
                                portal: portal,
                                state: ind_state,
                                district: district,
                                ...data
                            }
                        }))
                    })
                })
            })
            state.all_data = state.all_data.flat()
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
                
                if (state.selected.portals != "All" && d.portal != state.selected.portals) {
                    return false
                }

                if (state.selected.state != "All" && d.state != state.selected.state) {
                    return false
                }

                if (state.selected.date != "All" && d.date != state.selected.date) {
                    return false
                }

                if (state.selected.species != "All" && d.taxa_id != state.selected.species){
                    return false
                }
                return true
            })
        },
        SET_FILTERED_TAXA(state) {
            let all_taxa = state.filtered_data.map((d) => d.taxa_id).sort()
            state.filtered_taxa = Object.values(state.taxa).filter((t) => all_taxa.includes(t.id))
        }
    },
    actions: {
        fetchTaxa({commit}) {
            return axios.get('/api/taxa')
                .then((response) => {
                    commit('SET_TAXA', response.data)
                })
        },
        fetchAllPortalData({commit}, year) {          
            return axios.get('/api/data/'+ year )
                .then((response) => {
                    commit('SET_ALL_PORTAL_DATA', response.data)
                })
                .then(() => commit('SET_FILTERED_DATA'))
                .then(() => commit('SET_FILTERED_TAXA'))
        },
        setSelected({commit}, payload) {
            console.log("setSelected", payload)
            commit('SET_SELECTED', payload)
            commit('SET_FILTERED_DATA')
        }
    },
})

export default store