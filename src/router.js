import { createRouter, createWebHistory } from 'vue-router';
import Login from './components/views/Login.vue';
import Register from './components/views/Register.vue';
import KetuaDashboard from './components/views/KetuaDashboard.vue';
// Super Admin routes
import SuperDashboard from './components/SuperAdmin/SuperDashboard.vue';
import SuperProfile from './components/SuperAdmin/SuperProfile.vue';
import KelolaCuti from './components/SuperAdmin/KelolaCuti.vue';
import KelolaKelas from './components/SuperAdmin/KelolaKelas.vue';
import KelolaPegawai from './components/SuperAdmin/KelolaPegawai.vue';
import UserDashboard from './components/User/UserDashboard.vue';
import PengajuanCuti from './components/User/PengajuanCuti.vue';
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
        children: [
            {
                path: '',
                name: 'Home',
                component: UserDashboard
            },
            {
                path: 'PengajuanCuti',
                name: 'PengajuanCuti',
                component: PengajuanCuti
            },
        ]
    },
   
    {
        path: '/home/super-admin',
        name: 'SuperDashboard',
        component: SuperDashboard,
        children: [
            {
                path: 'pegawai',
                name: 'KelolaPegawai',
                component: KelolaPegawai
            },
            {
                path: 'kelas',
                name: 'KelolaKelas',
                component: KelolaKelas
            },
            {
                path: 'cuti',
                name: 'KelolaCuti',
                component: KelolaCuti
            },
            {
                path: 'profile',
                name: 'SuperProfile',
                component: SuperProfile
            },
        ],
    },
    {
        path: '/profile/:username',
        name: 'UserProfile',
        component: SuperProfile,
        props: true,
    },

    {
        path: '/home/ketua-kelas',
        name: 'KetuaDashboard',
        component: KetuaDashboard,
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    const isAuthenticated = !!localStorage.getItem('user');
    if (to.name !== 'Login' && to.name !== 'Register' && !isAuthenticated) {
        next({ name: 'Login' });
    } else {
        next();
    }
});

export default router;
