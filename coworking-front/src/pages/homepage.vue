<template>
    <div>
        <div class="top-bar">
            <img /> <!--LOGO-->
            <button @click="loginClick">{{(isLoggedIn?'PROFILE':'LOGIN')}}</button>
        </div>
        <search-bar pocetnoMesto="Užice" @pronadjeno="searchPronadjen"/>
        <space-list :list="spaces" type="space" />
    </div>
</template>

<script>
import { defineComponent } from '@vue/composition-api'
import searchBar from '@/components/searchBar.vue';
import SpaceList from '@/components/space-list.vue';
export default defineComponent({
    name:'home-page',
    components:{
        searchBar,
        SpaceList
    },
    methods:{
        searchPronadjen(mesto, broj, text = "nina"){
            console.log("ovde je", mesto, broj, text);
        },
        loginClick(){
            this.$router.push({name:'Login'});
        }
    },
    data(){
        return{
            spaces:[{
                _id:1,
                name:'Coworking Nis',
                address:'Nekoga Tamo 12'
            },
            {
                _id:2,
                name:'Startup Nis',
                address:'Odmah Iza 69'
            },
            {
                _id:3,
                name:'Coworkingujemo',
                address:'Znas Ti Znas 420'
            }]
        }
    }
})
</script>


<style scoped>

</style>