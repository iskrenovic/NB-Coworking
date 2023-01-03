<template>
    <div class="list">
        <div v-for="item in list" :key="item._id" @click="clickOnSpace(item)" class="list-element">
            <img src="@/assets/coworking_example.jpg"/>
            <div>
                <h2>{{item.name}}</h2>
                <h3>{{ item.address }}</h3>
                <button @click="clickOnSpace(item)">DETAILS</button>
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
        }
    },
    data(){

    },
    methods:{
        clickOnSpace(item){
            console.log(item._id)
        }
    },
    created(){

    }
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

.list-element div {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.5); /* Add a semi-transparent black background */
  color: white;
  padding: 1rem;
  transition: all 0.3s; /* Add a transition to smooth out the hover effect */
}

.list-element:hover div {
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

.list-element button {
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  background: white;
  color: black;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.list-element button:hover {
  background: #eee;
}

</style>
