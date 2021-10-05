<style scoped>

    .table th,
    .table td{
        white-space: nowrap;
    }
    .highlight-cell{
        background: #dfd;
        padding:10px 2px;
        border: 2px solid #9f9;
        border-radius: 10px;
        margin-bottom:2px;
    }
    .switch input {
        position: absolute;
        opacity: 0;
    }

    .switch {
        display: inline-block;
        font-size: 20px; /* 1 */
        height: 1em;
        width: 2em;
        background: #BDB9A6;
        border-radius: 1em;
    }

    .switch div {
        height: 1em;
        width: 1em;
        border-radius: 1em;
        background: #FFF;
        box-shadow: 0 0.1em 0.3em rgba(0,0,0,0.3);
        -webkit-transition: all 300ms;
         -moz-transition: all 300ms;
              transition: all 300ms;
    }

    .switch input:checked + div {
        -webkit-transform: translate3d(100%, 0, 0);
         -moz-transform: translate3d(100%, 0, 0);
              transform: translate3d(100%, 0, 0);
    }
    .switch-label{
        padding: 5px;
        border-radius: 5px;
        transition: all .5s;
    }
    .switch-selected{
        background: #beb;
    }
    #table-toggle-div > span,
    #table-toggle-div > label{
        transition: all .25s;
    }
    #table-toggle-div > span:hover,
    #table-toggle-div > label:hover{
        cursor: pointer;

        box-shadow: 2px 2px 5px #550;
    }

