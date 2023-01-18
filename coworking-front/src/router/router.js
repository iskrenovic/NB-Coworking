import Vue from 'vue'
import Router from 'vue-router'
import Homepage from '@/pages/homepage.vue'
import LoginRegister from '@/pages/login-register.vue'
import SpacePage from '@/pages/space-page.vue'
import RoomPage from '@/pages/room-page.vue'
import OwnerDash from '@/pages/owner-dash.vue'

Vue.use(Router);


//MORA DA SE ODRADI BEFORE ENTER           
const r = new Router({
    routes:[
        {
            path:'/',
            name: 'Homepage',
            component: Homepage,
        },
        {
            path:'/login',
            name:'Login',
            component:LoginRegister,
            beforeEnter(to,from,next){
                if(!Vue.$cookies.get('uId')){
                    console.log("USO SAM");
                    next();
                    return;
                }
                next({name:'Homepage'})
            }
        },
        {
            path:'/owner',
            name:'Owner',
            component:OwnerDash
        },
        {
            path:'/space/:id',
            name:'SpacePage',
            component:SpacePage
        },
        {
            path:'/owner/space/:id',
            name:'OwnerSpacePage',
            component:SpacePage
        },
        {
            path:'/room/:id',
            name:'RoomPage',
            component:RoomPage
        },
        {
            path:'/owner/room/:id',
            name:'OwnerRoomPage',
            component:RoomPage
        }
        
    ],
    mode: 'history'
})

export default r;