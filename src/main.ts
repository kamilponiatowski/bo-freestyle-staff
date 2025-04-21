import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// Importy stylów
import './assets/styles/main.css'

// Importy serwisów
import DataService from './services/DataService'
import LearningListService from './services/LearningListService'
import { showToast } from './services/ToastService'

// Tworzenie aplikacji
const app = createApp(App)

// Używanie routera
app.use(router)

// Rejestracja serwisów globalnie
app.config.globalProperties.$dataService = DataService
app.config.globalProperties.$learningListService = LearningListService
app.config.globalProperties.$showToast = showToast

// Montowanie aplikacji do DOM
app.mount('#app')