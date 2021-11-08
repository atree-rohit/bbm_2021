import Vue from 'vue'
import moment from 'moment'

import BoiFixTaxa from './components/boi-fix-taxa'
Vue.prototype.moment = moment

const app = new Vue({
    el: '#app',
    components: {BoiFixTaxa},
    data() {
        return{
        }
    },
    methods: {}
});
