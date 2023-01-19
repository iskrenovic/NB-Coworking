<template>
    <div class="list">
        <div v-for="req in requests" :key="req._id" class="element">
            <h3>Room X Place Y</h3>
            <h3>Start time: {{req.dateStart.toDateString()}}</h3>
            <h3>End time: {{req.dateEnd.toDateString()}}</h3>
            <div class="buttons">
                <button @click="accept(req)">Accept</button>
                <button @click="deny(req)">Deny</button>
            </div>
        </div>
    </div>    
</template>

<script>
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
    name:'request-list',
    props:{
        requests:{
            type: Array,
            required:true
        }
    },
    methods:{
        async accept(req){
            await this.$store.dispatch('acceptRequest', req.ID);
        },
        async deny(req){
            await this.$store.dispatch('denyRequest', req.ID);
            console.log("DENY REQ:", req);
        }
    }
    

})
</script>


<style scoped>
.list {
  display: flex;
  width: 100%;
}

.element {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 750px;
  margin: 16px 0;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.1);
  padding: 16px;
}

.element h3 {
  margin: 4px 0;
  font-size: 18px;
  font-weight: 500;
}

.buttons {
  display: flex;
  justify-content: space-between;
  width: 80%;
  margin: 8px 0;
}

.buttons button {
  width: 40%;
  height: 32px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.buttons button:hover {
  transform: scale(1.1);
}

.buttons button:active {
  transform: scale(0.9);
}

.buttons button:focus {
  outline: none;
}

.buttons button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.buttons button.accept {
  color: white;
  background-color: #4caf50;
}

.buttons button.accept:hover {
  background-color: #43a047;
}

.buttons button.accept:active {
  background-color: #388e3c;
}

.buttons button.deny {
  color: white;
  background-color: #f44336;
}

.buttons button.deny:hover {
  background-color: #e53935;
}

.buttons button.deny:active {
  background-color: #d32f2f;
}

</style>
