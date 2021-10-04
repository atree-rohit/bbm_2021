<template>
    <div>
        <table class="table table-sm">
            <thead>
                <th v-for="(r,h) in count_rows[0]" v-text="h"></th>
            </thead>
            <tbody>
                <tr v-for="row in count_rows" :key="row.id">
                    <td v-for="(r,h) in count_rows[0]" v-text="row[h]"></td>
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