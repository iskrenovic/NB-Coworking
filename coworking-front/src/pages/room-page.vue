<template>
    <div>        
        <button @click="goBack">Back</button> 
        <reservationForm v-if="reserved &&!owner" @potvrdjeno="createPotvrdjenu"/>
        <button v-if="owner && !openFrom" @click="openCreateForm">CREATE ROOM</button>
        <seat-form v-if="owner && openFrom" @cancel="closeForm"/>
        <space-list :list="list" type="seat" :owner="owner" @click="crtajReserve" :linkable="false"/>
    </div>
</template>


<script>
import { defineComponent } from '@vue/composition-api'
import spaceList from '@/components/space-list.vue';
import reservationForm from '@/components/reservationForm.vue';
import seatForm from '@/components/Owner/seat-form.vue';
export default defineComponent({
    name:'room-page',
    components:{
    spaceList,
    reservationForm,
    seatForm
},
    data(){
        return {
            list:[],
            owner:false,
            reserved:false,
            openFrom:false,
        }
    },
    methods:{
        goBack(){
            if(this.owner){
                this.$router.push({name:'OwnerSpacePage', params:{
                    id:this.$route.params.spaceId
                }});
                return;
            }
            this.$router.push({name:'SpacePage', params:{
                    id:this.$route.params.spaceId
                }});
        },
        async createPotvrdjenu(pocetak, kraj){
            //@DIMI
            await this.$store.dispatch("addReservation", {
                dateStart:pocetak,
                dateEnd:kraj
            });
            console.log("Potvrdjena rezervacija za datum "+ " " + pocetak+"->"+kraj);
        },
        crtajReserve(){
            this.reserved=true;
            console.log("crtam rezerve ",this.reserved);
        },
        closeForm(){
            this.openFrom = false;
        },
        openCreateForm(){
            this.openFrom = true;
            console.log("CLOSE");
        }
    },
    async created(){
        this.owner = this.$route.name == "OwnerRoomPage";
        this.reserved=false;
        await this.$store.dispatch("getSeatsByRoomId", this.$route.params.id);
        this.list = this.$store.getters['getSeats'];
    }
})
</script>


<style scoped>

</style>
