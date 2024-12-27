<template>
  <div class="dashboard-container">
    <!-- Sidebar -->
    <div class="sidebar">
      <h2>Dashboard Ketua</h2>
      <ul>
        <li @click="navigateTo('Dashboard')">
          <i class="fas fa-tachometer-alt"></i> Dashboard
        </li>
        <li @click="navigateTo('KelolaAnggota')">
          <i class="fas fa-users"></i> Kelola Anggota
        </li>
        <li @click="navigateTo('LaporanCuti')">
          <i class="fas fa-file-alt"></i> Laporan Cuti
        </li>
      </ul>
    </div>

    <!-- Main Content -->
    <div class="main-content">
      <!-- Header -->
      <div class="header">
        <div class="last-login">Terakhir Login: {{ currentTime }}</div>
        <div class="profile">
          <i class="fas fa-user-circle profile-icon"></i>
          <span class="profile-name">{{ userName }}</span>
        </div>
      </div>

      <!-- Statistik Dashboard -->
      <div class="stats-cards">
        <div
          class="card"
          v-for="(item, index) in ketuaDashboardItems"
          :key="index"
          :style="{ borderLeft: item.color }"
        >
          <div class="card-icon" :style="{ color: item.color.split(' ')[2] }">
            <i class="fas" :class="getCardIcon(index)"></i>
          </div>
          <h3>{{ item.title }}</h3>
          <p>{{ item.subtitle }}</p>
        </div>
      </div>

      <!-- Pengajuan Cuti Table -->
      <div class="pengajuan-list">
        <h2>Pengajuan Cuti Terbaru</h2>
        <table class="pengajuan-table">
          <thead>
            <tr>
              <th>Nama</th>
              <th>Jenis Cuti</th>
              <th>Durasi</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(pengajuan, index) in pengajuanCuti" :key="index">
              <td>{{ pengajuan.nama }}</td>
              <td>{{ pengajuan.jenis_cuti }}</td>
              <td>{{ pengajuan.durasi }} hari</td>
              <td>{{ pengajuan.status }}</td>
              <td>
                <button @click="approveLeave(pengajuan.id)" class="btn-approve">Setujui</button>
                <button @click="rejectLeave(pengajuan.id)" class="btn-reject">Tolak</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Cari Anggota Button -->
    <div class="search-member-section">
      <button @click="showSearchPopup = true" class="btn-search-member">
        <i class="fas fa-search"></i>
      </button>
    </div>

    <!-- Search Member Popup -->
    <div v-if="showSearchPopup" class="search-popup">
      <div class="popup-overlay" @click="closeSearchPopup"></div>
      <div class="popup-content">
        <h3>Cari Anggota</h3>
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Cari anggota berdasarkan username..."
          @input="searchMember"
        />
        <ul class="search-results">
          <li v-for="(member, index) in filteredMembers" :key="index">
            <strong>{{ member.username }}</strong> - {{ member.name }}
          </li>
        </ul>
        <button @click="closeSearchPopup" class="close-popup-btn">Tutup</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      currentTime: new Date().toLocaleString(),
      userName: "",
      ketuaDashboardItems: [
        { title: "Total Anggota", subtitle: "0 Anggota", color: "5px solid #e74c3c" },
        { title: "Cuti Aktif", subtitle: "0 Cuti", color: "5px solid #3498db" },
        { title: "Persetujuan Tertunda", subtitle: "0 Pengajuan", color: "5px solid #f39c12" },
      ],
      pengajuanCuti: [],
      showSearchPopup: false,
      searchQuery: "",
      members: [],
      filteredMembers: [],
    };
  },
  mounted() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      this.userName = user.name;
    }

    setInterval(() => {
      this.currentTime = new Date().toLocaleString();
    }, 1000);

    this.loadDashboardData();
    this.loadPengajuanCuti();
    this.loadMembers();
  },
  methods: {
    navigateTo(page) {
      this.$router.push(`/${page}`);
    },
    async loadDashboardData() {
      try {
        const response = await axios.get("/ketua/dashboard");
        const data = response.data;
        this.ketuaDashboardItems[0].subtitle = `${data.totalAnggota} Anggota`;
        this.ketuaDashboardItems[1].subtitle = `${data.cutiAktif} Cuti`;
        this.ketuaDashboardItems[2].subtitle = `${data.persetujuanTertunda} Pengajuan`;
      } catch (error) {
        console.error("Gagal memuat data dashboard:", error);
      }
    },
    async loadPengajuanCuti() {
      try {
        const response = await axios.get("/ketua/pengajuan");
        this.pengajuanCuti = response.data;
      } catch (error) {
        console.error("Gagal memuat pengajuan cuti:", error);
      }
    },
    async loadMembers() {
      try {
        const response = await axios.get("/members");
        this.members = response.data;
        this.filteredMembers = this.members;
      } catch (error) {
        console.error("Gagal memuat data anggota:", error);
      }
    },
    searchMember() {
      this.filteredMembers = this.members.filter((member) =>
        member.username.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
    closeSearchPopup() {
      this.showSearchPopup = false;
    },
    async approveLeave(id) {
      try {
        await axios.post(`/ketua/pengajuan/${id}/approve`);
        alert("Pengajuan disetujui!");
        this.loadPengajuanCuti();
        this.loadDashboardData();
      } catch (error) {
        console.error("Gagal menyetujui pengajuan:", error);
      }
    },
    async rejectLeave(id) {
      try {
        await axios.post(`/ketua/pengajuan/${id}/reject`);
        alert("Pengajuan ditolak!");
        this.loadPengajuanCuti();
        this.loadDashboardData();
      } catch (error) {
        console.error("Gagal menolak pengajuan:", error);
      }
    },
    getCardIcon(index) {
      switch (index) {
        case 0:
          return "fa-users";
        case 1:
          return "fa-calendar-check";
        case 2:
          return "fa-clock";
        default:
          return "";
      }
    },
  },
};
</script>

<style scoped>
/* Reset and General Styles */
body {
  margin: 0;
  font-family: "Arial", sans-serif;
  background-color: #f4f4f4;
  color: #333;
}

.dashboard-container {
  display: flex;
  min-height: 100vh;
}

/* Sidebar Styles */
.sidebar {
  width: 250px;
  background: #34495e;
  color: white;
  padding: 20px;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
}

.sidebar h2 {
  font-size: 20px;
  text-align: center;
  margin-bottom: 20px;
  border-bottom: 2px solid #2c3e50;
  padding-bottom: 10px;
}

.sidebar ul {
  list-style: none;
  padding: 0;
}

.sidebar ul li {
  padding: 15px;
  margin-bottom: 10px;
  cursor: pointer;
  font-size: 16px;
  background: #2c3e50;
  border-radius: 5px;
  transition: background 0.3s ease, transform 0.2s ease;
}

.sidebar ul li:hover {
  background: #1abc9c;
  transform: translateX(5px);
}

.sidebar ul li i {
  margin-right: 10px;
}

/* Main Content Styles */
.main-content {
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Header Section */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #ffffff;
  padding: 15px 20px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.last-login {
  font-size: 14px;
  color: #777;
}

.profile {
  display: flex;
  align-items: center;
}

.profile-icon {
  font-size: 30px;
  margin-right: 10px;
}

.profile-name {
  font-weight: bold;
  font-size: 16px;
}

/* Stats Cards */
.stats-cards {
  display: flex;
  gap: 20px;
}

.card {
  background: #ffffff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  flex: 1;
  transition: transform 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
}

.card-icon {
  font-size: 40px;
  margin-bottom: 15px;
}

.card h3 {
  font-size: 20px;
  margin: 0;
}

.card p {
  font-size: 14px;
  color: #777;
}

/* Pengajuan Cuti Table */
.pengajuan-list {
  background: #ffffff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.pengajuan-table {
  width: 100%;
  border-collapse: collapse;
}

.pengajuan-table th,
.pengajuan-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.pengajuan-table th {
  background-color: #f8f8f8;
}

.pengajuan-table tr:nth-child(even) {
  background-color: #f9f9f9;
}

.pengajuan-table td button {
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.pengajuan-table td .btn-approve {
  background-color: #2ecc71;
  color: white;
}

.pengajuan-table td .btn-reject {
  background-color: #e74c3c;
  color: white;
}

.pengajuan-table td button:hover {
  opacity: 0.8;
}

/* Search Member Popup */
.search-member-section {
  position: fixed;
  bottom: 20px;
  right: 20px;
}

.search-member-section .btn-search-member {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 15px;
  border-radius: 50%;
  font-size: 20px;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.search-popup {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
}

.popup-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 400px;
}

.popup-content h3 {
  margin-top: 0;
}

.search-results {
  list-style: none;
  padding: 0;
}

.search-results li {
  padding: 10px;
  border-bottom: 1px solid #eee;
}

.close-popup-btn {
  background-color: #e74c3c;
  color: white;
  padding: 10px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
  font-size: 16px;
  margin-top: 10px;
}

</style>
