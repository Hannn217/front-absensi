<template>
    <div class="dashboard-container">
        <!-- Sidebar -->
        <SidebarUser />

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

            <!-- Main content -->
            <main class="main-content">
                
                <div class="stats-container">
                    <!-- Box 1: Total Pengajuan -->
                    <div class="stat-box pink" @click="openCutiModal">
                        <i class="fas fa-paper-plane"></i>
                        <div class="stat-info">
                            <h3>{{ totalPengajuan }}</h3>
                            <p>Total Pengajuan</p>
                        </div>
                    </div>

                    <!-- Box 2: Pengajuan Ditolak -->
                    <div class="stat-box blue">
                        <i class="fas fa-times-circle"></i>
                        <div class="stat-info">
                            <h3>{{ totalDitolak }}</h3>
                            <p>Pengajuan Ditolak</p>
                        </div>
                    </div>

                    <!-- Box 3: Pengajuan Diproses -->
                    <div class="stat-box green">
                        <i class="fas fa-hourglass-half"></i>
                        <div class="stat-info">
                            <h3>{{ totalDiproses }}</h3>
                            <p>Pengajuan Diproses</p>
                        </div>
                    </div>

                    <!-- Box 4: Pengajuan Diterima -->
                    <div class="stat-box yellow">
                        <i class="fas fa-check-circle"></i>
                        <div class="stat-info">
                            <h3>{{ totalDiterima }}</h3>
                            <p>Pengajuan Diterima</p>
                        </div>
                    </div>
                </div>

                <!-- Riwayat Pengajuan Section -->
                <div class="stats-container">
                    <!-- Riwayat Pengajuan Box -->
                    <div class="stat-box red">
                        <div class="stat-info">
                            <div class="riwayat-header">
                                <h3>Riwayat Pengajuan</h3>
                                <div class="filter-icon">
                                    <button @click="toggleFilterDropdown">
                                        <i class="fas fa-filter"></i>
                                    </button>
                                    <div v-if="filterDropdownVisible" class="filter-dropdown">
                                        <ul>
                                            <li @click="filterRiwayat('hari-ini')">Hari Ini</li>
                                            <li @click="filterRiwayat('minggu-ini')">Minggu Ini</li>
                                            <li @click="filterRiwayat('bulan-ini')">Bulan Ini</li>
                                            <li @click="filterRiwayat('semua')">Semua</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div class="riwayat-content">
                                <div v-if="!riwayatPengajuan.length">
                                    <p class="no-data">Tidak Ada Data Pengajuan</p>
                                </div>
                                <div v-else>
                                    <!-- Tambahkan logika untuk menampilkan data riwayat -->
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
        

        <!-- Modal Ajukan Cuti -->
        <div v-if="isCutiModalOpen" class="modal-overlay" @click="closeCutiModal">
            <div class="modal" @click.stop>
                <h2>Ajukan Cuti</h2>
                <form @submit.prevent="submitCuti">
                    <label for="cuti-date">Tanggal Cuti:</label>
                    <input type="date" id="cuti-date" v-model="cutiDate" required />

                    <label for="cuti-reason">Alasan Cuti:</label>
                    <textarea id="cuti-reason" v-model="cutiReason" required></textarea>

                    <button type="submit">Ajukan</button>
                    <button type="button" @click="closeCutiModal">Batal</button>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import SidebarUser from '../views/SidebarUser.vue';

const router = useRouter();

const username = ref('');
const dropdownVisible = ref(false);

// Statistik cuti
const totalPengajuan = ref(0);
const totalDitolak = ref(0);
const totalDiproses = ref(0);
const totalDiterima = ref(0);

// Data Riwayat Pengajuan
const riwayatPengajuan = ref([]); // Kosongkan data awalnya

// State untuk modal cuti
const isCutiModalOpen = ref(false);
const cutiDate = ref('');
const cutiReason = ref('');

// State untuk filter dropdown
const filterDropdownVisible = ref(false);

onMounted(() => {
    // Fetch data pengguna
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
        const userObject = JSON.parse(storedUser);
        username.value = userObject.username || 'Guest';
    } else {
        router.push({ name: 'Login' });
    }

    // Simulasi fetch data statistik cuti (gunakan API di produksi)
    totalPengajuan.value = 0; // Total pengajuan
    totalDitolak.value = 0; // Total pengajuan ditolak
    totalDiproses.value = 0; // Total pengajuan diproses
    totalDiterima.value = 0; // Total pengajuan diterima

    // Simulasi fetch data riwayat pengajuan (gunakan API di produksi)
    riwayatPengajuan.value = []; // Kosongkan data sebagai simulasi
});

