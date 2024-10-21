// src/main.js
import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; 
// Import router
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap'; // Impor JavaScript Bootstrap
import { BootstrapVue3 } from 'bootstrap-vue-3'; // Impor BootstrapVue



createApp(App)
  .use(router) 
  .use(BootstrapVue3)
  .mount('#app');
  
