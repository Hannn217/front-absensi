<script setup>
import SidebarAdmin from './SidebarAdmin.vue';
</script>

<template>
    <div class="dashboard-container">
        <SidebarAdmin />
        <!-- Bagian kanan untuk konten (header, search bar, dll.) -->
        <div class="content-area">
            <!-- Header untuk search bar dan user button -->
            <header class="navbar">
                <input type="text" placeholder="Search..." v-model="searchQuery" class="search-input" />

                <div class="user-dropdown">
                    <button @click="toggleDropdown" class="user-button">
                        <i class="fas fa-user-circle"></i> {{ username }}
                    </button>
                    <div v-if="dropdownVisible" class="dropdown-menu">
                        <ul>
                            <li @click="navigateTo('Profile')">Profile</li>
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

<script>
export default {
    name: 'AdminDashboard',
    data() {
        return {
            username: 'Guest',  // Default ke 'Guest' jika tidak ada username
            searchQuery: '', // Untuk search bar
            dropdownVisible: false, // Untuk mengontrol visibility dropdown
        };
    },
    created() {
        const storedUser = localStorage.getItem('user'); // Ambil data user dari localStorage
        if (storedUser) {
            const userObject = JSON.parse(storedUser); // Parsing JSON string menjadi objek
            this.username = userObject.username || 'Guest'; // Set username jika ada, jika tidak ada tampilkan Guest
        }
    },
    methods: {
        navigateTo(routeName) {
            if (routeName === 'Profile') {
                this.$router.push({ name: 'Profile', params: { username: this.username } });
            } else {
                this.$router.push({ name: routeName });
            }
        },
        logout() {
            console.log('User logged out');
            localStorage.removeItem('user');
            this.$router.push({ name: 'Login' });
        },
        toggleDropdown() {
            this.dropdownVisible = !this.dropdownVisible;
        },
        closeDropdown() {
            this.dropdownVisible = false;
        },
        handleOutsideClick(event) {
            if (!this.$el.contains(event.target)) {
                this.closeDropdown();
            }
        }
    },
    mounted() {
        document.addEventListener('click', this.handleOutsideClick);
    },
    beforeDestroy() {
        document.removeEventListener('click', this.handleOutsideClick);
    }
};
</script>

<style scoped>
.dashboard-container {
    display: flex;
    height: 100vh;
    background-color: #f0f4f8;
}

/* Sidebar diatur oleh komponen SidebarAdmin */
.content-area {
    flex: 1;
    display: flex;
    flex-direction: column;
    margin-left: 250px;
    /* Pastikan jarak dari sidebar sesuai */
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
    /* Sama dengan width dari sidebar untuk menyesuaikan */
    width: calc(100% - 250px);
    /* Kurangi lebar sidebar dari total width */
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
    z-index: 1000;
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
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
    margin-top: 60px;
    /* Beri jarak agar konten tidak tertutup oleh navbar */
}
</style>