</style>
<template>
    <div>
        <div id="table-toggle-div" class="d-flex justify-content-center my-3">
            <span class="switch-label" :class="!table_switch?'switch-selected':''" @click="table_switch=false">Count Forms</span>
            <label class="switch mx-3 my-auto"><input type="checkbox" v-model="table_switch"/>
                <div></div>
            </label>
            <span class="switch-label" :class="table_switch?'switch-selected':''" @click="table_switch=true">Form Rows</span>
        </div>
        <div>
            <data-table :data="table_rows"
                :headers='form_headers'
                @rowClick="selectFormRow"
                v-if="!table_switch"
            />
            <data-table :data="form_rows"
                :headers='row_headers'
                @rowClick="selectRowRow"
                v-if="table_switch"
            />

        </div>
        <ui-modal ref="update-form-modal" title="Set / Update Count Form Details">
            <template v-for="fc in form_cols">
                <ui-textbox v-model="selected_form[fc]"
                            disabled
                            floating-label
                            :key="fc"
                            v-if="form_edit_fields.indexOf(fc) == -1"
                            :label="fc"
                            ></ui-textbox>
                <ui-textbox v-model="selected_form[fc]"
                            :key="fc"
                            v-else
                            :label="fc"
                            class="highlight-cell"
                            ></ui-textbox>
            </template>
            <ui-button color="green" raised @click="updateForm">Submit</ui-button>
        </ui-modal>
        <ui-modal ref="update-row-modal" title="Set / Update Form Row Details">
            <template v-for="rc in row_cols">
                <ui-textbox v-model="selected_row[rc]"
                            disabled
                            floating-label
                            :key="rc"
                            v-if="row_edit_fields.indexOf(rc) == -1"
                            :label="rc"
                            ></ui-textbox>
                <ui-textbox v-model="selected_row[rc]"
                            :key="rc"
                            v-else
                            :label="rc"
                            class="highlight-cell"
                            ></ui-textbox>
            </template>
            <ui-button color="green" raised @click="updateRow">Submit</ui-button>
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
                form_cols:["id","name","location","state","coordinates","latitude","longitude","date","date_cleaned","comments","flag","validated","created_at"],
                form_headers: [
                    ["ID", "id"],
                    ["Name", "name"],
                    ["Location", "location"],
                    ["State", "state"],
                    ["Coordinates", "coordinates"],
                    ["Latitude", "latitude"],
                    ["Longitude", "longitude"],
                    ["Date", "date"],
                    ["Date Cleaned", "date_cleaned"],
                    ["Comments", "comments"],
                    ["Flag", "flag"],
                    ["Validated", "validated"],
                    ["Created at", "created_at"]
                ],
                form_edit_fields: ["latitude", "longitude", "date_cleaned", "flag", "validated"],
                row_cols: ["row_id", "common_name", "scientific_name", "scientific_name_cleaned", "id_quality", "individuals", "no_of_individuals_cleaned", "flag"],
                row_headers: [
                    ["Form ID", "form_id"],
                    ["Row ID", "row_id"],
                    ["Sl No", "sl_no"],
                    ["Common Name", "common_name"],
                    ["Scientific Name", "scientific_name"],
                    ["Scientific Name Cleaned", "scientific_name_cleaned"],
                    ["Individuals", "individuals"],
                    ["Individuals Cleaned", "no_of_individuals_cleaned"],
                    ["ID Rank", "id_quality"],
                    ["Remarks", "remarks"],
                    ["Flag", "flag"]
                ],
                row_edit_fields: ["scientific_name_cleaned", "id_quality", "no_of_individuals_cleaned", "flag"],
                selected_form:{},
                selected_row:{},
                table_rows: [],
                table_switch: true,
            }
        },
        mounted(){
            this.table_rows = this.count_rows
        },
        computed:{
            form_rows () {
                let op = []
                this.table_rows.forEach(f => {
                    f.rows.forEach(r => {
                        if(r.flag == 0){
                            op.push({
                                form_id: f.id,
                                row_id: r.id,
                                sl_no: r.sl_no,
                                common_name: r.common_name,
                                scientific_name: r.scientific_name,
                                scientific_name_cleaned: r.scientific_name_cleaned,
                                individuals: r.individuals,
                                no_of_individuals_cleaned: r.no_of_individuals_cleaned,
                                id_quality: r.id_quality,
                                remarks: r.remarks,
                                flag: r.flag
                            })
                        }
                    })

                })

                return op
            }
        },
        methods:{
            selectFormRow (row_id) {
                // let row = JSON.parse(JSON.stringify(this.table_rows[row_id]))
                let row = this.table_rows[row_id]

                this.selected_form = row
                if(this.latLong(row) != undefined){
                    if (this.selected_form.latitude == null) {
                        this.selected_form.latitude = this.latLong(row)[0]
                    }
                    if (this.selected_form.longitude == null) {
                        this.selected_form.longitude = this.latLong(row)[1]
                    }
                }
                if(moment(row.date).isValid){
                    this.selected_form.date_cleaned = moment(row.date).format("DD-MM-YYYY")
                } else {
                    alert(row.date)
                }
                this.openModal('update-form-modal')
            },
            updateForm () {
                const axios = require('axios')
				let post_data = this.selected_form
				var that = this

				axios.post('/butterfly_count/update_count', post_data)
				.then((response) => {
					if(response.status == 200){
                        that.updateFormData(response.data)
						that.closeModal('update-form-modal')
					}
				})
				.catch((error) => {
					console.log(error)
				})
            },
            updateFormData (d) {
                this.table_rows.forEach((r,k) => {
                    if ( r.id == d.id ){
                        this.table_rows[k] = d
                        // console.log(this.table_rows[k])
                    }
                })
            },
            selectRowRow (row_id) {
                let row = this.form_rows[row_id]
                this.selected_row = row

                if(row.scientific_name != null){
                    this.selected_row.scientific_name_cleaned = row.scientific_name
                    if(row.scientific_name.split(" ").length > 1){
                        this.selected_row.id_quality = "species"
                    }
                }
                if(row.individuals != null){
                    this.selected_row.no_of_individuals_cleaned = parseInt(row.individuals)
                }

                this.openModal('update-row-modal')
            },
            updateRow () {
                const axios = require('axios')
				let post_data = this.selected_row
                let that = this

				axios.post('/butterfly_count/update_row', post_data)
				.then((response) => {
					if(response.status == 200){
                        that.updateRowData(response.data)
						that.closeModal('update-row-modal')
					}
				})
				.catch((error) => {
					console.log(error)
				})
                .then( () => location.reload() )
            },
            updateRowData (d) {
                console.log(d)
                this.table_rows.forEach((r,k) => {
                    if ( r.id == d.count_form_id ){
                        this.table_rows[k].rows.forEach((s,sno) => {
                            if(this.table_rows[k].rows[sno].id == d.id){
                                this.table_rows[k].rows[sno] = d
                            }

                        })
                    }
                })
            },
            latLong (row) {
                let op = row.coordinates
                if(op != null){
                    op = op.replace("°N", "").replace("°E", "").replace("to", ",").split(",")
                }
                return op
            },
            openModal (ref) {
                //
                this.$refs[ref].open()
            },
            closeModal (ref) {
                this.selected_form = {}
                this.selected_row = {}
                this.$refs[ref].close()
            },
        }
    };
</script>