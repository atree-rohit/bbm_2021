<style lang="css" scoped>
    #table-container{
        height:  62vh;
        overflow-y: scroll;
        overflow-x: auto;
    }

    .tableFixHead{
        /* overflow: auto; */
        height: 100px;
    }

    .tableFixHead thead th{
        position: sticky;
        top: 0;
        z-index: 1;
        white-space: nowrap;
        background: #cad;
    }
    .tableFixHead thead th:hover{
        background: #b9c;
        cursor: pointer;
    }
    .tableFixHead thead th.sort-col{
        background: #ecd;
        cursor: pointer;
    }
    .tableFixHead tbody tr:hover{
        background: #ffa;
        /* cursor: pointer; */
    }
    .tableFixHead tbody td.sort-col{
        background: #eedccc50;
    }
    .badge {
        margin: 2px!important;
        font-weight: 100!important;
        font-size: .75em;
        border-radius: 3px!important;
        color: #000!important;
    }
    .rounded-pill {
        border-radius: 50rem!important;
    }
    .badge-success {
        border: 1px solid rgba(25,135,84,.5);
        background-color: rgb(195, 230, 203);
    }
    .badge-warning {
        border: 1px solid rgba(255,193,7,.5);
        background-color: rgb(255, 238, 186);
    }
    .badge-info {
        border: 1px solid rgba(13,110,253,.5);
        background-color: rgb(190, 229, 235);
    }
    .badge-danger {
        border: 1px solid rgba(253,110,13,.5);
        background-color: rgb(235, 190, 190);
    }

    .badge-year{
        border: 1px solid rgba(253, 13, 13, 0.5);
        border-radius: 25%;
        background-color: rgba(245, 122, 122, 0.33);
    }
    @media screen and (max-width: 800px) {
        .table-container{
            max-width:95vw;
        }
    }
</style>

<template>
    <div id="table-container">
        <div class="table-height"
             :style="{
                'max-height': `calc(100% - ${tableHeight}px)`
                }"
        >
            <table class="table tableFixHead" ref="container">
                <thead class="">
                    <tr>
                        <th v-for="(h, i) in headers"
                            :class="{ 'sort-col': currentSort==h[1], 'text-center': i>0 }"
                            :key="i"
                            v-text="headerText(h)"
                            @click="sort(h[1])"
                        ></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(row, id) in sortedData"
                        :key="id"
                    >
                        <td v-for="(h, i) in headers"
                            :key="i"
                            :class="{ 'sort-col': currentSort==h[1], 'text-center': i > 0 }"
                        >
                            <template v-if="h[1] == 'portals'">
                                <span
                                    v-for="p in row[h[1]]"
                                    :key="p"
                                    class="badge rounded-pill mx-1"
                                    :class="badgeClass(p)"
                                    v-text="p"
                                />
                            </template>
                            <template v-else-if="h[1] == 'years'">
                                <span
                                    v-for="p in row[h[1]]"
                                    :key="p"
                                    class="badge rounded-pill mx-1 badge-year"
                                    v-text="p"
                                />
                            </template>
                            <template v-else>
                                {{row[h[1]]}}
                            </template>

                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
export default {
    name: "DataTable22",
    props: ["data", "headers", "sort_col", "sort_dir"],

    mounted() {
        this.updateHeight()
    },
    data(){
        return {
            height: 0,
            selected_rows:[],
            currentSort:this.sort_col,
            sortDir:this.sort_dir
        }
    },
    watch:{
        selected (newVal) {
            this.selected_rows = []
            this.data.forEach((r,id) => {
                if(newVal.indexOf(r[this.selected_col]) != -1)
                    this.selected_rows.push(id)
            })
        },
        data(newVal){
            console.log("newVal", newVal)
            console.log(this.sortedData)
        }
    },
    computed: {
        tableHeight() {
            const tableDOM = document.getElementById("table-container");
            return tableDOM ? tableDOM.offsetHeight : 0;
        },
        sortedData() {
            return this.data.sort((a,b) => {
                let modifier = 1;
                if(this.sortDir === 'desc') modifier = -1;
                if(a[this.currentSort] < b[this.currentSort]) return -1 * modifier;
                if(a[this.currentSort] > b[this.currentSort]) return 1 * modifier;
                return 0;
            })
        }
    },
    methods:{
        updateHeight(){
            this.height = this.$refs.container.getBoundingClientRect().top
        },
        badgeClass(p){
            let op  = ""
            switch(p){
                case "inat" : op = 'badge-success'
                    break
                case "ibp" : op = 'badge-warning'
                    break
                case "counts" : op = 'badge-info'
                    break
                case "ifb" : op = 'badge-danger'
                    break
            }
            return op
        },
        headerText(h) {
            let op = h[0]
            if(this.currentSort == h[1]) {
                if(this.sortDir == 'asc') {
                    op += " ▲"
                } else {
                    op += " ▼"
                }
            }
            return op
        },
        sort(s) {
            if(s === this.currentSort){
                this.sortDir = this.sortDir==='asc'?'desc':'asc'
            }
            this.currentSort = s
        }
    }
}
</script>
