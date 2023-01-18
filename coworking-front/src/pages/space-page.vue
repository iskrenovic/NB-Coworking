<template>
    <div>
       <button @click="goBack">Back</button> 
       <button v-if="owner && !openForm" @click="createRoom">CREATE ROOM</button> 
       <room-form v-if="owner && openForm" @cancel="closeForm"/>
       <space-list :list="list" type="rooms" :owner="owner"/>
    </div>
</template>


<script>
import { defineComponent } from '@vue/composition-api'
import spaceList from '@/components/space-list.vue';
import roomForm from '@/components/Owner/room-form.vue';
export default defineComponent({
    name:'space-page',
    components:{
        spaceList,
        roomForm
    },
    data(){
        return {
            list:[],
            owner:false,
            openForm:false
        }
    },
    methods:{
        goBack(){
            if(this.owner){
                this.$router.push({name:'Owner'});
                return;
            }
            this.$router.push({name:'Homepage'});
        },
        createRoom(){
            this.openForm = true;
        },
        closeForm(){
            this.openForm = false;
        }
    },
    async created(){
        this.owner = this.$route.name == "OwnerSpacePage"
        await this.$store.dispatch('getRoomsBySpaceID',{
            id:this.$route.params.id,
            callback:(resp)=>{
                this.list = resp;
            }
        })
    }
})
</script>


<style scoped>
button{
    width: 100%; 
    background-color: #00bcd4;
    color: white;
    padding: 14px 20px;
    margin: 8px 0;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}
</style>
