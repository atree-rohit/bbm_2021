<style lang="css" scoped>
    .table-container{
        width:100%;
        height: 60vh;
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
</style>

<template>
    <div class="table-container">
        <table class="table tableFixHead all-states-table">
            <thead class="">
                <tr>
                    <th v-for="h in headers" :key="h[1]" v-text="h[0]"></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(row, id) in data" :key="id">
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
