import { createRouter, createWebHashHistory } from 'vue-router'
import { setupLayouts } from 'virtual:generated-layouts'
import pages from 'virtual:generated-pages'
import { title } from '~/store/app'
const router = createRouter({
  history: createWebHashHistory(),
  routes: setupLayouts(pages),
})

router.beforeEach((to, from, next) => {
  title.value = to.meta.title
  next()
})
export default router
