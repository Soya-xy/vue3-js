import { createApp } from 'vue'

import App from './App.vue'
import router from './router'
import './assets'

const app = createApp(App)
app.use(
  router,
)

app.directive('desensitization', (el) => {
  if (el.innerHTML) {
    // 手机号脱敏
    el.innerHTML = el.innerHTML.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
  }
})

app.mount('#app')
