import Vue from 'vue'
import Router from 'vue-router'
import store from '@/api-service'
import Homepage from '@/pages/homepage.vue'
import LoginRegister from '@/pages/login-register.vue'
import SpacePage from '@/pages/space-page.vue'
import RoomPage from '@/pages/room-page.vue'
import OwnerDash from '@/pages/owner-dash.vue'
import ReservationMsg from '@/pages/reservation-msg.vue'


Vue.use(Router);


//MORA DA SE ODRADI BEFORE ENTER           
const r = new Router({
    routes:[
        {
            path:'/',
            name: 'Homepage',
            component: Homepage,
            beforeEnter(to, from, next){
                if(!Vue.$cookies.get('uId')){
                    next({name:'Login'});
                    return;
                }
                next()
            }
        },        
        {
            path:'/login',
            name:'Login',
            component:LoginRegister,
            beforeEnter(to,from,next){
                if(!Vue.$cookies.get('uId')){
                    next();
                    return;
                }
                next({name:'Homepage'})
            }
        },
        {
            path:'/owner',
            name:'Owner',
            component:OwnerDash,
            beforeEnter(to, from,next){
                if(!Vue.$cookies.get('uId')){
                    next({name:'Login'});
                    return;
                }
                let user = store.getters['getUser'];
                if(user){
                    if(user.role == 'owner'){
                        next();
                        return;
                    }
                    next({name:'Homepage'});
                    return;
                }
                if(!user){
                    store.dispatch('getUserWithCallback',{
                        id:Vue.$cookies.get('uId'),
                        callback:(u)=>{
                            if(!u){
                                next({name:'Login'});
                                return;
                            }
                            if(u.role == 'owner'){
                                next();
                                return;
                            }
                            next({name:'Homepage'});
                        }
                    })
                }               
            }
        },
        {
            path:'/space/:id',
            name:'SpacePage',
            component:SpacePage
        },
        {
            path:'/owner/space/:id',
            name:'OwnerSpacePage',
            component:SpacePage,
            beforeEnter(to, from,next){
                if(!Vue.$cookies.get('uId')){
                    next({name:'Login'});
                    return;
                }
                let user = store.getters['getUser'];
                if(user){
                    if(user.role == 'owner'){
                        next();
                        return;
                    }
                    next({name:'Homepage'});
                    return;
                }
                if(!user){
                    store.dispatch('getUserWithCallback',{
                        id:Vue.$cookies.get('uId'),
                        callback:(u)=>{
                            if(!u){
                                next({name:'Login'});
                                return;
                            }
                            if(u.role == 'owner'){
                                next();
                                return;
                            }
                            next({name:'Homepage'});
                        }
                    })
                }               
            }
        },
        {
            path:'/room/:spaceId/:id',
            name:'RoomPage',
            component:RoomPage
        },
        {
            path:'/owner/room/:spaceId/:id',
            name:'OwnerRoomPage',
            component:RoomPage,
            beforeEnter(to, from,next){
                if(!Vue.$cookies.get('uId')){
                    next({name:'Login'});
                    return;
                }
                let user = store.getters['getUser'];
                if(user){
                    if(user.role == 'owner'){
                        next();
                        return;
                    }
                    next({name:'Homepage'});
                    return;
                }
                if(!user){
                    store.dispatch('getUserWithCallback',{
                        id:Vue.$cookies.get('uId'),
                        callback:(u)=>{
                            if(!u){
                                next({name:'Login'});
                                return;
                            }
                            if(u.role == 'owner'){
                                next();
                                return;
                            }
                            next({name:'Homepage'});
                        }
                    })
                }               
            }
        },
        {
            path:'/reservation/:id',
            name:'ReservationPage',
            component:ReservationMsg
        }
        
    ],
    mode: 'history'
})

export default r;