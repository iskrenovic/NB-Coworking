<template>
    <div class="ui">
        <div class="top-bar">
            <img /> <!--LOGO-->
            <h3 v-if="getUser">Wellcome {{ getUser.username }}</h3>
            <button v-if="isPropertyOwner" @click="openOwnerDashboard">OWNER DASHBOARD</button>
            <button @click="loginClick">{{(getUser?'LOGOUT':'LOGIN')}}</button>
        </div>
        
        <search-bar @searchBy="searchBy" @cancelFilter="cancelFilter"/>
        <h3 v-if="recommendedSpaces && recommendedSpaces.length>0 && filtering">RECOMMENDED FOR YOU:</h3>
        <space-list v-if="recommendedSpaces && filtering" :list="recommendedSpaces" type="space" />
        <h3 v-if="filtering">ALL:</h3>
        <space-list v-if="filtering" :list="spaces" type="space" />
        <h3 v-if="!filtering">10 spaces:</h3>
        <space-list v-if="!filtering" :list="spaces" type="space"/>
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
        async searchBy(mesto){
            
            await this.$store.dispatch('getSpacesByCity', mesto);
            this.filtering = true;
            this.spaces= this.$store.getters['getSpaces'];
            this.getRecommended(mesto);
        },
        loginClick(){

            if(this.getUser){
                this.$cookies.remove('uId');
                
            }            
            this.$router.push({name:'Login'});
        },
        openOwnerDashboard(){
            this.$router.push({name:'Owner'});
        },
        async getRecommended(city){
            let url = 'getRecommendedSpacesFreelancer';
            if(this.user.role == 'business') url = 'getRecommendedSpacesBusienss';
            await this.$store.dispatch(url, {
                city:city,
                userID:this.user.ID
            });
            this.recommendedSpaces = this.$store.getters['getRecommendedSpaces'];
            if(!this.recommendedSpaces) this.recommendedSpaces = [];
        },
        async cancelFilter(){
            this.filtering = false;
            await this.$store.dispatch('get10Spaces');        
            this.spaces = this.$store.getters['getSpaces'];
        }
    },
    data(){
        return{
            spaces:[],
            recommendedSpaces:[],
            user:null,
            filtering:false
        }
    },
    async created(){
        this.user = this.$store.getters['getUser'];
        if(!this.user){
            await this.$store.dispatch('getUser', this.$cookies.get('uId'));
            this.user = this.$store.getters['getUser'];
        } 
        await this.$store.dispatch('get10Spaces');        
        this.spaces = this.$store.getters['getSpaces'];        
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