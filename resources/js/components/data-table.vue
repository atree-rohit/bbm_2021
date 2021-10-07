<style lang="css" scoped>
    #table-container{
        height:  62vh;
        overflow-y: scroll;
        overflow-x: auto;
    }
    
    /*#table-container::-webkit-scrollbar-track
    {
        -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
        border-radius: 10px;
        background-color: #F5F5F5;
    }

    #table-container::-webkit-scrollbar
    {
        width: 7px;
        background-color: #F5F5F5;
    }

    #table-container::-webkit-scrollbar-thumb
    {
        border-radius: 10px;
        -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
        background-color: #a7c;
    }*/
    .tableFixHead{
        /* overflow: auto; */
        height: 100px;
    }
    .tableFixHead thead{

    }
    .tableFixHead thead th{
        position: sticky;
        top: 0;
        z-index: 1;
        white-space: nowrap;
        background: #cad;
    }
    .tableFixHead tbody tr:hover{
        background: #ffa;
        cursor: pointer;
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
            
            <table class="table tableFixHead"ref="container">
                <thead class="">
                    <tr>
                        <th v-for="h in headers" :key="h[1]" v-text="h[0]"></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(row, id) in data"
                        :key="id"
                        :class="selected_rows.indexOf(id) != -1? 'bg-success':''"
                        @click="$emit('rowClick', id)"
                    >
                        <td v-for="h in headers"
                            :key="h[1]"
                            v-text="row[h[1]]"
                            ></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
export default {
    name: "data-table",
    props: ["data", "headers", "selected", "selected_col"],

    mounted() {
        this.updateHeight()
    },
    data(){
        return {
            height: 0,
            selected_rows:[],
        }
    },
    watch:{
        selected (newVal) {
            this.selected_rows = []
            this.data.forEach((r,id) => {
                if(newVal.indexOf(r[this.selected_col]) != -1)
                    this.selected_rows.push(id)
            })
        }
    },
    computed: {
        tableHeight() {
            const tableDOM = document.getElementById("table-container");
            return tableDOM ? tableDOM.offsetHeight : 0;
        },
    },
    methods:{
        updateHeight(){
            // this.height = this.$refs.container.offsetTop
            this.height = this.$refs.container.getBoundingClientRect().top
        }
    }
}
</script>
