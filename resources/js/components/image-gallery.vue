<style scoped>
    #gallery{
        /* Prevent vertical gaps */
        /*line-height: 0;*/

        -webkit-column-count: 3;
        -webkit-column-gap:   2px;
        -moz-column-count:    3;
        -moz-column-gap:      2px;
        column-count:         3;
        column-gap:           2px;
    }

    #gallery div {
        /* Just in case there are inline attributes */
        width: 100% !important;
        height: auto !important;
        margin: 2px;
    }
    .observation-img{
        position: relative;
    }
    .observation-img .gallery-item-overlay {
        background: rgba(0,0,0,0.7);
        position: absolute;
        height: 99%;
        width: 100%;
        left: 0;
        top: 0;
        bottom: 0;
        right: 0;
        opacity: 0;
        -webkit-transition: all 0.3s ease-in-out 0s;
        -moz-transition: all 0.3s ease-in-out 0s;
        transition: all 0.3s ease-in-out 0s;
    }

    .observation-img:hover .gallery-item-overlay{
        opacity: 1;
    }

    .observation-img .gallery-item-image{
        width: 100%;
    }

    .observation-img .gallery-item-details {
        position: absolute;
        text-align: center;
        padding-left: 1em;
        padding-right: 1em;
        width: 100%;
        bottom: 0%;
        /* left: 50%; */
        opacity: 0;
        /* -webkit-transform: translate(-50%, -50%);
        -moz-transform: translate(-50%, -50%);
        transform: translate(-50%, -50%); */
        -webkit-transition: all 0.2s ease-in-out 0s;
        -moz-transition: all 0.2s ease-in-out 0s;
        transition: all 0.2s ease-in-out 0s;
    }

    .observation-img:hover .gallery-item-details{
        /* top: 50%;
        left: 50%; */
        opacity: 1;
        color:  #aaa;
    }

    .gallery-item-details .table-sm,
    .gallery-item-details tr,
    .gallery-item-details td
    {
        padding: 1px;
        margin: 0;
    }
    .place-cell{
        font-size: .6rem;
    }
    .gallery-caption-icon{
        font-size: .9rem;
    }
    @media screen and (max-width: 800px) {
		#gallery {
  			-webkit-column-count: 2;
			-webkit-column-gap:   1px;
			-moz-column-count:    2;
			-moz-column-gap:      1px;
			column-count:         2;
			column-gap:           1px;
		}
	}
</style>

<template>
    <div id="gallery">
        <div v-for="o in observations">
            <div class="observation-img">
                 <div class="gallery-item-overlay"></div>
                 <img class="gallery-item-image" :src="imgUrl(o)">
                 <div class="gallery-item-details">
                    <table class="table table-sm text-light">
                        <tbody>
                            <tr>
                                <td class='gallery-caption-icon'>
                                    <span class="material-icons">
                                        badge
                                    </span>
                                </td>
                                <td class="fst-italic" v-text="speciesName(o.taxa_id)"></td>
                            </tr>
                            <tr>
                                <td class='gallery-caption-icon'>
                                    <span class="material-icons">
                                        person
                                    </span>
                                </td>
                                <td v-text="o.user_id"></td>
                            </tr>
                            <tr>
                                <td class='gallery-caption-icon'>
                                    <span class="material-icons">
                                        calendar_today
                                    </span>
                                </td><td v-text="fullDate(o.date)"></td>
                            </tr>
                            <tr>
                                <td class='gallery-caption-icon'>
                                    <span class="material-icons">
                                        place
                                    </span>
                                </td><td v-text="o.state"></td>
                            </tr>
                            <tr>
                                <td colspan="2"><ui-button color="green" size="small" raised @click="gotoObservation(o)">Go to Observation</ui-button></td>
                            </tr>
                        </tbody>
                    </table>

                 </div>
            </div>
        </div>

    </div>
</template>

<script>
    export default {
        name:"image-gallery",
        props: ["observations", "taxa"],
        methods:{
            imgUrl (o) {
				let op = ""
				if(o.portal == "inat"){
					op = o.img_url.replace("square", "medium")
				} else if(o.portal == "ibp"){
					op = `https://indiabiodiversity.org/files-api/api/get/raw/observations/${o.img_url}`
				}
				return op
			},
			fullDate (d) {
				let op = `${d} Sept, 21`
				return op
			},
			speciesName (id) {
				let op = ""
				if (this.taxa[id] !== undefined){
                    op = this.taxa[id].name
					// if (this.taxa[id].common_name !== '' && this.taxa[id].rank === 'species') {
					// 	op = `${this.taxa[id].name} ( ${this.taxa[id].common_name} )`
					// } else {
					// }
				}
				return op
			},
			gotoObservation (o) {
				let url = ""
				if(o.portal == "inat"){
					url = 'https://www.inaturalist.org/observations/' + o.id
				} else if (o.portal == "ibp"){
					url = 'https://indiabiodiversity.org/observation/show/' + o.id
				}
				window.open(url, '_blank').focus();
			},
        }
    }
</script>