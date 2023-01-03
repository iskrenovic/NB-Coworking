import Vue from 'vue'
import Router from 'vue-router'
import Homepage from '@/pages/homepage.vue'
import LoginRegister from '@/pages/login-register.vue'

Vue.use(Router);


const r = new Router({
    routes:[
        {
            path:'/',
            name: 'Homepagemain',
            component: Homepage,            
        },
        {
            path:'/login',
            name:'Login',
            component:LoginRegister
        }
    ],
    mode: 'history'
})

export default r;