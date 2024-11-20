<template>
  <div class="dashboard-container">
    <div class="sidebar">
      <h2>ABSENSI</h2>
      <ul>
        <li @click="navigateTo('Dashboard')">
          <i class="fas fa-tachometer-alt"></i> Dashboard
        </li>
        <li @click="openLeaveModal">
          <i class="fas fa-plane"></i> Pengajuan Cuti
        </li>
      </ul>
    </div>

    <div class="main-content">
      <div class="header">
        <div class="last-login">Terakhir Login: {{ currentTime }}</div>
        <div class="profile">
          <i class="fas fa-user-circle profile-icon"></i>
          <span class="profile-name">{{ userName }}</span>
          <span class="username-display">{{ username }}</span>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="stats-cards">
        <div
          class="card"
          v-for="(item, index) in dashboardItems"
          :key="index"
          :style="{ borderLeft: item.color }"
          @click="index === 1 ? openGoogleMaps() : index === 2 ? openProfileModal() : null"
        >
          <div class="card-icon" :style="{ color: item.color.split(' ')[2] }">
            <i class="fas" :class="getCardIcon(index)"></i>
          </div>
          <h3>{{ item.title }}</h3>
          <p>{{ item.subtitle }}</p>
        </div>
      </div>

      <button @click="openLeaveModal" class="add-absen-button full-width">
        <i class="fas fa-plus-circle"></i>
      </button>

      <!-- Leave Modal -->
      <div v-if="showLeaveModal" class="modal-overlay">
        <div class="modal-content">
          <h2>Pengajuan Cuti <button class="close-modal" @click="closeLeaveModal">&times;</button></h2>
          <form @submit.prevent="submitLeave">
            <label for="jenis_cuti">Jenis Cuti:</label>
            <select v-model="leaveData.jenis_cuti" required>
              <option value="Cuti Bulanan">Cuti Bulanan</option>
              <option value="Cuti Mingguan">Cuti Mingguan</option>
            </select>

            <label for="tanggal_mulai">Tanggal Mulai:</label>
            <input v-model="leaveData.tanggal_mulai" type="date" required />

            <label for="tanggal_selesai">Tanggal Selesai:</label>
            <input v-model="leaveData.tanggal_selesai" type="date" required />

            <label for="keterangan">Alasan:</label>
            <input v-model="leaveData.keterangan" type="text" required />

            <label for="alamat">Alamat Cuti:</label>
            <input v-model="leaveData.alamat" type="text" required />

            <div class="modal-buttons">
              <button type="submit" :disabled="loadingLeave">
                {{ loadingLeave ? 'Mengirim...' : 'Ajukan Cuti' }}
              </button>
              <button type="button" @click="closeLeaveModal">Batal</button>
            </div>
          </form>
          <p v-if="leaveErrorMessage" class="error-message">{{ leaveErrorMessage }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

axios.defaults.baseURL = "http://localhost:8000/api"; // Sesuaikan dengan server
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default {
  data() {
    return {
      showLeaveModal: false,
      loadingLeave: false,
      leaveErrorMessage: "",
      leaveData: this.initializeLeaveData(),
      dashboardItems: [
        { title: "Total Pengajuan Cuti", subtitle: "0 Pengajuan", color: "5px solid #e74c3c" },
        { title: "Cuti Diterima", subtitle: "0 Diterima", color: "5px solid #f39c12" },
        { title: "Cuti Progres", subtitle: "0 Dalam Progres", color: "5px solid #3498db" },
        { title: "Cuti Ditolak", subtitle: "0 Ditolak", color: "5px solid #2ecc71" },
      ],
      totalPengajuan: 0, // Menyimpan total asli dari server
      userName: "",
      username: "",
      currentTime: new Date().toLocaleString(),
      timeInterval: null,
    };
  },
  mounted() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      this.userName = user.name;
      this.username = user.username;
    }
    this.timeInterval = setInterval(() => {
      this.currentTime = new Date().toLocaleString();
    }, 1000);

    this.initializeDashboardData();
  },
  beforeDestroy() {
    clearInterval(this.timeInterval);
  },
  methods: {
    navigateTo(page) {
      this.$router.push(`/${page}`);
    },
    openLeaveModal() {
      this.showLeaveModal = true;
      this.leaveData = this.initializeLeaveData();
    },
    closeLeaveModal() {
      this.showLeaveModal = false;
      this.leaveErrorMessage = "";
      this.resetLeaveData();
    },
    initializeLeaveData() {
      return {
        jenis_cuti: "",
        alamat: "",
        tanggal_mulai: "",
        tanggal_selesai: "",
        keterangan: "",
      };
    },
    resetLeaveData() {
      this.leaveData = this.initializeLeaveData();
    },
    async submitLeave() {
      this.loadingLeave = true;
      try {
        const response = await axios.post("/pengajuan", this.leaveData);
        alert("Pengajuan cuti berhasil!");
        this.closeLeaveModal();

        // Tambahkan pengajuan baru
        this.totalPengajuan++;
        this.updateDashboard();
        this.saveToLocalStorage();

        // Refresh data dari server
        this.fetchLeaveData();
      } catch (error) {
        if (error.response && error.response.status === 422) {
          this.leaveErrorMessage = "Terjadi kesalahan pada data yang Anda masukkan.";
        } else if (error.response && error.response.status === 401) {
          this.leaveErrorMessage = "Anda tidak memiliki akses. Silakan login kembali.";
          localStorage.removeItem("token");
          this.$router.push("/");
        } else {
          this.leaveErrorMessage = "Terjadi kesalahan. Silakan coba lagi.";
        }
      } finally {
        this.loadingLeave = false;
      }
    },
    async fetchLeaveData() {
      try {
        const response = await axios.get("/pengajuan/leave-status");
        const leaveStatusData = response.data;

        // Perbarui data dashboard
        this.totalPengajuan = leaveStatusData.total;
        this.dashboardItems[1].subtitle = `${leaveStatusData.accepted} Diterima`;
        this.dashboardItems[2].subtitle = `${leaveStatusData.inProgress} Dalam Progres`;
        this.dashboardItems[3].subtitle = `${leaveStatusData.rejected} Ditolak`;

        this.updateDashboard();
        this.saveToLocalStorage();
      } catch (error) {
        console.error("Failed to fetch leave data:", error);
      }
    },
    initializeDashboardData() {
      // Coba muat data dari localStorage
      const storedData = localStorage.getItem("dashboardData");
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        this.totalPengajuan = parsedData.totalPengajuan;
        this.dashboardItems = parsedData.dashboardItems;
      } else {
        this.fetchLeaveData(); // Jika tidak ada data, ambil dari server
      }
    },
    updateDashboard() {
      this.dashboardItems[0].subtitle = `${this.totalPengajuan} Pengajuan`;
    },
    saveToLocalStorage() {
      const dashboardData = {
        totalPengajuan: this.totalPengajuan,
        dashboardItems: this.dashboardItems,
      };
      localStorage.setItem("dashboardData", JSON.stringify(dashboardData));
    },
    async acceptLeave(id) {
      try {
        await axios.post(`/pengajuan/${id}/accept`);
        this.totalPengajuan--;
        this.updateDashboard();
        this.saveToLocalStorage();
        alert("Pengajuan berhasil diterima!");
      } catch (error) {
        console.error("Gagal menerima pengajuan:", error);
      }
    },
    // Fungsi untuk mendapatkan ikon berdasarkan index
    getCardIcon(index) {
      switch (index) {
        case 0:
          return "fa-calendar-check"; // Ikon untuk total pengajuan
        case 1:
          return "fa-check-circle"; // Ikon untuk cuti diterima
        case 2:
          return "fa-pause-circle"; // Ikon untuk cuti dalam progres
        case 3:
          return "fa-times-circle"; // Ikon untuk cuti ditolak
        default:
          return ""; // Default jika tidak ada ikon yang sesuai
      }
    },
  },
};

