<template>
    <van-tabbar v-model="active"  @change="change" >
        <van-tabbar-item :name="item.key" v-for='(item,index) in tabbarList' :key="index" :icon="item.icon">{{item.label}}</van-tabbar-item>
        </van-tabbar>

</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import {  useStore  } from 'vuex'
const active = ref(0);
const route = useRouter()
const store = useStore()
const tabbarList = ref([
    {
      icon:"home-o",
      key:0,
      href:'/',
      label:'廣場',
      name:'home',
    },
    {
      icon:"records-o",
      key:1,
      href:'/feedback',
      label:'反馈',
      name:'feedback',
    },
    {
      icon:"user-o",
      key:2,
      href:'/my',
      label:'我的',
      name:'my',
    },
])
const change = (e: number)=>{
    let activeObject = tabbarList.value.filter(item=>active.value == item.key)[0]
    console.log(activeObject)
    if(!store.state.userLogined){
        if(activeObject.key== 2 || activeObject.key== 1){
            store.commit('triggerAuth', true);
        }else{
            route.push(activeObject.href)
        }
        
        
    }else{
        console.log(activeObject.href)
    route.push(activeObject.href)
    }
    
    
   
    
}
</script>
<style lang="scss" scoped></style>