<template>
    <div class="ui">
        <h3>Username:</h3>
        <input type="text" v-model="username"/>
        <h3>Password:</h3>
        <input type="password" v-model="password"/>
        <h3 v-if="registerOpen">Email:</h3>
        <input v-if="registerOpen" type="email" v-model="email"/>
        <h3 v-if="registerOpen">Phone No.:</h3>
        <input v-if="registerOpen" type="tel" v-model="phoneNo"/>
        <h3 v-if="registerOpen">Account type:</h3>
        <select v-model="accType" v-if="registerOpen">
            <option disabled :value="''">SELECT TYPE OF ACCOUNT</option>
            <option :value="'owner'">Property Owner</option>
            <option :value="'business'">Business</option>
            <option :value="'user'">Freelancer</option>
        </select>
        <h3 v-if="registerOpen && accType == 'business'">Number of employees</h3>
        <input v-if="registerOpen && accType == 'business'" type="number" v-model="employeeNo"/>
        <button @click="login">LOGIN</button>
        <button @click="register">REGISTER</button>
    </div>
</template>


<script>
import { defineComponent } from '@vue/composition-api'
import {validateObjects} from '@/helpers/data-cheker'
export default defineComponent({
    name:'login-register',
    data(){
        return{
            registerOpen: false,
            username:'',
            password:'',
            email:'',
            phoneNo:'',
            accType:'',
            employeeNo:0
        }
    },
    methods:{
        login(){
            if(this.registerOpen){ 
                this.registerOpen = false;
                return;
            }
            
            console.log(this.username, this.password);
        },
        async register(){
            if(!this.registerOpen){
                this.registerOpen = true;
                return;
            }
            console.log(this.accType);
            if(validateObjects(this.username, this.password, this.email, this.phoneNo, this.accType)){
                if(this.accType == 'business' && !validateObjects(this.employeeNo)){
                    console.error("INPUT INVALID");
                    return;
                }
                await this.$store.dispatch('createAccount',{                    
                    username:this.username,
                    password:this.password,
                    email:this.email,
                    contact:this.phoneNo,
                    role:this.accType,
                    nr_employees:this.employeeNo,
                    callback:(valid)=>{
                        if(valid) 
                            this.$router.push({name:'Homepage'});
                    }
                })
            }
            else{
                console.error("INPUT INVALID");
            }
        }
    }
})
</script>


<style scoped>
.ui {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 300px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.ui input {
  width: 100%;
  padding: 12px 20px;
  margin: 8px 0;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.ui button {
  width: 100%;
  background-color: #4CAF50;
  color: white;
  padding: 14px 20px;
  margin: 8px 0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.ui button:hover {
  background-color: #45a049;
}

</style>