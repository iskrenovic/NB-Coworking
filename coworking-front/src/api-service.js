import Vue from 'vue'
import Vuex from 'vuex'
import Api from '@/dbConnection'
Vue.use(Vuex)

export default new Vuex.Store({
    state:{
        user:null,
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
        },
        getUser(state){
            return state.user;
        }
    },
    actions:{
        async createAccount({commit}, account) {
            let url = "";
            switch(account.role){
                case 'owner':
                    url = '/api/register/createOwner'
                    break;
                case 'business':
                    url = '/api/register/createBusiness'
                    break;
                case 'freelancer':
                    url = '/api/register/createFreelancer'
                    break;
            }
            return await Api().post(url, account).then(res=>{
                if(res.status == 200){
                    commit('setUser', res.data);
                    Vue.$cookies.set('uId', res.data.ID,"24h");
                    account.callback(true);
                }
                else{
                    console.error(res);
                }
            })
        },
        async login({commit}, req){
            return await Api().post('/api/login/', req.user).then(res=>{
                if(res.status == 200){
                    commit('setUser', res.data);
                    Vue.$cookies.set('uId', res.data.ID,"24h");
                    req.callback(true);
                }
                else{
                    console.error(res);
                }
            })
        },
        async getUser({commit},id){
            try{
                let res = await Api().get(`api/user/getUser/${id}`);
                if(res.status == 200){
                    commit('setUser', res.data);
                }
                else{
                    console.error(res.data);
                }
            }
            catch (err){
                console.log(err);
            }
        },
        async getUserWithCallback({commit},req){
            try{
                let res = await Api().get(`api/user/getUser/${req.id}`);
                if(res.status == 200){
                    commit('setUser', res.data);
                    req.callback(res.data);
                }
                else{
                    console.error(res.data);
                    req.callback(false);
                }
            }
            catch (err){
                console.log(err);
            }
        },
        async getSpaces(){
            try{
                let res = await Api().get(`api/space/business/getAllbusinesses/`);
                console.log(res.data);
            }
            catch (err){
                console.log(err);
            }
        },
        async addSpace({commit}, space) {
            return await Api().post('/api/space/createSpace', space).then(res=>{
                if(res.status == 200){
                    commit('addNewSpace', res.data);
                }
                else{
                    console.error(res);
                }
            })
        },
        async deleteSpace({commit}, id){
            try{
                let res = await Api().delete(`api/space/deleteSpace/${id}`);
                if(res.status == 200)
                    commit('removeSpace', id);
                else
                    console.error(res);
            }
            catch (err){
                console.log(err);
            }  
        },
        async getSpacesByUserId({commit}, req){
            try{
                let res = await Api().get(`api/space/getSpaceByOwnerId/${req.userID}`);
                if(res.status == 200){
                    req.callback(res.data);
                    commit('setSpaces', res.data);
                }
                else{
                    req.callback([]);
                }
                console.log(res.data);
            }
            catch (err){
                console.log(err);
            }
        },
        async getRoomsBySpaceID({commit}, req){
            try{
                let res = await Api().get(`api/room/getRoomsBySpaceId/${req.id}`);
                if(res.status == 200){
                    commit('setRooms', res.data);
                    req.callback(res.data);
                }
                else{
                    console.error(res.data);
                }
            }
            catch (err){
                console.error(err);
            }
        },
        async addRoom({commit}, room) {
            return await Api().post('/api/room/createRoom/', room).then(res=>{
                if(res.status == 200){
                    commit('addNewRoom', res.data);
                }
                else{
                    console.error(res);
                }
            })
        },
        async deleteRoom({commit}, id){
            try{
                let res = await Api().delete(`api/room/deleteRoom/${id}`);
                if(res.status == 200)
                    commit('removeRoom', id);
                else
                    console.error(res);
            }
            catch (err){
                console.log(err);
            }  
        },
        async getEquipment({commit}, id){
            try{
                let res = await Api().get(`api/equipment/getEquipment/${id}`);
                if(res.status == 200){
                    commit('setEquipment',res.data);
                }
                else{
                    console.error(res.data);
                }
            }
            catch (err){
                console.log(err);
            }
        },
        async getEquipmentByUserId({commit}, id){
            try{
                let res = await Api().get(`api/equipment/getEquipmentByUserId/${id}`);
                if(res.status == 200){
                    commit('setEquipment',res.data);
                }
                else{
                    console.error(res.data);
                }
                console.log(res.data);
            }
            catch (err){
                console.log(err);
            }
        },
        async addEquipment(commit, equipment) {
            return await Api().post('/api/equipment/createEquipment/', equipment).then(res=>{
                if(res.status == 200){
                    commit('addEquipment', res.data);
                }
                else{
                    console.error(res);
                }
            })
        },
        async deleteEquipment(commit, id){
            try{
                let res = await Api().delete(`api/equipment/article/deleteArticle/${id}`);
                if(res.status == 200)
                    commit('removeEquipment', id);
                else
                    console.error(res);
            }
            catch (err){
                console.log(err);
            }  
        },
        async getSeats({commit}, id){
            try{
                let res = await Api().get(`api/place/getPlace/${id}`);
                if(res.status==200){
                commit('setSeats', res.data);
                }
                console.log(res.data);
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
                console.log(res.data);
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
        setUser(state, user){
            state.user = user;
        },
        setSpaces(state, spaces){
            state.spaces = spaces;
        },
        addNewSpace(state, space){
            if(!state.spaces) state.spaces = []
            state.spaces.push(space);
        },
        removeSpace(state, id){
            state.spaces = state.spaces.filter(p=>p.ID != id);
        },

        setRooms(state, rooms){
            state.rooms = rooms;
        },
        addNewRoom(state, room){
            if(!state.rooms) state.rooms = []
            state.rooms.push(room);
        },
        removeRoom(state, id){
            state.rooms = state.rooms.filter(p=>p.ID != id);
        },

        setEquipment(state, equipment){
            state.equipment = equipment;
        },
        addEquipment(state, equipment){
            if(!state.equipment) state.equipment = []
            state.equipment.push(equipment);
        },
        removeEquipment(state, id){
            state.equipments = state.equipments.filter(p=>p.ID != id);
        },
        setSeats(state, seat){
            state.seats = seat;
        },
        addSeat(state, seat){
            if(!state.seats) state.seats = []
            state.seats.push(seat);
        },
        removeSeat(state, id){
            state.seats = state.seats.filter(p=>p.ID != id);
        },
        setRequests(state, requests){
            state.requests = requests;
        },        
        removeRequest(state, id){
            state.requests = state.requests.filter(p=>p.ID != id);
        },
    }
})