<template>
	<div class="box">
         <span class="name"></span>
          <a  @click="changePropsValue">点我</a>
	</div>
</template>
<script>

export default {
  data() {
    return {
    
    };
  },
  created() {
  
  },
  mounted() {},

  methods: {
  changePropsValue () {
      console.log(1111111111)
      this.$emit('input', '通过$emit触发input事件了')
    }

  }
};
</script>
<style scoped>
.name {
  font-size: 25px;
  color:#ff5500;
}
</style>
