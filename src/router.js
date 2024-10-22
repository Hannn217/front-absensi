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
            component: HomePage,
            beforeEnter: (to, from, next) => {
                const isAuthenticated = localStorage.getItem('user');
                const userRole = JSON.parse(localStorage.getItem('user')).role;

                if (isAuthenticated && userRole === 'admin') {
                    next();
                } else {
                    next({ path: '/unauthorized' });
                }
            }
        },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
