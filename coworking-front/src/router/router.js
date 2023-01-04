import Vue from 'vue'
import Router from 'vue-router'
import Homepage from '@/pages/homepage.vue'
import LoginRegister from '@/pages/login-register.vue'
import SpacePage from '@/pages/space-page.vue'
import RoomPage from '@/pages/room-page.vue'

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
        },
        {
            path:'/space/:id',
            name:'SpacePage',
            component:SpacePage
        },
        {
            path:'/room/:id',
            name:'RoomPage',
            component:RoomPage
        },
        {
            path:'/seat/:id',
            name:'SeatPage',
            component:LoginRegister
        }
        
    ],
    mode: 'history'
})

export default r;