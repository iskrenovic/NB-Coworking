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
            <option :value="'freelancer'">Freelancer</option>
        </select>
        <h3 v-if="registerOpen && accType!=''">Name:</h3>
        <input v-if="registerOpen && accType!=''" type="text" v-model="name"/>
        <h3 v-if="registerOpen && accType=='owner'">Surname:</h3>
        <input v-if="registerOpen && accType=='owner'" type="text" v-model="surname"/>
        <h3 v-if="registerOpen && accType=='freelancer'">Address:</h3>
        <input v-if="registerOpen && accType=='freelancer'" type="text" v-model="address"/>
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
            name:'',
            address:'',
            surname:'',
            password:'',
            email:'',
            phoneNo:'',
            accType:'',
            employeeNo:0
        }
    },
    methods:{
        async login(){
            if(this.registerOpen){ 
                this.registerOpen = false;
                return;
            }
            if(validateObjects(this.username, this.password)){
                await this.$store.dispatch('login',{
                    user:{
                        username:this.username,
                        password:this.password
                    },
                    callback:(valid)=>{
                        if(valid)
                            this.$router.push({name:'Homepage'});
                    }
                })            
            }
        },
        async register(){
            if(!this.registerOpen){
                this.registerOpen = true;
                return;
            }
            if(validateObjects(this.username, this.password, this.email, this.phoneNo, this.accType, this.name)){
                switch(this.accType){
                    case 'owner':
                        if(!validateObjects(this.surname)) return;
                        break
                    case 'freelancer':
                        if(!validateObjects(this.address)) return;
                        break
                    case 'business':
                        if(!validateObjects(this.employeeNo)) return;
                        break
                }
                
                await this.$store.dispatch('createAccount',{                    
                    username:this.username,
                    password:this.password,
                    email:this.email,
                    contact:this.phoneNo,
                    role:this.accType,
                    name:this.name,
                    surname:this.surname,
                    address:this.address,
                    nr_employees:this.employeeNo,
                    callback:(valid)=>{
                        if(valid) 
                            this.$router.push({name:'Homepage'});
                    }
                })
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