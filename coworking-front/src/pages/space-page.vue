<template>
    <div>
       <button @click="goBack">Back</button> 
       <space-list :list="list" type="rooms" :owner="owner"/>
    </div>
</template>


<script>
import { defineComponent } from '@vue/composition-api'
import spaceList from '@/components/space-list.vue';
export default defineComponent({
    name:'space-page',
    components:{
        spaceList
    },
    data(){
        return {
            list:[{
                _id:1,
                name:'Zuta soba',
                area:45,
                floor:0,
                seatCount:5
            },
            {
                _id:2,
                name:'Zelena soba',
                area:45,
                floor:0,
                seatCount:5
            },
            {
                _id:3,
                name:'Crvena soba',
                area:45,
                floor:0,
                seatCount:5
            }],
            owner:false
        }
    },
    methods:{
        goBack(){
            this.$router.push({name:'Homepagemain'});
        }
    },
    created(){
        this.owner = this.$route.name == "OwnerSpacePage"
    }
})
</script>


<style scoped>

</style>
