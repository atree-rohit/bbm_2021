import Vue from 'vue'
import moment from 'moment'
import * as d3 from "d3"
import store from './store/index_2022'

window.d3 = d3

import Result from './components/result_2022'

Vue.prototype.moment = moment

const app = new Vue({
    el: '#app',
    store,
    components: {Result},
    data() {
        return{
        }
    },
    methods: {}
});