function toggleDropdown() {
    dropdownVisible.value = !dropdownVisible.value;
}

function logout() {
    localStorage.removeItem('user');
    router.push({ name: 'Login' });
}

function navigateToProfile() {
    router.push({ name: 'UserProfile' });
}

function openCutiModal() {
    isCutiModalOpen.value = true;
}

function closeCutiModal() {
    isCutiModalOpen.value = false;
}

function submitCuti() {
    console.log('Tanggal Cuti:', cutiDate.value);
    console.log('Alasan Cuti:', cutiReason.value);
    // Tambahkan logika untuk mengirim data cuti ke server
    alert('Pengajuan cuti berhasil!');
    closeCutiModal();
}

function toggleFilterDropdown() {
    filterDropdownVisible.value = !filterDropdownVisible.value;
}

function filterRiwayat(filterType) {
    console.log('Filter diterapkan:', filterType);
    // Tambahkan logika untuk filter riwayat berdasarkan filterType
    filterDropdownVisible.value = false;
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
    background-color: #2c3e50;
    overflow-y: auto;
}

.content-area {
    flex: 1;
    margin-left: 250px;
    display: flex;
    flex-direction: column;
}

.navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 20px;
    background-color: #2c3e50;
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
    background-color: #ffffff;
    height: calc(100vh - 80px);
    overflow-y: auto;
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

.stats-container {
    display: flex;
    justify-content: space-between;
    gap: 20px;
    margin-top: 20px;
}

.stat-box {
    flex: 1;
    border-radius: 10px;
    padding: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    cursor: pointer;
    color: white;
}

.stat-box:hover {
    transform: translateY(-5px);
    box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.2);
}

.stat-box i {
    font-size: 32px; /* Ukuran icon lebih kecil */
    opacity: 0.8;
}

.stat-info h3 {
    font-size: 24px;
    margin: 0;
}

.stat-info p {
    font-size: 16px;
    margin: 5px 0 0;
}

/* Warna khusus untuk setiap box */
.pink {
    background-color: #ff6f91; /* Pink */
}

.blue {
    background-color: #4fc3f7; /* Biru */
}

.green {
    background-color: #81c784; /* Hijau */
}

.yellow {
    background-color: #ffd54f; /* Kuning */
}

.red {
    background-color: #e57373; /* Merah */
}

/* Riwayat Pengajuan Section */
.riwayat-content {
    margin-top: 15px;
    background-color: white;
    padding: 15px;
    border-radius: 10px;
}

.riwayat-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 15px;
    justify-content: space-between; /* Pindahkan filter ke kanan */
}

.riwayat-header h3 {
    margin: 0;
    font-size: 20px;
    font-weight: bold;
}

.filter-icon {
    position: relative;
}

.filter-icon button {
    background: none;
    border: none;
    font-size: 14px;
    cursor: pointer;
    color: white;
    display: flex;
    align-items: center;
}

.filter-icon button i {
    font-size: 16px;
}

.filter-dropdown {
    position: absolute;
    top: 100%;
    right: 0;
    color: #1a242f;
    background-color: white;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    overflow: hidden;
    z-index: 1500;
}

.filter-dropdown ul {
    list-style: none;
    padding: 0;
    margin: 0;
}

.filter-dropdown li {
    padding: 10px 20px;
    cursor: pointer;
    transition: background-color 0.2s;
}

.filter-dropdown li:hover {
    background-color: #f0f0f0;
}

.no-data {
    color: black;
    text-align: center;
    margin: 0;
    font-size: 16px;
}

/* Modal styling */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2000;
}

.modal {
    background-color: white;
    padding: 20px;
    border-radius: 10px;
    width: 400px;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
}

.modal h2 {
    margin: 0 0 20px;
    font-size: 24px;
    text-align: center;
}

.modal form {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.modal form label {
    font-weight: bold;
}

.modal form input,
.modal form textarea {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    width: 100%;
    font-size: 16px;
}

.modal form button {
    padding: 10px;
    border: none;
    border-radius: 5px;
    background-color: #2c3e50;
    color: white;
    font-size: 16px;
    cursor: pointer;
}

.modal form button:hover {
    background-color: #1a242f;
}
</style>
