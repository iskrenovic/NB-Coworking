<template>
    <div class="ui" v-if="loaded">
        <div class="section">
            <h3>Requests</h3>
            <h3 v-if="pendingRequests.length==0">EMPTY</h3>
            <request-list :requests="getPendingRequests"/>
        </div>
        <div class="section">
            <h3>Today inside:</h3>   
            <h3 v-if="getAcceptedRequests">EMPTY</h3>
            <request-list :requests="getAcceptedRequests"/>
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
import {registerCallback} from '@/ws_handler'
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
            pendingRequests:[],
            acceptedRequests:[],
            openCreateSpace:false,
            openEquipmentForm: false,
            loaded:false
        }
    },
    computed:{ 
        getPendingRequests(){
            return this.$store.getters['getRequests'];
        },
        getAcceptedRequests(){            
            if(!this.acceptedRequests) return null;
            let today = (new Date()).toDateString();
            return this.acceptedRequests.filter(p=>p.dateStart.toDateString() == today);
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
        await this.$store.dispatch('getPendingRequests', this.$cookies.get('uId'));
        await this.$store.dispatch('getAcceptedRequests', this.$cookies.get('uId'));
        if(!this.$store.getters['getRequests']) this.pendingRequests = [];
        else this.pendingRequests = this.$store.getters['getRequests'];
        if(!this.$store.getters['getAcceptedRequests']) this.acceptedRequests = [];
        else this.acceptedRequests = this.$store.getters['getAcceptedRequests'];
        registerCallback(msg=>{            
            if(msg.reservation.status == "pending"){
                console.log(msg.reservation);
                this.$store.commit('addRequest', msg.reservation);
                this.pendingRequests = this.$store.getters['getRequests'];
                return;
            }
            this.$store.commit('addAcceptedRequest', msg.reservation);
            this.acceptedRequests = this.$store.getters['getAcceptedRequests'];
            return;
        })
        this.loaded = true;
    },
    async destroyed(){
        registerCallback(null);
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
