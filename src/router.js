// src/router.js
import { createRouter, createWebHistory } from 'vue-router';
import Login from './components/views/Login.vue';
import Register from './components/views/Register.vue';
import UserDashboard from './components/views/UserDashboard.vue';// Mengimpor Unauthorized.vue
import AdminDashboard from './components/views/AdminDashboard.vue';
import ProfileAdmin from './components/views/ProfileAdmin.vue';

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
        name: 'UserDashboard',
        component: UserDashboard, // Ganti ke component di sini

    },
    {
        path: '/home/super-admin',
        name: 'AdminDasboard',
        component: AdminDashboard, // Ganti ke component di sini
    },
    {
        path: '/home/profile/admin',
        name: 'ProfileAdmin',
        component: ProfileAdmin, // Ganti ke component di sini
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
