import axios from 'axios'
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        taxa: {},
        all_portal_data: [],
        all_data: [],
        district_lists: [],
        selected: {
            portals: "All",
            years: "All",
            state: "All",
            date: "All",
            species: "All",
        },
        filtered_data: [],
        filtered_taxa: [],
    },
    mutations: {
        SET_DATA(state, data){
            // $op[$state][$district][$year][$portal][$row["taxa_id"]][] = [$user_id, $row["date"], 1];
            state.taxa = data.taxa
            state.district_lists = {}
            state.all_data = []
            let all_data = []
            let district_lists = {}
            
            Object.keys(data.data).forEach((state) => {
                Object.keys(data.data[state]).forEach((district) => {
                    Object.keys(data.data[state][district]).forEach((year) => {
                        if(!district_lists[state]){
                            district_lists[state] = {}
                        }
                        if(!district_lists[state][district]){
                            district_lists[state][district] = {}
                        }
                        if(!district_lists[state][district][year]){
                            district_lists[state][district][year] = {}
                        }
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
                                    
                                    if(!district_lists[state][district][year][taxa]){
                                        district_lists[state][district][year][taxa] = {
                                            portals: new Set(),
                                            users: new Set(),
                                            count: 0
                                        }
                                    } 
                                    district_lists[state][district][year][taxa].portals.add(portal)
                                    district_lists[state][district][year][taxa].users.add(row[0])
                                    district_lists[state][district][year][taxa].count += row[2]
                                    
                                    
                                })
                            })
                        })
                    })
                })
            })
            state.all_data = all_data
            state.district_lists = district_lists
            console.log("fetching data - Set_data complete")
        },
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

                if (state.selected.species != "All" && d.taxa_id != state.selected.species){
                    return false
                }
                return true
            })
            console.log("fetching data - filtered_data complete")
        },
        SET_FILTERED_TAXA(state) {
            let all_taxa = state.all_data.map((d) => parseInt(d.taxa_id)).sort()
            state.filtered_taxa = Object.values(state.taxa).filter((t) => all_taxa.includes(t.id))
            console.log("fetching data - filtered_taxa complete")
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