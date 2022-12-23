import Vue from 'vue'
import Router from 'vue-router'
import Homepage from '@/pages/homepage.vue'

Vue.use(Router);


const r = new Router({
    routes:[
        {
            path:'/',
            name: 'Homepagemain',
            component: Homepage,            
        },
    ],
    mode: 'history'
})

export default r;