import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        count: 0,
        taxa: {},
        all_portal_data: [],
        selected: {
            years: [],
            portals:[],
            users: [],
            dates: [],
            taxa_levels: [],
            taxa: [],
            area: {
                region: "All",
                state: "All",
                district: "All",
            },
        }
    },
    mutations: {
        SET_TAXA(state, taxa) {
            state.taxa = taxa
        },
        SET_ALL_PORTAL_DATA(state, all_portal_data) {
            state.all_portal_data = all_portal_data
        },
        SET_SELECTED(state, data) {
            console.log("mutation set-selected: ", data)
            state.selected[data.type] = data.selected
        },
        SET_SELECTED_AREA(state, data) {
            console.log("mutation set-selected-area: ", data)
            state.selected.area[data.type] = data.selected
        },
        ADD_SELECTED(state, data) {
            console.log("mutation add-selected:", data)
            state.selected[data.type].push(data.selected)
        },
        REMOVE_SELECTED(state, data) {
            console.log("mutation remove-selected:", data)
            state.selected[data.type] = state.selected[data.type].filter(item => item !== data.selected)
        }
    },
    actions: {
        fetchTaxa({commit}) {
            return axios.get('/api/taxa')
                .then((response) => {
                    commit('SET_TAXA', response.data)
                })
        },
        fetchAllPortalData({commit}) {          
            return axios.get('/api/data')
                .then((response) => {
                    commit('SET_ALL_PORTAL_DATA', response.data)
                })
        },
        setSelected({commit}, payload) {
            if(Array.isArray(payload.selected)) {
                commit('SET_SELECTED', payload)
            } else {
                commit('ADD_SELECTED', payload)
            }
        },
        setSelectedArea({commit}, payload) {
            commit('SET_SELECTED_AREA', payload)
        },
        removeSelected({commit}, payload) {
            commit('REMOVE_SELECTED', payload)
        }
    },
})

export default store