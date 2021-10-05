<style lang="css" scoped>
    .table-container{
        width:100%;
        height: 100%;
        /*max-width:50vw;
        height: 60vh;*/
        overflow: auto;
    }
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
    <div class="table-container">
        <table class="table tableFixHead">
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
</template>

<script>
export default {
    name:"data-table",
    props: ["data", "headers"],
}
</script>
