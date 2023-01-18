<template>
  <div id="app">
    <router-view/>    
  </div>
</template>

<script>

export default {
  name: 'App',
  async created(){
      if(this.$cookies.get('uId')){
        await this.$store.dispatch('getUser', this.$cookies.get('uId'));        
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
