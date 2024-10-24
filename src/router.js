// src/router.js
import { createRouter, createWebHistory } from 'vue-router';
import Login from './components/views/Login.vue';
import Register from './components/views/Register.vue';
import Home from './components/views/Home.vue';// Mengimpor Unauthorized.vue

const routes = [
    {
        path: '/',
        name: 'Login',
        component: Login, // Ganti ke component di sini
    },
    {
        path: '/register',
        name: 'Register',
        component: Register, // Ganti ke component di sini
    },
    {
        path: '/home/pegawai',
        name: 'Home',
        component: Home, // Ganti ke component di sini
        
    },

];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
