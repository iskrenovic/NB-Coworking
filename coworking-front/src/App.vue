<template>
    <div id="app">
        <router-view/>
    </div>
</template>

<script>
import { defineComponent } from '@vue/composition-api'
import {messageReceved} from '@/ws_handler'
export default defineComponent({
    name:'App',
    methods:{
        async wsConnectUser(link, user){
            const ws = new WebSocket(link);
            ws.onopen = async()=>{
                ws.send(JSON.stringify({ID:user.ID, init:true}));
            }
            ws.onmessage = async(event)=>{
                let message = JSON.parse(event.data);
                messageReceved(message);
            }
            ws.onclose = async ()=>{
                //U slucaju da se desi disconnect, da se opet konektuje i prijavi                
                this.wsConnectUser(link, user);
            }
        },        
    },
    async created() {
        if(this.$cookies.get('uId')){
            await this.$store.dispatch('getUser', this.$cookies.get('uId'));
            let user = this.$store.getters['getUser'];
            if(user)
                await this.wsConnectUser("ws://localhost:3300", user);
        }
    },
})
</script>

<style>
#app{
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
}

</style>
