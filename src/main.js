import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import { setupLayouts } from 'virtual:generated-layouts'
import pages from 'virtual:generated-pages'
import App from './App.vue'
import './assets'

const app = createApp(App)
app.use(
  createRouter({
    history: createWebHashHistory(),
    routes: setupLayouts(pages),
  }),
)
app.mount(document.body)
