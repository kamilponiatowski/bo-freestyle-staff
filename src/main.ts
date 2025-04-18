import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// Importy stylów
import './assets/styles/main.css'

// Tworzenie aplikacji
const app = createApp(App)

// Używanie routera
app.use(router)

// Montowanie aplikacji do DOM
app.mount('#app')