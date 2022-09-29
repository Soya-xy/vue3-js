import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Pages from 'vite-plugin-pages'
import Layouts from 'vite-plugin-vue-layouts'
import Unocss from 'unocss/vite'
import transformerDirective from '@unocss/transformer-directives'
import Components from 'unplugin-vue-components/vite'
import { VantResolver } from 'unplugin-vue-components/resolvers'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import AutoImport from 'unplugin-auto-import/vite'
import visualizer from 'rollup-plugin-visualizer'
import { minify } from 'html-minifier'
import { name } from './package.json'

process.env.VITE_APP_NAME = name
require('dotenv-flow').config({
  node_env: process.env.NODE_ENV || 'development',
})
const prod = process.env.NODE_ENV === 'production'

const apiPrefix = `${process.env.ROOT || '/'}api`
const apiRegexp = new RegExp(`^${apiPrefix}`)

const minimizeIndex = () => {
  return {
    name: 'html-transform',
    transformIndexHtml(html) {
      return minify(html, {
        collapseWhitespace: true,
      })
    },
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
        modifyVars: {
          'page-header-padding-left': '16px',
          'page-header-padding-right': 0,
          'page-header-padding-vertical': '8px',
        },
      },
    },
  },
  base: process.env.ROOT,
  plugins: [
    vue({
      reactivityTransform: true,
    }),
    AutoImport({
      imports: [
        'vue',
        'vue/macros',
        'vue-router',
        '@vueuse/core',
        { 'vue-request': ['useRequest', 'usePagination'] },
        { '@/utils/ajax': ['api'] },
      ],
      dirs: [
        './src/api',
      ],
      eslintrc: {
        enabled: true, // Default `false`
        filepath: './.eslintrc-auto-import.json', // Default `./.eslintrc-auto-import.json`
        globalsPropValue: true, // Default `true`, (true | false | 'readonly' | 'readable' | 'writable' | 'writeable')
      },
      dts: true,
    }),
    Pages(),
    Layouts(),
    Components({
      dts: true,
      directoryAsNamespace: true,
      resolvers: [
        VantResolver({
          importStyle: 'less',
          resolveIcons: true,
        }),
        IconsResolver(),
      ],
    }),
    Icons(),
    // https://github.com/antfu/unocss
    Unocss({
      transformers: [
        transformerDirective(),
      ],
    }),
    prod && minimizeIndex(),
    prod && visualizer({ brotliSize: true }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@i': path.resolve(__dirname, 'src/assets/images'),
    },
  },
  server: {
    proxy: {
      [apiPrefix]: {
        target: `http://${process.env.API_SERVER}`,
        rewrite: path => path.replace(apiRegexp, ''),
      },
    },
  },
})
