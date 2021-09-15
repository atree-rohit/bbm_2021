import Vue from 'vue'
import moment from 'moment'

import iNatObservation from './components/i-nat-observation'
import iNatTaxa from './components/i-nat-taxa'
Vue.prototype.moment = moment

const app = new Vue({
    el: '#app',
    components: {iNatObservation, iNatTaxa},
    data() {
        return{
        }
    },
    methods: {}
});
