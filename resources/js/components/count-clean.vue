<style scoped>
    .table-container{
        max-height: 90vh;
        overflow: scroll;
    }
    .table th, 
    .table td{
        white-space: nowrap;
    }
    /*.ui-modal__body{
        height: 75vh;
    }*/
</style>
<template>
    <div>
        <div id="table-container">
            <data-table :data="count_rows"
                :headers='form_headers'
                @rowClick="selectRow"
            />
            
        </div>
        <!-- <table class="table table-sm">
            <thead>
                <th v-for="h in form_cols" v-text="h"></th>
            </thead>
            <tbody>
                <tr v-for="row in count_rows" :key="row.id" @click="selectRow(row)" v-if="row.latitude == null">
                    <td v-for="h in form_cols" v-text="row[h]" :class="cellClass(row, h)"></td>
                </tr>
            </tbody>
        </table> -->
        <ui-modal ref="update-data-modal" title="Set / Update Count Form Details">
            <template v-for="fc in form_cols">
                <ui-textbox v-model="selected_row[fc]"
                            disabled
                            :key="fc"
                            v-if="form_edit_fields.indexOf(fc) == -1"
                            :label="fc"
                            ></ui-textbox>
                <ui-textbox v-model="selected_row[fc]"
                            :key="fc"
                            v-else
                            :label="fc"
                            class="bg-success"
                            ></ui-textbox>
            </template>

            
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
import DataTable from './data-table'
	export default {
		name:"i-nat-taxa",
		props: ["count_rows", "inat_taxa"],
        components: { DataTable },
		data() {
            return {
                form_cols:["id","name","location","state","coordinates","latitude","longitude","date","date_cleaned","start_time","end_time","altitude","distance","weather","comments","file","original_filename","flag","validated","created_at"],
                form_headers: [["ID", "id"], ["Name", "name"], ["Location", "location"], ["State", "state"], ["Coordinates", "coordinates"], ["Latitude", "latitude"], ["Longitude", "longitude"], ["Date", "date"], ["Date Cleaned", "date_cleaned"], ["Start Time", "start_time"], ["End Time", "end_time"], ["Altitude", "altitude"], ["Distance", "distance"], ["Weather", "weather"], ["Comments", "comments"], ["File", "file"], ["Original File", "original_filename"], ["Flag", "flag"], ["Validated", "validated"], ["Created at", "created_at"]],
                skip_cell_class_array: ["latitude", "longitude"],
                form_edit_fields: ["latitude", "longitude", "date_cleaned", "flag", "validated"],
                selected_row:{}
            }
        },
        mounted(){
        },
        methods:{
            selectRow(row_id){
                let row = this.count_rows[row_id]
                
                this.selected_row = row
                if(this.latLong(row) != undefined){
                    this.selected_row.latitude = this.latLong(row)[0]
                    this.selected_row.longitude = this.latLong(row)[1]
                }
                if(moment(row.date).isValid){
                    this.selected_row.date_cleaned = moment(row.date).format("DD-MM-YYYY")
                } else {
                    alert(row.date)
                }
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