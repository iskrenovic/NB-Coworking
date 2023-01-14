<template>
    <div>
       <button @click="goBack">Back</button> 
       <space-list :list="list" type="seat" :owner="owner"/>
    </div>
</template>


<script>
import { defineComponent } from '@vue/composition-api'
import spaceList from '@/components/space-list.vue';
export default defineComponent({
    name:'room-page',
    components:{
        spaceList
    },
    data(){
        return {
            list:[{
                _id:1,
                name:'Mesto1',
                price:1200
            },
            {
                _id:2,
                name:'Mesto2',
                price:1300
            },
            {
                _id:3,
                name:'Mesto3',
                price:1400
            }],
            owner:false
        }
    },
    methods:{
        goBack(){
            this.$router.push({name:'SpacePage'});
        }
    },
    created(){
        this.owner = this.$route.name == "OwnerRoomPage"
    }
})
</script>


<style scoped>

</style>
