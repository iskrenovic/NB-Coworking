<template>
    <div>        
        <reservationForm v-if="reserved" @potvrdjeno="createPotvrdjenu"/>
        <button @click="goBack">Back</button> 
        <space-list :list="list" type="seat" :owner="owner" @click="crtajReserve"/>
    </div>
</template>


<script>
import { defineComponent } from '@vue/composition-api'
import spaceList from '@/components/space-list.vue';
import reservationForm from '@/components/reservationForm.vue';
export default defineComponent({
    name:'room-page',
    components:{
    spaceList,
    reservationForm
},
    data(){
        return {
            list:[{
                _id:1,
                name:'Mesto1',
                price:1200
            },
            {
                _id:2,
                name:'Mesto2',
                price:1300
            },
            {
                _id:3,
                name:'Mesto3',
                price:1400
            }],
            owner:false,
            reserved:false
        }
    },
    methods:{
        goBack(){
            this.$router.push({name:'SpacePage'});
        },
        createPotvrdjenu(datum, pocetak, kraj){
            console.log("Potvrdjena rezervacija za datum "+datum + " " + pocetak+"->"+kraj);
        },
        crtajReserve(){
            this.reserved=true;
            console.log("crtam rezerve ",this.reserved);
        }
    },
    created(){
        this.owner = this.$route.name == "OwnerRoomPage",
        this.reserved=false
    }
})
</script>


<style scoped>

</style>
