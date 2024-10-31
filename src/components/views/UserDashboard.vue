<template>
  <div class="dashboard-container">
    <div class="sidebar">
      <h2>ABSENSI</h2>
      <ul>
        <li @click="navigateTo('Dashboard')">
          <i class="fas fa-tachometer-alt"></i> Dashboard
        </li>
        <li @click="showAbsenModal">
          <i class="fas fa-calendar-check"></i> Absen
        </li>
        <li @click="showLeaveModal">
          <i class="fas fa-plane"></i> Pengajuan Cuti
        </li>
      </ul>
    </div>

    <div class="main-content">
      <div class="header">
        <div class="last-login">Terakhir Login: {{ currentTime }}</div>
        <div class="profile">
          <img src="https://via.placeholder.com/50" alt="Profile Picture" class="profile-img" />
          <span class="profile-name">{{ userName }}</span>
          <span class="username-display">{{ username }}</span>
        </div>
      </div>

      <h1 class="dashboard-title">Dashboard</h1>

      <div class="stats-cards">
        <div
          class="card"
          v-for="(item, index) in dashboardItems"
          :key="index"
          :style="{ borderLeft: item.color }"
          @click="index === 1 ? openGoogleMaps() : null"
        >
          <div class="card-icon" :style="{ color: item.color.split(' ')[2] }">
            <i class="fas" :class="getCardIcon(index)"></i>
            <span v-if="index === 0 && absenceNotification" class="notif">{{ absenceNotification }}</span>
          </div>
          <h3>{{ item.title }}</h3>
          <p>{{ item.subtitle }}</p>
        </div>
      </div>

      <button @click="showAbsenModal" class="add-absen-button full-width">
        <i class="fas fa-plus-circle"></i> Tambah Absen
      </button>

      <button @click="showLeaveModal" class="add-absen-button full-width">
        <i class="fas fa-plane"></i> Pengajuan Cuti
      </button>

      <div v-if="showModal" class="modal-overlay">
        <div class="modal-content">
          <h2>Absen Pegawai <button class="close-modal" @click="closeModal">&times;</button></h2>
          <form @submit.prevent="submitAttendance">
            <label for="nama">Nama:</label>
            <input v-model="attendanceData.nama" type="text" required />

            <label for="username">Username:</label>
            <input v-model="attendanceData.username" type="text" required />

            <label for="nama_kelas">Kelas:</label>
            <input v-model="attendanceData.nama_kelas" type="text" required />

            <label for="keterangan">Keterangan:</label>
            <select v-model="attendanceData.keterangan" required>
              <option value="hadir">Hadir</option>
              <option value="izin">Izin</option>
              <option value="sakit">Sakit</option>
            </select>

            <label for="alasan">Alasan:</label>
            <input v-model="attendanceData.alasan" type="text" required />

            <label for="date">Tanggal:</label>
            <input v-model="attendanceData.date" type="date" required />

            <div class="modal-buttons">
              <button type="submit" :disabled="loading">{{ loading ? 'Mengirim...' : 'Absen' }}</button>
              <button type="button" @click="closeModal">Batal</button>
            </div>
          </form>
          <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
        </div>
      </div>

      <div v-if="showLeaveModal" class="modal-overlay">
        <div class="modal-content">
          <h2>Pengajuan Cuti <button class="close-modal" @click="closeLeaveModal">&times;</button></h2>
          <form @submit.prevent="submitLeave">
            <label for="leaveReason">Alasan Cuti:</label>
            <input v-model="leaveData.reason" type="text" required />

            <label for="leaveDate">Tanggal Cuti:</label>
            <input v-model="leaveData.date" type="date" required />

            <div class="modal-buttons">
              <button type="submit" :disabled="loadingLeave">{{ loadingLeave ? 'Mengirim...' : 'Ajukan Cuti' }}</button>
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
import axios from 'axios';

