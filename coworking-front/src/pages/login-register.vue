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
        <button @click="login">LOGIN</button>
        <button @click="register">REGISTER</button>
    </div>
</template>


<script>
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
    name:'login-register',
    data(){
        return{
            registerOpen: false,
            username:'',
            password:'',
            email:'',
            phoneNo:''
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
            await this.$store.dispatch('createAccount',{
                username:this.username,
                password:this.password,
                email:this.email,
                contact:this.phoneNo,
                role:'owner'
            })
            console.log(this.username, this.password, this.email, this.phoneNo);
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