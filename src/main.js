import Vue from 'vue'
import App from './App.vue'
import Vuelidate from 'vuelidate'
import PrettyCheckbox from 'pretty-checkbox-vue'

Vue.config.productionTip = false

Vue.use(Vuelidate)

Vue.use(PrettyCheckbox)

new Vue({
  render: (h) => h(App),
}).$mount('#app')
