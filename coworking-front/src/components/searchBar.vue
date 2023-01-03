<template>
    <div class="search-bar">
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
.search-bar {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 50%;
  margin: 0 auto;
}

.search-bar input[type="text"] {
  width: 60%;
  height: 30px;
  font-size: 16px;
  padding: 0 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.search-bar h3, .search-bar h2 {
  margin: 10px 0;
  font-size: 18px;
  font-weight: 500;
}

.search-bar select {
  width: 60%;
  height: 30px;
  font-size: 16px;
  padding: 0 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.search-bar input[type="number"] {
  width: 60%;
  height: 30px;
  font-size: 16px;
  padding: 0 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.search-bar button {
  width: 60%;
  height: 30px;
  font-size: 16px;
  padding: 0 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #4CAF50;
  color: white;
  cursor: pointer;
}

.search-bar button:hover {
  background-color: #45a049;
}

</style>