export default {
  data() {
    return {
      showModal: false,
      showLeaveModal: false,
      loading: false,
      loadingLeave: false,
      errorMessage: '',
      leaveErrorMessage: '',
      attendanceData: this.initializeAttendanceData(),
      leaveData: this.initializeLeaveData(),
      dashboardItems: [
        { title: 'JUMLAH ABSEN HARI INI', subtitle: 'Belum Absen', color: '5px solid #e74c3c' },
        { title: 'MAPS BMP', subtitle: 'CLICK DISINI', color: '5px solid #f39c12' },
        { title: 'PROFILE ANDA', subtitle: 'CLICK UNTUK MELIHAT PROFILE ANDA', color: '5px solid #3498db' },
        { title: 'HISTORY ABSENSI', subtitle: 'DEFAULT', color: '5px solid #2ecc71' },
      ],
      userName: '',
      username: '',
      currentTime: new Date().toLocaleString(),
      absenceNotification: '',
      timeInterval: null,
    };
  },
  mounted() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      this.userName = user.name;
      this.username = user.username;
      this.checkAttendance();
    }
    this.timeInterval = setInterval(() => {
      this.currentTime = new Date().toLocaleString();
    }, 1000);
    this.pollAttendanceUpdates();
  },
  beforeDestroy() {
    clearInterval(this.timeInterval);
  },
  methods: {
    navigateTo(page) {
      this.$router.push(`/${page}`);
    },
    showAbsenModal() {
      this.showModal = true;
      this.attendanceData.username = this.username;
      this.attendanceData.nama = this.userName;
    },
    closeModal() {
      this.showModal = false;
      this.errorMessage = '';
      this.resetAttendanceData();
    },
    showLeaveModal() {
      this.showLeaveModal = true;
      this.leaveData = this.initializeLeaveData();
    },
    closeLeaveModal() {
      this.showLeaveModal = false;
      this.leaveErrorMessage = '';
      this.resetLeaveData();
    },
    async submitAttendance() {
      this.loading = true;
      try {
        const response = await axios.post('http://localhost:8000/api/pegawai/absen', this.attendanceData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        this.absenceNotification = 'Absen berhasil!';
        this.closeModal();
        this.checkAttendance();
      } catch (error) {
        console.error('Error submitting attendance:', error);
        this.errorMessage = 'Terjadi kesalahan saat mengirim absensi. Silakan coba lagi.';
      } finally {
        this.loading = false;
      }
    },
    async submitLeave() {
      this.loadingLeave = true;
      try {
        const response = await axios.post('http://localhost:8000/api/pegawai/cuti', this.leaveData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        this.leaveErrorMessage = 'Pengajuan cuti berhasil!';
        this.closeLeaveModal();
      } catch (error) {
        console.error('Error submitting leave request:', error);
        this.leaveErrorMessage = 'Terjadi kesalahan saat mengajukan cuti. Silakan coba lagi.';
      } finally {
        this.loadingLeave = false;
      }
    },
    async checkAttendance() {
      this.absenceNotification = '1';
    },
    pollAttendanceUpdates() {
      setInterval(() => {
        this.checkAttendance();
      }, 5000);
    },
    getCardIcon(index) {
      const icons = [
        'fa-calendar-check',
        'fa-map',
        'fa-book',
        'fa-users'
      ];
      return icons[index] || '';
    },
    resetAttendanceData() {
      this.attendanceData = this.initializeAttendanceData();
    },
    resetLeaveData() {
      this.leaveData = this.initializeLeaveData();
    },
    initializeAttendanceData() {
      return {
        nama: '',
        username: '',
        keterangan: '',
        alasan: '',
        nama_kelas: '',
        date: new Date().toISOString().slice(0, 10),
      };
    },
    initializeLeaveData() {
      return {
        reason: '',
        date: new Date().toISOString().slice(0, 10),
      };
    },
    openGoogleMaps() {
      const mapsUrl = 'https://www.google.com/maps/search/?api=1&query=Jl.+Pulau+Bangka,+Kec.+Bukitintan,+Kota+Pangkalpinang,+Provinsi+Kepulauan+Bangka+Belitung+33149';
      window.open(mapsUrl, '_blank', 'width=600,height=400');
    },
  },
};
</script>

<style scoped>
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
  border-radius: 8px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background-color: #ffffff;
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
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  background-color: #3498db; /* Primary color */
  color: white;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
  margin: 20px 0; /* Margin for spacing */
}

.add-absen-button:hover {
  background-color: #2980b9; /* Darker shade on hover */
  transform: scale(1.05);
}

.add-absen-button i {
  margin-right: 5px; /* Space between icon and text */
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
  float: right;
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
</style>
