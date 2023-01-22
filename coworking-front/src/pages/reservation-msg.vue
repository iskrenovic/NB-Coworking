<template>
    <div>
        <h3> STATUS VAŠE REZERVACIJE: </h3>
        <h2 class="acc" v-if="status == 'accepted'">Vaša rezervacija je potvrđena!</h2>
        <h2 class="den" v-else-if="status == 'denied'">Nažalost, Vaša rezervacija je odbijena.</h2>
        <h2 v-else>Čeka se potvrda Vašeg upita.</h2>
        <button v-if="status == 'accepted' || status == 'denied'" @click="backToHome">Vratite se na početnu</button>
    </div>
</template>

<script>
import { defineComponent } from '@vue/composition-api'
import {registerCallback} from '@/ws_handler'
export default defineComponent({
    name:'reservation-msg',
    data(){
        return{
            status:"pending"
        }
    },
    methods:{
        backToHome(){
            this.$router.push('Homepage');
        }
    },
    created(){
        this.$store.dispatch('getRequestById',{
            id: this.$route.params.id,
            callback: (s)=>{
                if(!s){
                    alert("ERROR");
                    return;
                }
                if(s == "pending"){
                    registerCallback(msg=>{
                        this.status = msg.reservation.status;
                    })
                    return;
                }
                this.status = s;
            }
        })
       
    }
})
</script>


<style scoped>
    div {
        text-align: center;
    }
    h3 {
        font-weight: bold;
    }
    h2 {
        font-weight: normal;
        color: #333;
    }
    .acc {
        color: green;
    }
    .den {
        color: red;
    }
</style>
