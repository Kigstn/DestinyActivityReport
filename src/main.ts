import './assets/style.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import {useDestinyManifestStore} from "@/funcs/store";

const app = createApp(App)

app.use(createPinia())

// initialise this at the start. We NEED the destiny manifest for everything
const _store = useDestinyManifestStore()
await _store.updateManifest()

app.use(router)

app.mount('#app')
