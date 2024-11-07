<template>
    <div class="dashboard-container">
        <!-- Sidebar -->
        <SidebarAdmin />

        <!-- Content -->
        <div class="content-area">
            <header class="navbar">
                <input type="text" placeholder="Search..." class="search-input" />
                <div class="user-dropdown">
                    <button class="user-button" @click.stop="toggleDropdown">
                        <i class="fas fa-user-circle"></i> {{ username }}
                    </button>
                    <div v-if="dropdownVisible" class="dropdown-menu">
                        <ul>
                            <li @click="navigateToProfile">Profile</li>
                            <li @click="logout">Logout</li>
                        </ul>
                    </div>
                </div>
            </header>

            <!-- Main content for child routes -->
            <main class="main-content">
                <router-view></router-view>
            </main>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import SidebarAdmin from '../views/SidebarAdmin.vue';

const router = useRouter();

const username = ref('');
const dropdownVisible = ref(false);

onMounted(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
        const userObject = JSON.parse(storedUser);
        username.value = userObject.username || 'Guest';
    } else {
        router.push({ name: 'Login' });
    }

    document.addEventListener('click', handleOutsideClick);
});

onBeforeUnmount(() => {
    document.removeEventListener('click', handleOutsideClick);
});

function toggleDropdown() {
    dropdownVisible.value = !dropdownVisible.value;
}

function logout() {
    localStorage.removeItem('user');
    router.push({ name: 'Login' });
}

function navigateToProfile() {
    router.push({ name: 'SuperProfile' });
}

function handleOutsideClick(event) {
    const dropdown = document.querySelector('.user-dropdown');
    if (dropdown && !dropdown.contains(event.target)) {
        dropdownVisible.value = false;
    }
}
</script>

<style scoped>
.dashboard-container {
    display: flex;
    height: 100vh;
}

.sidebar {
    width: 250px;
    position: fixed;
    left: 0;
    top: 0;
    height: 100vh;
    background-color: #343a40;
    overflow-y: auto;
}

.content-area {
    flex: 1;
    margin-left: 250px;
    /* This ensures the content starts after the sidebar */
    display: flex;
    flex-direction: column;
}

.navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 20px;
    background-color: #343a40;
    color: white;
    position: fixed;
    top: 0;
    left: 250px;
    width: calc(100% - 250px);
    z-index: 1000;
}

.main-content {
    padding: 80px 20px;
    margin-top: 60px;
    /* This ensures content starts below the navbar */
    overflow-y: auto;
    background-color: #ffffff;
    height: calc(100vh - 80px);
    /* Adjusts the main content to fit within the view height */
}

.search-input {
    padding: 8px;
    border-radius: 5px;
    border: none;
    width: 300px;
    font-size: 16px;
}

.user-dropdown {
    position: relative;
}

.user-button {
    background-color: transparent;
    border: none;
    color: white;
    font-size: 18px;
    cursor: pointer;
    display: flex;
    align-items: center;
}

.user-button i {
    margin-right: 10px;
}

.dropdown-menu {
    position: absolute;
    top: 100%;
    right: 0;
    background-color: white;
    box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    overflow: hidden;
    z-index: 1500;
}

.dropdown-menu ul {
    list-style: none;
    padding: 0;
    margin: 0;
}

.dropdown-menu li {
    padding: 10px 20px;
    cursor: pointer;
    transition: background-color 0.2s;
}

.dropdown-menu li:hover {
    background-color: #f0f0f0;
}
</style>