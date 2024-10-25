// src/main.js
import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; 

// Import Bootstrap and BootstrapVue CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap'; // Import Bootstrap JavaScript
import { BootstrapVue3 } from 'bootstrap-vue-3'; // Import BootstrapVue
import axios from 'axios'; // Import Axios

// Set the base URL for Axios
axios.defaults.baseURL = 'http://localhost:8000/api'; // Update to your API's base URL

// Create Vue app and use router and BootstrapVue3
const app = createApp(App);
app.use(router);
app.use(BootstrapVue3);

// Mount the app
app.mount('#app');
