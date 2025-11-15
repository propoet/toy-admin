import ElementPlus from 'element-plus'
import { createApp } from 'vue'
import i18n from '@/i18n'
import router from '@/router'
import store from '@/store'
import App from './App.vue'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import '@/styles/index.css'

const app = createApp(App)
app.use(router)
app.use(store)
app.use(i18n)
app.use(ElementPlus)
app.mount('#app')
