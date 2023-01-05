<template>
    <div class="ui">
        <div class="section">
            <h3>Requests</h3>   
            <request-list :requests="requests"/>
        </div>
        <div class="section">
            <h3>Spaces</h3>
            <button @click="createNewSpace()">CREATE NEW</button>
            <space-form v-if="openCreateSpace" @cancel="spaceFormCancel"/>
            <space-list :list="list" type="space" owner/>
        </div>
        <div class="section">
            <h3>Equipment</h3>
            <button @click="createNewEquipment()">CREATE NEW</button>
            <!--LISTA EQUIPMENTA-->
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
        requestList
    },
    data(){
        return{
            list:[{
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
            openCreateSpace:false
        }
    },
    methods:{
        createNewSpace(){
            this.openCreateSpace = true;
        },
        spaceFormCancel(){
            this.openCreateSpace = false;
        },
        createNewEquipment(){

        }
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
