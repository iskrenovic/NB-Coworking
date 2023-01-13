import Vue from 'vue'
import Vuex from 'vuex'
import Api from '@/dbConnection'
Vue.use(Vuex)

export default new Vuex.Store({
    state:{
        spaces:null,
        rooms:null,
        seats:null,
        equipment:null,
        requests:null,
    },
    getters:{
        getSpaces(state){
            return state.spaces;
        },
        getRooms(state){
            return state.rooms;
        },
        getEquipment(state){
            return state.equipment;
        },
        getSeats(state){
            return state.seats;
        },
        getRequests(state){
            return state.requests;
        }
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
        },
        async addSpace(commit, space) {
            return await Api().post('/api/restaraunt-bar/article/createArticle', space).then(res=>{
                if(res.status == 200){
                    commit('setSpace', res.data);
                }
                else{
                    console.error(res);
                }
            })
        },
        async deleteSpace(commit, id){
            try{
                let res = await Api().delete(`api/restaraunt-bar/article/deleteArticle/${id}`);
                if(res.status == 200)
                    commit('removeSpace', id);
                else
                    console.error(res);
            }
            catch (err){
                console.log(err);
            }  
        },
        async getRooms(){
            try{
                let res = await Api().get(`api/qsoft/business/getAllbusinesses/`);
                callback(res.data);
            }
            catch (err){
                console.log(err);
            }
        },
        async addRoom(commit, room) {
            return await Api().post('/api/restaraunt-bar/article/createArticle', room).then(res=>{
                if(res.status == 200){
                    commit('setRoom', res.data);
                }
                else{
                    console.error(res);
                }
            })
        },
        async deleteRoom(commit, id){
            try{
                let res = await Api().delete(`api/restaraunt-bar/article/deleteArticle/${id}`);
                if(res.status == 200)
                    commit('removeRoom', id);
                else
                    console.error(res);
            }
            catch (err){
                console.log(err);
            }  
        },
        async getEquipment(){
            try{
                let res = await Api().get(`api/qsoft/business/getAllbusinesses/`);
                callback(res.data);
            }
            catch (err){
                console.log(err);
            }
        },
        async addEquipment(commit, equipment) {
            return await Api().post('/api/restaraunt-bar/article/createArticle', equipment).then(res=>{
                if(res.status == 200){
                    commit('setEquipment', res.data);
                }
                else{
                    console.error(res);
                }
            })
        },
        async deleteEquipment(commit, id){
            try{
                let res = await Api().delete(`api/restaraunt-bar/article/deleteArticle/${id}`);
                if(res.status == 200)
                    commit('removeEquipment', id);
                else
                    console.error(res);
            }
            catch (err){
                console.log(err);
            }  
        },
        async getSeats(){
            try{
                let res = await Api().get(`api/qsoft/business/getAllbusinesses/`);
                callback(res.data);
            }
            catch (err){
                console.log(err);
            }
        },
        async addSeat(commit, seat) {
            return await Api().post('/api/restaraunt-bar/article/createArticle', seat).then(res=>{
                if(res.status == 200){
                    commit('setSeat', res.data);
                }
                else{
                    console.error(res);
                }
            })
        },
        async deleteSeat(commit, id){
            try{
                let res = await Api().delete(`api/restaraunt-bar/article/deleteArticle/${id}`);
                if(res.status == 200)
                    commit('removeSeat', id);
                else
                    console.error(res);
            }
            catch (err){
                console.log(err);
            }  
        },
        async getRequests(){
            try{
                let res = await Api().get(`api/qsoft/business/getAllbusinesses/`);
                callback(res.data);
            }
            catch (err){
                console.log(err);
            }
        },
        async addRequest(commit, request) {
            return await Api().post('/api/restaraunt-bar/article/createArticle', request).then(res=>{
                if(res.status == 200){
                    commit('setRequest', res.data);
                }
                else{
                    console.error(res);
                }
            })
        },
        async deleteRequest(commit, id){
            try{
                let res = await Api().delete(`api/restaraunt-bar/article/deleteArticle/${id}`);
                if(res.status == 200)
                    commit('removeRequest', id);
                else
                    console.error(res);
            }
            catch (err){
                console.log(err);
            }  
        },
    },  
    mutations:{
        setSpaces(state, spaces){
            state.spaces = spaces;
        },
        addNewSpace(state, space){
            if(!state.spaces) state.spaces = []
            state.spaces.push(space);
        },
        removeSpace(state, id){
            state.spaces = state.spaces.filter(p=>p._id != id);
        },

        setRooms(state, rooms){
            state.rooms = rooms;
        },
        addNewRoom(state, room){
            if(!state.rooms) state.rooms = []
            state.rooms.push(room);
        },
        removeRoom(state, id){
            state.rooms = state.rooms.filter(p=>p._id != id);
        },

        setEquipment(state, equipment){
            state.equipment = equipment;
        },
        addEquipment(state, equipment){
            if(!state.equipment) state.equipment = []
            state.equipment.push(equipment);
        },
        removeEquipment(state, id){
            state.equipments = state.equipments.filter(p=>p._id != id);
        },
        setSeats(state, seat){
            state.seats = seat;
        },
        addSeat(state, seat){
            if(!state.seats) state.seats = []
            state.seats.push(seat);
        },
        removeSeat(state, id){
            state.seats = state.seats.filter(p=>p._id != id);
        },
        setRequests(state, requests){
            state.requests = requests;
        },        
        removeRequest(state, id){
            state.requests = state.requests.filter(p=>p._id != id);
        },
    }
})