<template>
    <div class="sidebar">
        <h2 class="sidebar-title">Pegawai</h2>
        <ul class="sidebar-menu">
            <li @click="navigateTo('Home')" :class="{ active: isActive('Home') }">
                <i class="fas fa-home"></i> Home
            </li>
            <li @click="navigateTo('KelolaCuti_user')" :class="{ active: isActive('KelolaCuti_user') }">
                <i class="fas fa-calendar-alt"></i> Kelola Cuti
            </li>
            <li @click="navigateTo('PengajuanCuti')" :class="{ active: isActive('PengajuanCuti') }">
                <i class="fas fa-paper-plane"></i> Mengajukan Cuti
            </li>
            <li @click="logout">
                <i class="fas fa-sign-out-alt"></i> Log Out
            </li>
        </ul>
    </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

function navigateTo(routeName) {
    router.push({ name: routeName });
}

function isActive(routeName) {
    return route.name === routeName;
}

function logout() {
    localStorage.removeItem('user');
    router.push({ name: 'Login' });
}
</script>

<style scoped>
.sidebar {
    width: 250px;
    height: 100vh;
    background-color: #343a40;
    color: white;
    padding: 20px;
}

.sidebar-title {
    font-size: 20px;
    margin-bottom: 20px;
    text-align: center;
}

.sidebar-menu {
    list-style: none;
    padding: 0;
}

.sidebar-menu li {
    padding: 10px 15px;
    margin: 5px 0;
    display: flex;
    align-items: center;
    cursor: pointer;
    transition: background-color 0.3s;
    border-radius: 5px;
}

.sidebar-menu li i {
    margin-right: 10px;
}

.sidebar-menu li.active,
.sidebar-menu li:hover {
    background-color: #495057;
}
</style>
