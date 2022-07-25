import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import { setupLayouts } from 'virtual:generated-layouts'
import pages from 'virtual:generated-pages'
import {
  qiankunWindow,
  renderWithQiankun,
} from 'vite-plugin-qiankun/dist/helper'
import App from './App.vue'
import './assets'

const name = import.meta.env.VITE_APP_NAME

let app

function render({ container } = {}) {
  app = createApp(App)
  app.use(
    createRouter({
      history: createWebHashHistory(),
      routes: setupLayouts(pages),
    }),
  )
  app.mount((container || document.body).querySelector(`#${name}`))
}

renderWithQiankun({
  bootstrap() {},
  mount: render,
  unmount() {
    app.unmount()
  },
})

if (!qiankunWindow.__POWERED_BY_QIANKUN__)
  render()
