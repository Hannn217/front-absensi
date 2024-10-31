<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import SidebarAdmin from '../SidebarAdmin.vue';

const router = useRouter();
const username = ref(''); // Nama user yang diambil dari localStorage
const dropdownVisible = ref(false); // Kontrol visibility dropdown

// Ambil data user saat komponen dibuat
onMounted(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
        const userObject = JSON.parse(storedUser);
        username.value = userObject.username || 'Guest';
    } else {
        router.push({ name: 'Login' }); // Redirect ke login jika tidak ada user
    }

    document.addEventListener('click', handleOutsideClick);
});

onBeforeUnmount(() => {
    document.removeEventListener('click', handleOutsideClick);
});

// Fungsi untuk toggle dropdown
function toggleDropdown() {
    dropdownVisible.value = !dropdownVisible.value;
    console.log("Dropdown toggled. Visible:", dropdownVisible.value);
    if (!dropdownVisible.value) {
        console.warn("Dropdown should have opened, but it's closed. Check CSS or event bindings.");
    }
}

// Fungsi untuk logout
function logout() {
    localStorage.removeItem('user');
    router.push({ name: 'Login' });
}

// Fungsi untuk navigasi ke profil
function navigateToProfile() {
    router.push({ name: 'Profile', params: { username: username.value } });
}

// Fungsi untuk menutup dropdown saat klik di luar elemen dropdown
function handleOutsideClick(event) {
    const dropdown = document.querySelector('.user-dropdown');
    if (dropdown && !dropdown.contains(event.target)) {
        if (dropdownVisible.value) {
            console.log("Clicked outside of dropdown. Closing dropdown.");
            dropdownVisible.value = false;
        } else {
            console.warn("Dropdown is already closed.");
        }
    }
}
</script>

<template>
    <div class="dashboard-container">
        <div class="content-area">
            <SidebarAdmin />

            <header class="navbar">
                <input type="text" placeholder="Search..." class="search-input" />

                <div class="user-dropdown">
                    <button class="user-button" @click.stop="toggleDropdown">
                        <i class="fas fa-user-circle"></i> {{ username }}
                    </button>
                    <!-- Dropdown menu -->
                    <div v-if="dropdownVisible" class="dropdown-menu">
                        <ul>
                            <li @click="navigateToProfile">Profile</li>
                            <li @click="logout">Logout</li>
                        </ul>
                    </div>
                </div>
            </header>

            <main class="main-content">
                <router-view />
            </main>
        </div>
    </div>
</template>

<style scoped>
.dashboard-container {
    display: flex;
    height: 100vh;
    background-color: #f0f4f8;
}

.content-area {
    flex: 1;
    display: flex;
    flex-direction: column;
    margin-left: 250px;
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
    display: block !important;
    /* Paksa tampil untuk debugging */
    border: 2px solid red;
    /* Beri border untuk melihat posisinya */
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

.main-content {
    flex: 1;
    padding: 80px 20px;
    background-color: #ffffff;
    margin-top: 60px;
}
</style>
