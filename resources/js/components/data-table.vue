<style lang="css" scoped>
    #table-container{
        height:  62vh;
        overflow-y: scroll;
        overflow-x: auto;
    }
    /* .table-container .tableFixHead{
        height:100%;
        overflow: scroll;
    } */
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
        background: #ccf;
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
                    <tr v-for="(row, id) in data" :key="id" @click="$emit('rowClick', id)">
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
    props: ["data", "headers"],
    mounted() {
        this.updateHeight()
    },
    data(){
        return {
            height: 0
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
