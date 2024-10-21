// src/router.js
import { createRouter, createWebHistory } from 'vue-router';
import LoginPage from './components/LoginPage.vue';
import RegisterPage from './components/RegisterPage.vue';
import HomePage from './components/Home.vue'; // Impor HomePage

const routes = [
  
    {
        path: '/',
        name: 'Login',
        component: LoginPage,
    },
    {
        path: '/register',
        name: 'Register',
        component: RegisterPage,
    },
    {
        path: '/home',
        name: 'Home',
        component: HomePage, // Rute untuk beranda
    },

];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
