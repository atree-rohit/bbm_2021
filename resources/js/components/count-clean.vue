<template>
    <div>
        <table class="table table-sm">
            <tbody>
                <tr v-for="row in count_rows" :key="row.id">
                    <td v-text="row.id"></td>
                    <td v-text="row.count_id"></td>
                    <td v-text="row.user_name"></td>
                    <td v-text="row.state"></td>
                    <td v-text="row.place_guess"></td>
                    <td v-text="row.location"></td>
                    <td v-text="row.date"></td>
                    <td v-text="row.taxa_id"></td>
                    <td v-text="row.taxa_name"></td>
                    <td v-text="row.taxa_rank"></td>
                    <td v-text="row.individuals"></td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
<script>
import axios from 'axios';
	export default {
		name:"i-nat-taxa",
		props: ["count_rows", "inat_taxa"],
		data() {
            return {

            }
        }
    };
</script>