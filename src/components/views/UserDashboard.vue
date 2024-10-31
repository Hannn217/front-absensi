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
      </ul>
    </div>

    <div class="main-content">
      <div class="header">
        <div class="last-login">Terakhir Login: {{ currentTime }}</div>
        <div class="profile">
          <img src="https://via.placeholder.com/50" alt="Profile Picture" class="profile-img" />
          <span class="profile-name">{{ userName }}</span>
          <span class="username-display">({{ username }})</span>
        </div>
      </div>

      <h1 class="dashboard-title">Dashboard</h1>

      <div class="stats-cards">
        <div
          class="card"
          v-for="(item, index) in dashboardItems"
          :key="index"
          :style="{ borderLeft: item.color }"
        >
          <div class="card-icon" :style="{ color: item.color.split(' ')[2] }">
            <i class="fas" :class="index === 0 ? 'fa-calendar-check' : (index === 1 ? 'fa-chalkboard-teacher' : (index === 2 ? 'fa-book' : 'fa-users'))"></i>
            <span v-if="index === 0 && absenceNotification" class="notif">{{ absenceNotification }}</span>
          </div>
          <h3>{{ item.title }}</h3>
          <p>{{ item.subtitle }}</p>
        </div>
      </div>

      <button @click="showAbsenModal" class="add-absen-button full-width">Tambah Absen</button>

      <!-- Attendance Modal -->
      <div v-if="showModal" class="modal-overlay">
        <div class="modal-content">
          <h2>Absen Pegawai</h2>
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
      loading: false,
      attendanceData: {
        nama: '',
        username: '',
        keterangan: '',
        alasan: '',
        nama_kelas: '',
        date: new Date().toISOString().slice(0, 10),
      },
      dashboardItems: [
        { title: 'JUMLAH ABSEN HARI INI', subtitle: 'Belum Absen', color: '5px solid #e74c3c' },
        { title: 'KELAS YANG DIAJARKAN', subtitle: '2 (Kelas)', color: '5px solid #f39c12' },
        { title: 'MATA KULIAH YANG DIAJARKAN', subtitle: '1 (Mata Kuliah)', color: '5px solid #3498db' },
        { title: 'TOTAL ABSENSI', subtitle: '0', color: '5px solid #2ecc71' },
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

    // Update current time every second
    this.timeInterval = setInterval(() => {
      this.currentTime = new Date().toLocaleString();
    }, 1000);

    // Polling for attendance updates every 5 seconds
    this.pollAttendanceUpdates();
  },
  beforeDestroy() {
    // Clear the time interval when component is destroyed
    clearInterval(this.timeInterval);
  },
  methods: {
    navigateTo(page) {
      this.$router.push(`/${page}`);
    },
    showAbsenModal() {
      this.showModal = true;
      this.attendanceData.username = this.username; // Set username for attendance
      this.attendanceData.nama = this.userName; // Set name for attendance
    },
    closeModal() {
      this.showModal = false;
      this.attendanceData = { nama: '', username: '', keterangan: '', alasan: '', nama_kelas: '', date: new Date().toISOString().slice(0, 10) };
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
        alert('Terjadi kesalahan saat mengirim absensi. Silakan coba lagi.');
      } finally {
        this.loading = false;
      }
    },
    async checkAttendance() {
      // Logic to check attendance status
      this.absenceNotification = '1'; // Ubah sesuai logika
    },
    pollAttendanceUpdates() {
      setInterval(() => {
        this.checkAttendance();
      }, 5000); // Update every 5 seconds
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
  border-bottom: 1px solid #e0e4e7;
}

/* Styles for Last Login and Current Time */
.last-login {
  color: #3498db; /* Change color for Last Login */
  font-weight: 500;
}

.current-time {
  color: #e74c3c; /* Change color for Current Time */
  font-weight: 500;
}

.profile {
  display: flex;
  align-items: center;
}

.profile-img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 10px;
}

.profile-name {
  font-weight: 700;
}

.username-display {
  font-weight: 400;
  color: #7f8c8d;
}

/* Stats Cards */
.stats-cards {
  display: flex; /* Change to flex for horizontal layout */
  justify-content: space-between; /* Space between cards */
  margin: 20px 0;
  flex-wrap: wrap; /* Allow wrapping if screen is small */
}

.card {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
  width: calc(25% - 15px); /* Each card takes 25% of the width minus some margin */
  margin-bottom: 20px; /* Space between rows */
}

/* Button Styles */
.add-absen-button {
  background-color: #2ecc71;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
}

.add-absen-button:hover {
  background-color: #27ae60;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 30px;
  border-radius: 8px;
  width: 400px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.modal-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.modal-buttons button {
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.modal-buttons button:hover {
  background-color: #2ecc71;
  color: white;
}
</style>
