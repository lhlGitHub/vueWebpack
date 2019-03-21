import Vue from 'vue'
import App from '@/page/index.vue'
import  '@/css/rest.css'
import  '@/css/index.less'

new Vue({
    el:'#app',
    // render:h=>h(App)
    template:'<App/>',
    components:{App}
})