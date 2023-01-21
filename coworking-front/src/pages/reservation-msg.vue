<template>
    <div>
        <h3> STATUS VASE REZERVACIJE: </h3>
        <h2 class="acc" v-if="accepted">Vasa rezervacija je potvrdjena!</h2>
        <h2 class="den" v-if="denied">Nazalost, Vasa rezervacija je odbijena.</h2>
        <h2 v-if="!accepted && !denied">Ceka se potvrda Vaseg upita.</h2>
    </div>
</template>

<script>
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
    name:'reservation-msg',
    data(){
        return{
            accepted:false,
            denied:false
        }
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
