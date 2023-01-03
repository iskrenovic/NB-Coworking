<template>
    <div>
        <search-bar pocetnoMesto="Užice" @pronadjeno="searchPronadjen"/>
    </div>
</template>

<script>
import { defineComponent } from '@vue/composition-api'
import searchBar from '@/components/searchBar.vue';
export default defineComponent({
    name:'home-page',
    components:{
        searchBar
    },
    methods:{
        searchPronadjen(mesto, broj, text = "nina"){
            console.log("ovde je", mesto, broj, text);
        }
    }
})
</script>


<style scoped>

</style>