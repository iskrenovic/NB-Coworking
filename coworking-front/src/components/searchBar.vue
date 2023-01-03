<template>
    <div>
        <input type="text" v-model="naziv"/>
        <h3>Filtriraj rezultate</h3>
        <h2>mesto</h2>
        <select v-model="selectMesto">
            <option value="" >Svi</option>
            <option v-for="grad in gradovi" :key="grad">{{ grad }}</option>
        </select>
        <h2>Broj mesta</h2>
        <input type="number" v-model="brojMesta"/>
        <button @click="pronadji">Pronadji</button>
    </div>
</template>


<script>
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
    name:'search-bar',
    props:{
        pocetnoMesto:{
            type: String,
            required:true
        }
    },
    data(){
        return {
            naziv:'',
            selectMesto:'',
            brojMesta:1,
            gradovi:["Beograd", "Novi Sad", "Niš","Užice", "Zaječar"]
        }
    },
    methods:{
        pronadji(){
            this.$emit('pronadjeno', this.selectMesto,this.brojMesta);
        },
    },
    created(){
        this.selectMesto = this.pocetnoMesto;
    },
    watch:{
        selectMesto: function(newValue){
            console.log("Promenjeno na", newValue);
        }
    },
    emits:['pronadjeno']
})
</script>


<style scoped>

</style>