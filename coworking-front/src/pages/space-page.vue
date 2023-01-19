<template>
    <div v-if="loaded">
       <button @click="goBack">Back</button>
       <reservationForm v-if="openReserve && user.role.toLowerCase() == 'business'"
       business
       :user="user"
       :item="selectedRoom"
       @potvrdjeno="createReservation"/> 
       <div class="section">
            <button v-if="owner && !openForm" @click="createRoom">CREATE ROOM</button> 
            <room-form v-if="owner && openForm" @cancel="closeForm"/>
            <space-list :list="list" type="rooms" :owner="owner" :linkable="user.role.toLowerCase() != 'business'" @click="selectRoom"/>
        </div>
       <div class="section" v-if="owner">
            <h3>Equipment</h3>
            <equipment-form v-if="openEquipmentForm" @cancel="equipmentCancel"/>
            <button v-else @click="createNewEquipment">CREATE NEW</button>
            <space-list :list="equipmentList" type="equipment" owner :linkable="false"/>
            <!--LISTA EQUIPMENTA-->
        </div>
    </div>
</template>


<script>
import { defineComponent } from '@vue/composition-api'
import spaceList from '@/components/space-list.vue';
import roomForm from '@/components/Owner/room-form.vue';
import equipmentForm from '@/components/Owner/equipment-form.vue';
import reservationForm from '@/components/reservationForm.vue';
export default defineComponent({
    name:'space-page',
    components:{
        spaceList,
        roomForm,
        equipmentForm,
        reservationForm
    },
    data(){
        return {
            list:[],
            owner:false,
            user:null,
            selectedRoom:null,
            openForm:false,
            openReserve:false,
            equipmentList:[],
            openEquipmentForm:false,
            loaded:false,
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
        },
        createNewEquipment(){
            this.openEquipmentForm = true;
        },
        equipmentCancel(){
            this.openEquipmentForm = false;
        },
        selectRoom(room){
            this.selectedRoom = room;
            this.openReserve = true;
        },
        createReservation(){

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
        this.user = this.$store.getters['getUser'];
        if(!this.user){
            await this.$store.dispatch('getUser', this.$cookies.get('uId'));
            this.user = this.$store.getters['getUser'];
        } 
        await this.$store.dispatch('getEquipmentByUserId',this.$route.params.id);
        this.equipmentList = this.$store.getters['getEquipment'];
        if(!this.equipmentList) this.equipmentList = [];
        this.loaded = true;
        //@NINA kad ti treba primer za getter-evo ti
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
.section {
  margin: 10px 0;
  padding: 10px;
  background-color: #f8f8f8;
  border-radius: 5px;
}

.section h3 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  text-transform: uppercase;
}
</style>
