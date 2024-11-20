// src/main.js
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import { BootstrapVue3 } from 'bootstrap-vue-3';
import axios from 'axios';

// Mengatur base URL untuk semua permintaan Axios dan mengaktifkan kredensial
axios.defaults.baseURL = 'http://localhost:8000/api'; // URL backend Laravel Anda
axios.defaults.withCredentials = true; // Menyertakan cookie dalam setiap permintaan untuk autentikasi

const app = createApp(App);
app.use(router);
app.use(BootstrapVue3);

app.mount('#app');
