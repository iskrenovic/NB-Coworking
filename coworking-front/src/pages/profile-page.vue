<template>
    <div>
        <h3>{{ user.username }}</h3>
        <h3>{{ user.email }}</h3>
    </div>
</template>

<script>
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
    name:'profile-page',
    data(){
        return{
            user:{
                username:'bla',
                email:'',

            }
        }
    }
})
</script>


<style scoped>

</style>
