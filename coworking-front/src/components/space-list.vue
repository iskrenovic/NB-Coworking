<template>
    <div class="list">
        <div v-for="item in list" :key="item.ID" @click="clickToLink(item)" class="list-element">
            <img src="@/assets/coworking_example.jpg"/>
            <div class="space" v-if="type == 'equipment'">
                <h2>{{item.name}}</h2>
                <h3>{{ item.description }} - <b>{{ item.price }} RSD</b></h3>
                <div class="buttons" v-if="owner">
                    <button @click="deleteItem(item)">DELETE</button>
                </div>
            </div>
            <div class="space" v-else-if="type == 'rooms'">
                <h2>{{item.name}}</h2>
                <h3>{{ item.size }} mkv</h3>
                <h3>Sprat: {{ item.floor }}</h3>
                <h3>Broj mesta:{{ item.seatCount }}</h3>
                <div class="buttons" v-if="owner">
                    <button @click="deleteItem(item)">DELETE</button>
                </div>
            </div>
            <div class="space" v-else-if="type == 'seat'">
                <h2>{{item.name}}</h2>
                <h3>{{ item.price }} rsd</h3>                
                <div class="buttons" v-if="owner">
                    <button @click="deleteItem(item)">DELETE</button>
                </div>
            </div>
            <div class="space" v-else>
                <h2>{{item.name}}</h2>
                <h3>{{ item.address }}</h3>
                <div class="buttons" v-if="owner">
                    <button @click="deleteItem(item)">DELETE</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
    name:'space-list',
    props:{
        list:{
            type: Array,
            required:true
        },
        type:{
            type:String,
            required:true
        },
        // @NINA Type moze da bude ili SPACE, ROOM ILI SEAT
        owner:{
            type:Boolean,
            required:false,
            default:false
        },
        linkable:{
            type:Boolean,
            required:false,
            default:true
        }
        // @NINA Ovo se poziva kada gleda u listu vlasnik prostora, ako ti nije jasno kako funkcionise ili zasto je tako objasnicu ti kada se budemo videli
    },
    data(){
        return{
            linkName:'',
            linkParams:{},             
            clickable:true,
            canClick:true,
        }
    },
    methods:{
        clickToLink(item){
            console.log(item);
            if(!this.canClick) return;
            if(!this.clickable){
                this.clickable = true;
                return;
            }
            if(!this.linkable) {
                this.clickToEmit();
                return;
            }
            let p = {
                id:item.ID
            }
            if(this.type.toUpperCase() == 'ROOMS'){
                p.spaceId = this.$route.params.id;
            }
            this.$router.push({name:this.linkName, params: p})
        },
        clickToEmit(item){
            this.$emit('click', item);
        },
        async deleteItem(item){
            this.clickable = false;
            let ans = window.confirm(`Are you sure you want to delete ${item.name} space?`)
            if(ans){
                //TODO
                await this.$store.dispatch('deleteSpace', item.ID);
                console.log("TREBA OBRISATI ITEM:",item);
            }
        },
        setupType(){
            switch(this.type.toUpperCase()){
                case "SPACE": 
                    this.linkName = "SpacePage";  
                    if(this.owner) this.linkName = "OwnerSpacePage"               
                    return true;                   
                case "ROOMS":
                    this.linkName = "RoomPage";
                    if(this.owner) this.linkName = "OwnerRoomPage"   
                    return true;
                case "SEAT":
                    this.linkName = "SeatPage";                    
                    return true;
                case 'EQUPIMENT':
                    this.canClick = false;
                    return true;             
            }  
            return false;
        },
        
    },
    created(){
        if(!this.setupType()){
            console.error("Type must be either 'SPACE', 'ROOMS' or 'SEAT'");
            return;
        }
    },
    emits:['click']
})
</script>


<style scoped>
.list {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  
  margin: auto;
  max-width: 95vw; /* Add a max-width to limit the width of the list */
}

.list-element {
  position: relative;
  width: calc(50% - 2rem); /* Make the list elements take up half the width of the list, minus the margin */
  margin: 1rem;
  cursor: pointer;
}

.list-element img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.space {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.5); /* Add a semi-transparent black background */
  color: white;
  padding: 1rem;
  transition: all 0.3s; /* Add a transition to smooth out the hover effect */
}

.space {
  background: rgba(0, 0, 0, 0.8); /* Make the background more opaque on hover */
}

.list-element h2 {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 600;
}

.list-element h3 {
  margin: 0.5rem 0 0;
  font-size: 1rem;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.8);
}

.buttons {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
  position: absolute;  
  top: 50%;
  right: 2%;
  transform: translateY(-50%);
}

.buttons button {  
  border: none;
  border-radius: 4px;
  background: white;
  margin-top: 5px;
  margin-bottom:5px;
  width:100%;
  color: black;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}
</style>