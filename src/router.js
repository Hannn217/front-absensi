import { createRouter, createWebHistory } from 'vue-router';
import Login from './components/views/Login.vue';
import Register from './components/views/Register.vue';
import UserDashboard from './components/views/UserDashboard.vue';
import SuperDashboard from './components/views/SuperDashboard.vue';
import ProfileAdmin from './components/views/ProfileAdmin.vue';
import KelolaCuti from './components/SuperAdmin/KelolaCuti.vue';
import KelolaKelas from './components/SuperAdmin/KelolaKelas.vue';
import KelolaPegawai from './components/SuperAdmin/KelolaPegawai.vue';

const routes = [
    {
        path: '/',
        name: 'Login',
        component: Login,
    },
    {
        path: '/register',
        name: 'Register',
        component: Register,
    },
    {
        path: '/home/pegawai',
        name: 'UserDashboard',
        component: UserDashboard,
    },
    {
        path: '/home/super-admin',
        name: 'SuperDashboard',
        component: SuperDashboard,
        children: [
            { path: 'pegawai', name: 'KelolaPegawai', component: KelolaPegawai },
            { path: 'kelas', name: 'KelolaKelas', component: KelolaKelas },
            { path: 'cuti', name: 'KelolaCuti', component: KelolaCuti }
        ]
    },
    {
        path: '/home/profile/admin',
        name: 'ProfileAdmin',
        component: ProfileAdmin,
    },
    // Route tambahan untuk halaman Profile Admin
    {
        path: '/profile/:username',
        name: 'Profile',
        component: ProfileAdmin,
        props: true // Agar parameter username bisa diterima sebagai prop di komponen
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

// Middleware sederhana untuk proteksi halaman
router.beforeEach((to, from, next) => {
    const isAuthenticated = !!localStorage.getItem('user');
    if (to.name !== 'Login' && to.name !== 'Register' && !isAuthenticated) {
        next({ name: 'Login' });
    } else {
        next();
    }
});

export default router;
