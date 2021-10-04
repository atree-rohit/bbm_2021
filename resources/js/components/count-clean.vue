<style scoped>
    .table th, 
    .table td{
        white-space: nowrap;
    }
    .ui-modal__body{
        height: 75vh;
    }
</style>
<template>
    <div>
        <table class="table table-sm">
            <thead>
                <th v-for="h in cols" v-text="h"></th>
            </thead>
            <tbody>
                <tr v-for="row in count_rows" :key="row.id" @click="selectRow(row)" v-if="row.latitude == null">
                    <td v-for="h in cols" v-text="row[h]" :class="cellClass(row, h)"></td>
                    <td v-text="latLong(row)"></td>
                </tr>
            </tbody>
        </table>
        <ui-modal ref="update-data-modal" title="Set / Update Count Form Details">
            <ui-textbox disabled label="id" v-model="selected_row.id"></ui-textbox>
            <ui-textbox disabled label="name" v-model="selected_row.name"></ui-textbox>
            <ui-textbox disabled label="location" v-model="selected_row.location"></ui-textbox>
            <ui-textbox disabled label="state" v-model="selected_row.state"></ui-textbox>
            <ui-textbox disabled label="coordinates" v-model="selected_row.coordinates"></ui-textbox>
            <ui-textbox label="latitude" v-model="selected_row.latitude"></ui-textbox>
            <ui-textbox label="longitude" v-model="selected_row.longitude"></ui-textbox>
            <ui-textbox disabled label="date" v-model="selected_row.date"></ui-textbox>
            <ui-textbox label="date_cleaned" v-model="selected_row.date_cleaned"></ui-textbox>
            <ui-textbox disabled label="validated" v-model="selected_row.validated"></ui-textbox>
            <ui-textbox disabled label="created_at" v-model="selected_row.created_at"></ui-textbox>
             <!-- <pre>
                 {{selected_row}}
                 {{latLong(selected_row)}}
             </pre> -->
            <ui-button color="green" raised @click="">Submit</ui-button>
        </ui-modal>
    </div>
</template>
<script>
import axios from 'axios'
import moment from 'moment'
	export default {
		name:"i-nat-taxa",
		props: ["count_rows", "inat_taxa"],
		data() {
            return {
                cols:["id", "name", "location", "state", "coordinates", "latitude", "longitude"],
                skip_cell_class_array: ["latitude", "longitude"],
                selected_row:{}
            }
        },
        mounted(){
        },
        methods:{
            selectRow(row){
                this.selected_row = row
                if(this.latLong(row) != undefined){
                    this.selected_row.latitude = this.latLong(row)[0]
                    this.selected_row.longitude = this.latLong(row)[1]
                }
                this.selected_row.date_cleaned = moment(row.date).format("DD-MM-YYYY")
                this.openModal('update-data-modal')
            },
            cellClass (row, h) {
                let op = row[h]
                if (this.skip_cell_class_array.indexOf(h) == -1) {
                    if (row[h] == null) {
                        op = "bg-danger"                    
                    }
                }
                return op
            },
            latLong(row){
                let op = row.coordinates
                if(op != null){
                    op = op.replace("°N", "").replace("°E", "").replace("to", ",").split(",")
                }
                return op
            },
            openModal (ref) {
                //
                this.$refs[ref].open();
            },
            closeModal (ref) {
                //
                this.$refs[ref].close();
            },
        }
    };
</script>