import Vue from 'vue'
import Vuex from 'vuex'
import Api from '@/dbConnection'
Vue.use(Vuex)

export default new Vuex.Store({
    state:{
        
    },
    getters:{

    },
    actions:{
        async getSpaces(){
            try{
                let res = await Api().get(`api/qsoft/business/getAllbusinesses/`);
                callback(res.data);
            }
            catch (err){
                console.log(err);
            }
        }
    },
    mutations:{

    }
})