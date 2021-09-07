import Vue from 'vue'
import moment from 'moment'

import ButterflyCounts from './components/butterfly-counts'
Vue.prototype.moment = moment

const app = new Vue({
    el: '#app',
    components: {ButterflyCounts},
    data() {
        return{
        }
    },
    methods: {}
});
