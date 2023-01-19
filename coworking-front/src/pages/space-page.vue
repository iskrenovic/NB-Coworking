<template>
    <div>
       <button @click="goBack">Back</button> 
       <div class="section">
            <button v-if="owner && !openForm" @click="createRoom">CREATE ROOM</button> 
            <room-form v-if="owner && openForm" @cancel="closeForm"/>
            <space-list :list="list" type="rooms" :owner="owner"/>
        </div>
       <div class="section">
            <h3>Equipment</h3>
            <equipment-form v-if="openEquipmentForm" @cancel="equipmentCancel"/>
            <button v-else @click="createNewEquipment">CREATE NEW</button>
            <space-list :list="equipmentList" type="equipment" owner/>
            <!--LISTA EQUIPMENTA-->
        </div>
    </div>
</template>


<script>
import { defineComponent } from '@vue/composition-api'
import spaceList from '@/components/space-list.vue';
import roomForm from '@/components/Owner/room-form.vue';
import equipmentForm from '@/components/Owner/equipment-form.vue';
export default defineComponent({
    name:'space-page',
    components:{
        spaceList,
        roomForm,
        equipmentForm
    },
    data(){
        return {
            list:[],
            owner:false,
            openForm:false,
            equipmentList:[],
            openEquipmentForm:false
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
        await this.$store.dispatch('getEquipmentByUserId',this.$route.params.id);
        this.equipmentList = this.$store.getters['getEquipment'];
        if(!this.equipmentList) this.equipmentList = [];
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
