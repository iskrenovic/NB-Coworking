<template>
    <div class="ui">
        <div class="top-bar">
            <img /> <!--LOGO-->
            <h3 v-if="getUser">Wellcome {{ getUser.username }}</h3>
            <button v-if="isPropertyOwner" @click="openOwnerDashboard">OWNER DASHBOARD</button>
            <button @click="loginClick">{{(getUser?'LOGOUT':'LOGIN')}}</button>
        </div>
        <search-bar pocetnoMesto="Užice" @pronadjeno="searchPronadjen"/>
        <h3 v-if="recommendedSpaces && recommendedSpaces.length>0">RECOMMENDED FOR YOU:</h3>
        <space-list v-if="recommendedSpaces" :list="recommendedSpaces" type="space" />
        <h3>ALL:</h3>
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
    computed:{
        getUser(){            
            return this.$store.getters['getUser'];
        },
        isPropertyOwner(){
            return this.getUser && this.getUser.role == 'owner';
        }
    },
    methods:{
        //@DIMI
        async searchPronadjen(mesto, broj){
            await this.$store.dispatch('getSpacesByCity', mesto);
            this.spaces= this.$store.getters['getSpaces'];
            console.log(mesto, broj);
        },
        loginClick(){

            if(this.getUser){
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
            spaces:[],
            recommendedSpaces:[],
            user:null
        }
    },
    async created(){
        this.user = this.$store.getters['getUser'];
        if(!this.user){
            await this.$store.dispatch('getUser', this.$cookies.get('uId'));
            this.user = this.$store.getters['getUser'];
        } 
        await this.$store.dispatch('getSpacesByCity', 'Nis');        
        this.spaces = this.$store.getters['getSpaces'];
        if(this.user.role!='owner'){
            let url = 'getRecommendedSpacesFreelancer';
            if(this.user.role == 'business') url = 'getRecommendedSpacesBusienss';
            console.log(url);
            await this.$store.dispatch(url, {
                city:'Nis',
                userID:this.user.ID
            });
            this.recommendedSpaces = this.$store.getters['getRecommendedSpaces'];
            if(!this.recommendedSpaces) this.recommendedSpaces = [];
        }
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