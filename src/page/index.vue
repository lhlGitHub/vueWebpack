<template>
	<div class="page">
 <p class="name" v-for="(item,index) in user" :key=index>
	 {{item.name}}
	 </p>
<a>qq首页</a>
   <img src="../img/cat.png">
   <child v-model="name"></child>
   {{name}}
	</div>
</template>
<script>
// import FN from "../js/common/fn";
import Api from "../js/lib/Api";
import axios from 'axios';
import child from '@/components/child.vue'
export default {
  data() {
    return {
      user: [],
      name:'',
      isTrue:false

    };
  },
  components:{child},
  created() {
    this.name = "大家好，我是3k猫 "
    this.getData();
  },
  async mounted() {
   let res=await this.pro();
   console.log(res)
   console.log(11111111)
   

  },

  methods: {
    getData() {
      axios
        .get("http://localhost:4000/getList")
        .then((res)=> {
         this.user=res.data
        })
        .catch((error)=> {
          console.log(error);
        });
   
    },

     pro(){
         return new Promise((resolve, reject) => {
           setTimeout(()=>{
             resolve(true)
           },5000)
      
       })
     }
    
  }
};
</script>
<style scoped>
.name {
  font-size: 20px;
}
</style>
