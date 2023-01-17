<template>
    <div class="ui">
        <div class="seg">
            <h3>NAME:</h3>
            <input type="text" v-model="name"/>
        </div>
        <div class="seg">
            <h3>ADDRESS:</h3>
            <input type="text" v-model="address"/>
        </div>
        <div class="seg">
            <h3>PHONE NUMBER:</h3>
            <input type="text" v-model="phoneNo"/>
        </div>  
        <div class="seg">
            <h3>IMAGE:</h3>
            <input type="file" @change="selectImage"/>
        </div>
        <button @click="createSpace">Create</button>
        <button @click="cancel">Cancel</button>
    </div>
</template>

<script>
import { defineComponent } from '@vue/composition-api'
import {validateObjects} from '@/helpers/data-cheker'

export default defineComponent({
    name:'space-form',
    data(){
        return{
            name:'',
            address:'',
            phoneNo:'',
            image:null
        }
    },
    methods:{
        selectImage(img){
            console.log("Selected image is:", img);
            this.image = img;
        },
        inputValid(){
            return this.name!='' && this.address!='' && this.phoneNo!='' && this.image
        },
        createSpace(){
            if(validateObjects(this.name, this.address, this.phoneNo, this.image)){
                this.$store.dispatch('addSpace', {
                    name:this.name,
                    address:this.address,
                    contact: this.phoneNo,
                    userID:this.$cookies.get('uId')
                });
                console.log("VALIDAN INPUT")
            }
            else{
                console.error("NOT VALID");
            }
        },
        cancel(){
            this.$emit('cancel');
        }
    },
    emits:['cancel']
})
</script>


<style scoped>
.ui {
  display: flex;
  flex-direction: column;
  align-items: center;  
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.ui input[type="text"] {
  width: 70vw;
  padding: 12px 20px;
  margin: 8px 0;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.ui button {
  width: 100%; 
  background-color: #00bcd4;
  color: white;
  padding: 14px 20px;
  margin: 8px 0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.ui button:hover {
  background-color: #00acc1;
}

input[type="file"] {
  /* Add some padding and a nice font */
  padding: 1em;
  font-family: sans-serif;
  
  /* Add some custom styles */
  border: none;
  border-radius: 5px;
  background-color: #f5f5f5;
  color: #333;
}

/* Style the button that is used to trigger the file browser */
input[type="file"]::-webkit-file-upload-button {
  /* Add some padding and a nice font */
  padding: 1em;
  font-family: sans-serif;
  
  /* Add some custom styles */
  border: none;
  border-radius: 5px;
  background-color: #333;
  color: #f5f5f5;
  
  /* Add some hover effects */
  transition: background-color 0.2s ease;
}

input[type="file"]::-webkit-file-upload-button:hover {
  background-color: #444;
}
.seg{
    display: flex;
    width: 100%;
    height: 50px;
    padding: 5px;
}
</style>