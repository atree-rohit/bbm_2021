import Vue from 'vue'
import moment from 'moment'
import KeenUI from 'keen-ui';
import 'keen-ui/dist/keen-ui.css';

Vue.use(KeenUI);

import CountClean from './components/count-clean'

Vue.prototype.moment = moment

const app = new Vue({
    el: '#app',
    components: {CountClean},
    data() {
        return{
        }
    },
    methods: {}
});
