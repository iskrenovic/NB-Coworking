<template>
    <div class="ui">
        <div class="top-bar">
            <img /> <!--LOGO-->
            <h3 v-if="getUser">Wellcome {{ getUser.username }}</h3>
            <button v-if="isPropertyOwner" @click="openOwnerDashboard">OWNER DASHBOARD</button>
            <button @click="loginClick">{{(user?'LOGOUT':'LOGIN')}}</button>
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

            if(this.user){
                this.$cookies.remove('uId');
                
            }            
            this.$router.push({name:'Login'});
        },
        openOwnerDashboard(){
            this.$router.push({name:'Owner'});
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
            }],
            user:null
        }
    },
    created(){
        this.user = this.$store.getters['getUser'];
        console.log(this.user);
    }
})
</script>


<style scoped>
.top-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px;
    background-color: #f4f4f4;
}

.top-bar img {
    width: 50px;
    height: 50px;
}

.top-bar h3 {
    margin: 0;
    padding-left: 10px;
}

.top-bar button {
    background-color: #3498db;
    color: white;
    border: none;
    padding: 5px 10px;
    cursor: pointer;
}

</style>