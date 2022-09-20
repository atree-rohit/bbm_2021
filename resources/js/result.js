import Vue from 'vue'
import moment from 'moment'
import * as d3 from "d3"
import KeenUI from 'keen-ui';
import 'keen-ui/dist/keen-ui.css';

Vue.use(KeenUI);
window.d3 = d3

import Result from './components/result'

Vue.prototype.moment = moment

const app = new Vue({
    el: '#app',
    components: {Result},
    data() {
        return{
        }
    },
    methods: {}
});
