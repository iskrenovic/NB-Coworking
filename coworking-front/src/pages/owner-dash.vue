<template>
    <div class="ui">
        <div class="section">
            <h3>Requests</h3>   
            <request-list :requests="requests"/>
        </div>
        <div class="section">
            <h3>Spaces</h3>
            <space-form v-if="openCreateSpace" @cancel="spaceFormCancel"/>
            <button v-else @click="createNewSpace()">CREATE NEW</button>
            <space-list :list="list" type="space" owner/>
        </div>        
    </div>
</template>

<script>
import { defineComponent } from '@vue/composition-api'
import spaceList from '@/components/space-list.vue';
import spaceForm from '@/components/Owner/space-form.vue';
import requestList from '@/components/Owner/request-list.vue';
export default defineComponent({
    name:'owner-dash',
    components:{
        spaceList,
        spaceForm,
        requestList,
        
    },
    data(){
        return{
            list:[],            
            requests:[{
                _id:1,
                startTime: new Date(),
                endTime: new Date(new Date().setDate(new Date().getDate() + 2))
            },
            {
                _id:2,
                startTime: new Date(),
                endTime: new Date(new Date().setDate(new Date().getDate() + 3))
            },
            {
                _id:3,
                startTime: new Date(),
                endTime: new Date(new Date().setDate(new Date().getDate() + 5))
            },
            {
                _id:4,
                startTime: new Date(),
                endTime: new Date(new Date().setDate(new Date().getDate() + 5))
            },
            {
                _id:5,
                startTime: new Date(),
                endTime: new Date(new Date().setDate(new Date().getDate() + 5))
            }],
            openCreateSpace:false,
            openEquipmentForm: false
        }
    },
    methods:{
        createNewSpace(){
            this.openCreateSpace = true;
        },
        spaceFormCancel(){
            this.openCreateSpace = false;
        },
        equipmentCancel(){
            this.openEquipmentForm = false;
        },
        createNewEquipment(){
            this.openEquipmentForm = true;
        }
    },
    async created(){
        await this.$store.dispatch('getSpacesByUserId', {
            userID:this.$cookies.get('uId'),
            callback:(list)=>{
                this.list = list;
            }
        });
        
    }
})
</script>


<style scoped>
.ui {
  display: flex;
  flex-direction: column;
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

button {
  background-color: #00bcd4;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 10px 15px;
  cursor: pointer;
}

button:hover {
  background-color: #00acc1;
}
</style>
