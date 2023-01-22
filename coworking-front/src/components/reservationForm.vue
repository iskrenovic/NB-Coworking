<template>
    <div class="reservation-form">
        <h3>Rezervacija mesta</h3>
        <h2>Pocetak rezervacije:</h2>
        <input type="date" v-model="pocetakRezervacije"/>
        <h2>Kraj rezervacije:</h2>
        <input type="date" v-model="krajRezervacije"/>
        <button @click="potvrdi">Potvrdi</button>
    </div>
</template>


<script>
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
    name:'reservationForm',
    props:{
        business:{
            type:Boolean,
            required:false,
            default:false
        },
        user:{
            type:Object,
            required:true
        },
        item:{
            required:true
        }
    },
    data(){
        return {
            pocetakRezervacije:'',
            krajRezervacije:''
        }
    },
    //@DIMI izmenila sam ovde parametre da se poklapa sa Najdom (datum pocetka i kraja samo)
    methods:{
        async potvrdi(){
            let link = 'addRequestAsFreelancer'
            if(this.business){
                link = 'addRequestAsBusiness';
            }
            await this.$store.dispatch(link,{
                reservation:{
                    dateStart: new Date(this.pocetakRezervacije),
                    dateEnd: new Date(this.krajRezervacije),
                    userID: this.user.ID,
                    placeID: this.item.ID
                },
                callback:(id)=>{
                    if(!id){
                        alert("NEUSPEŠNA REZERVACIJA");
                        return;
                    }
                    this.$router.push({name:'ReservationPage', params:{id}});
                }
            })

        },
    },
    emits:['reservationMade']
})
</script>

<style scoped>
.reservation-form {
    width: 500px;
    margin: 0 auto;
    padding: 20px;
    background-color: #f2f2f2;
    border-radius: 10px;
    text-align: center;
}

.reservation-form h3 {
    margin-bottom: 20px;
    font-size: 28px;
    font-weight: bold;
}

.reservation-form h2 {
    margin-bottom: 10px;
    font-size: 18px;
}

.reservation-form input {
    width: 80%;
    padding: 12px;
    margin-bottom: 20px;
    border-radius: 5px;
    border: none;
    box-shadow: 0px 0px 10px #ccc;
}

.reservation-form button {
    background-color: #4CAF50;
    color: white;
    padding: 12px 20px;
    border-radius: 5px;
    border: none;
    font-size: 18px;
    cursor: pointer;
}

.reservation-form button:hover {
    background-color: #3e8e41;
}
</style>