</script>



<style scoped>
/* Add your styles here */
/* Modal Overlay */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  animation: fadeIn 0.3s ease-in-out;
  z-index: 1000;
}

/* Modal Content */
.modal-content {
  background: linear-gradient(135deg, #3498db, #2ecc71);
  padding: 25px;
  border-radius: 12px;
  width: 450px;
  color: #fff;
  box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.3);
  animation: slideIn 0.4s ease-in-out;
}

.modal-content h2 {
  margin-bottom: 20px;
  text-align: center;
  font-size: 24px;
  color: #000000;
}

/* Close Button */
.close-modal {
  background: #e74c3c;
  color: #000000;
  border: none;
  font-size: 18px;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
  float: right;
  transition: background 0.3s;
}

.close-modal:hover {
  background: #c0392b;
}

/* Input Fields */
.modal-content label {
  display: block;
  margin-top: 15px;
  font-size: 14px;
  color: #000000;
}

.modal-content input,
.modal-content select {
  width: 100%;
  padding: 10px;
  margin-top: 5px;
  border-radius: 5px;
  border: none;
  outline: none;
  font-size: 14px;
  background-color: #ecf0f1;
  color: #34495e;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}

.modal-content input:focus,
.modal-content select:focus {
  transform: scale(1.02);
  box-shadow: 0px 0px 5px rgba(52, 152, 219, 0.8);
}

/* Buttons */
.modal-buttons {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
}

.modal-buttons button {
  padding: 12px 20px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.3s, background 0.3s;
}

.modal-buttons button[type="submit"] {
  background: #2ecc71;
  color: #fff;
}

.modal-buttons button[type="submit"]:hover {
  background: #27ae60;
  transform: scale(1.05);
}

.modal-buttons button[type="button"] {
  background: #e74c3c;
  color: #fff;
}

.modal-buttons button[type="button"]:hover {
  background: #c0392b;
  transform: scale(1.05);
}

/* Error Message */
.error-message {
  color: #e74c3c;
  font-size: 14px;
  margin-top: 10px;
  text-align: center;
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideIn {
  from {
    transform: translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}


.profile-modal {
  text-align: center;
}

.profile-icon-large {
  font-size: 60px;
  color: #3498db;
  margin-bottom: 20px;
}

.profile-info {
  list-style: none;
  padding: 0;
  margin: 0;
  text-align: left;
}

.profile-info li {
  margin: 10px 0;
  font-size: 16px;
}

.close-modal {
  background: transparent;
  border: none;
  font-size: 20px;
  cursor: pointer;
  float: right;
}

.profile-info strong {
  color: #34495e;
}

.error-message {
  color: red;
  font-size: 14px;
}

.add-absen-button {
  background: #3498db;
  color: #fff;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
  width: 100%;
  text-align: center;
}

.add-absen-button:hover {
  background: #2980b9;
}

/* Container for the Dashboard */
.dashboard-container {
  display: flex;
  font-family: 'Roboto', sans-serif;
  color: #34495e;
  height: 100vh;
  background-color: #f4f6f8;
}

/* Sidebar */
.sidebar {
  width: 250px;
  background: linear-gradient(180deg, #2c3e50, #34495e);
  color: #ecf0f1;
  padding: 20px;
  box-shadow: 2px 0 20px rgba(0, 0, 0, 0.3);
}

.sidebar h2 {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 30px;
  text-align: center;
}

.sidebar ul {
  list-style-type: none;
  padding: 0;
}

.sidebar li {
  padding: 15px;
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 18px;
  transition: background-color 0.3s, transform 0.2s;
  border-radius: 5px;
}

.sidebar li i {
  margin-right: 15px;
  color: #1abc9c;
}

.sidebar li:hover {
  background-color: rgba(26, 188, 156, 0.2);
  transform: scale(1.02);
}

/* Main Content */
.main-content {
  flex: 1;
  padding: 20px;
  background-color: #ffffff;
  overflow-y: auto;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  margin-left: -20px;
  margin-top: -20px;
  background: linear-gradient(180deg, #2c3e50, #34495e);
  border-bottom: 1px solid #ddd;
}

.last-login {
  font-size: 14px;
  color: #7f8c8d;
}

.profile {
  display: flex;
  align-items: center;
}

.profile-img {
  border-radius: 50%;
  width: 40px;
  height: 40px;
}

.profile-name {
  font-weight: bold;
  margin-left: 10px;
}

.username-display {
  margin-left: 5px;
  color: #7f8c8d;
}

/* Stats Cards */
.stats-cards {
  display: flex;
  gap: 20px;
  margin: 20px 0;
}

.card {
  flex: 1;
  background-color: #ecf0f1;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.card-icon {
  font-size: 30px;
}

/* Button Styling */
.add-absen-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  border: none;
  border-radius: 50%;
  background-color: #3498db;
  color: white;
  font-size: 24px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
  margin: 20px auto;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  z-index: 1000;
}

.add-absen-button:hover {
  background-color: #2980b9;
  transform: scale(1.1);
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.close-modal {
  background: transparent;
  border: none;
  font-size: 20px;
  cursor: pointer;
}

.modal-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.error-message {
  color: red;
  font-size: 14px;
}

/* Responsiveness */
@media (max-width: 1024px) {
  .sidebar {
    width: 200px;
  }

  .stats-cards {
    grid-template-columns: repeat(2, 1fr);
  }

  .modal-content {
    width: 90%;
  }
}

@media (max-width: 600px) {
  .sidebar {
    width: 100%;
    position: fixed;
    bottom: 0;
    flex-direction: row;
    justify-content: space-around;
    box-shadow: 0px -2px 10px rgba(0, 0, 0, 0.3);
  }

  .stats-cards {
    grid-template-columns: 1fr;
  }

  .add-absen-button {
    width: 50px;
    height: 50px;
    font-size: 18px;
  }

  .header {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
