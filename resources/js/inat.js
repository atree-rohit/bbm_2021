import Vue from 'vue'
import moment from 'moment'
import * as d3 from "d3"
import * as d3Legend from "d3-svg-legend"
import KeenUI from 'keen-ui';
import 'keen-ui/dist/keen-ui.css';

Vue.use(KeenUI);
window.d3 = d3
window.d3Legend = d3Legend

import iNat from './components/i-nat'

Vue.prototype.moment = moment

const app = new Vue({
    el: '#app',
    components: {iNat},
    data() {
        return{
        }
    },
    methods: {}
});
