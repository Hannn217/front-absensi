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
            <span v-if="index === 0 && absenceNotification" class="notif">{{ absenceNotification }}</span>
          </div>
          <h3>{{ item.title }}</h3>
          <p>{{ item.subtitle }}</p>
        </div>
      </div>

      <button @click="showAbsenModal" class="add-absen-button full-width">
        <i class="fas fa-plus-circle"></i>
      </button>

      <!-- Attendance Modal -->
      <div v-if="showModal" class="modal-overlay">
        <div class="modal-content">
          <h2>Absen <button class="close-modal" @click="closeModal">&times;</button></h2>
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

      <!-- Leave Modal -->
      <div v-if="showLeaveModal" class="modal-overlay">
  <div class="modal-content">
    <h2>Pengajuan Cuti <button class="close-modal" @click="closeLeaveModal">&times;</button></h2>
    <form @submit.prevent="submitLeave">
      <label for="leaveReason">Nama :</label>
      <input v-model="leaveData.nama" type="text" required />

      <label for="username">Username:</label>
      <input v-model="leaveData.username" type="text" required />

      <label for="nama_kelas">Nama Kelas:</label>
      <input v-model="leaveData.nama_kelas" type="text" required />

      <label for="tanggal_mulai">Tanggal Mulai:</label>
      <input v-model="leaveData.tanggal_mulai" type="date" required />

      <label for="tanggal_selesai">Tanggal Selesai:</label>
      <input v-model="leaveData.tanggal_selesai" type="date" required />

      <label for="keterangan">Alasan:</label>
      <input v-model="leaveData.keterangan" type="text" required />

      <div class="modal-buttons">
        <button type="submit" :disabled="loadingLeave">{{ loadingLeave ? 'Mengirim...' : 'Ajukan Cuti' }}</button>
        <button type="button" @click="closeLeaveModal">Batal</button>
      </div>
    </form>
    <p v-if="leaveErrorMessage" class="error-message">{{ leaveErrorMessage }}</p>
  </div>
</div>


      <!-- Profile Modal -->
      <div v-if="showProfileModal" class="modal-overlay">
        <div class="modal-content profile-modal">
          <h2>Profil Pengguna<button class="close-modal" @click="closeProfileModal">&times;</button></h2>
          <div class="profile-header">
            <i class="fas fa-user-circle profile-icon-large"></i>
            <div class="profile-details">
              <h3>{{ userData.nama }}</h3>
              <p>{{ userData.jabatan }}</p>
            </div>
          </div>
          <ul class="profile-info">
            <li><strong>Nama:</strong> {{ userData.nama }}</li>
            <li><strong>Username:</strong> {{ userData.username }}</li>
            <li><strong>Email:</strong> {{ userData.email }}</li>
            <li><strong>Nomor HP:</strong> {{ userData.nomor_hp }}</li>
            <li><strong>Jabatan:</strong> {{ userData.jabatan }}</li>
          </ul>
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
      showProfileModal: false,
      loading: false,
      loadingLeave: false,
      errorMessage: '',
      leaveErrorMessage: '',
      attendanceData: this.initializeAttendanceData(),
      leaveData: this.initializeLeaveData(),
      dashboardItems: [
        { title: 'JUMLAH ABSEN HARI INI', subtitle: 'Belum Absen, Silahkan Absen Untuk Hari Ini!', color: '5px solid #e74c3c' },
        { title: 'MAPS BMP', subtitle: 'CLICK DISINI', color: '5px solid #f39c12' },
        { title: 'PROFILE ANDA', subtitle: 'CLICK UNTUK MELIHAT PROFILE ANDA', color: '5px solid #3498db' },
        { title: 'HISTORY ABSENSI', subtitle: 'DEFAULT', color: '5px solid #2ecc71' },
      ],
      userData: {
        nama: '',
        username: '',
        email: '',
        nomor_hp: '',
        jabatan: '',
      },
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
      this.userData = {
        nama: user.nama,
        username: user.username,
        email: user.email,
        nomor_hp: user.nomor_hp,
        jabatan: user.jabatan,
      };
    }
    this.timeInterval = setInterval(() => {
      this.currentTime = new Date().toLocaleString();
    }, 1000);
    this.checkAttendance();
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
    openLeaveModal() {
      this.showLeaveModal = true;
      this.leaveData = this.initializeLeaveData();
    },
    closeLeaveModal() {
      this.showLeaveModal = false;
      this.leaveErrorMessage = '';
      this.resetLeaveData();
    },
    openProfileModal() {
      this.showProfileModal = true;
    },
    closeProfileModal() {
      this.showProfileModal = false;
    },
    async submitAttendance() {
      this.loading = true;
      try {
        const response = await axios.post(`http://localhost:8000/api/pegawai/absen/${this.username}`, this.attendanceData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        
        localStorage.setItem(`attendanceStatus_${this.username}`, 'present');
        this.absenceNotification = '0';
        this.dashboardItems[0].subtitle = 'Berhasil Absen';
        this.closeModal();

        setTimeout(() => {
          this.dashboardItems[0].subtitle = 'Belum Absen, Silahkan Absen Untuk Hari Ini!';
        }, 60000);  // Reset message after 1 minute
      } catch (error) {
        this.errorMessage = 'Gagal Absen! Pastikan Anda mengisi data dengan benar.';
      } finally {
        this.loading = false;
      }
    },
    async submitLeave() {
      this.loadingLeave = true;
      try {
        const response = await axios.post(`http://localhost:8000/api/pengajuan`, this.leaveData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        this.closeLeaveModal();
        alert('Cuti berhasil diajukan');
      } catch (error) {
        this.leaveErrorMessage = 'Gagal mengajukan cuti, coba lagi nanti.';
      } finally {
        this.loadingLeave = false;
      }
    },
    initializeAttendanceData() {
      return {
        leaveData: {
      nama: '',
      username: '',
      nama_kelas: '',
      tanggal_mulai: '',
      tanggal_selesai: '',
      keterangan: ''
    },
    showLeaveModal: false,
    leaveErrorMessage: '',
    loadingLeave: false
  };
    },
    initializeLeaveData() {
      return {
        reason: '',
        date: new Date().toISOString().split('T')[0],
      };
    },
    resetAttendanceData() {
      this.attendanceData = this.initializeAttendanceData();
    },
    resetLeaveData() {
      this.leaveData = this.initializeLeaveData();
    },
    async checkAttendance() {
      // Simulating a call to check attendance status from an API
      const status = localStorage.getItem(`attendanceStatus_${this.username}`);
      if (status === 'present') {
        this.absenceNotification = '0';
        this.dashboardItems[0].subtitle = 'Sudah Absen Hari Ini';
      } else {
        this.absenceNotification = '1';
        this.dashboardItems[0].subtitle = 'Belum Absen, Silahkan Absen Untuk Hari Ini!';
      }
    },
    pollAttendanceUpdates() {
      setInterval(() => {
        this.checkAttendance();
      }, 30000);  // Poll every 30 seconds
    },
    getCardIcon(index) {
      const icons = ['fa-check-circle', 'fa-map-marker-alt', 'fa-user-circle', 'fa-history'];
      return icons[index] || '';
    }
  },
};
</script>

<style scoped>
/* Add your styles here */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
}

.close-modal {
  background: transparent;
  border: none;
  font-size: 20px;
  color: red;
  cursor: pointer;
}

.modal-buttons button {
  margin-top: 10px;
  padding: 10px 20px;
  font-size: 16px;
  border: none;
  background-color: #3498db;
  color: white;
  cursor: pointer;
}

.modal-buttons button[type="button"] {
  background-color: #e74c3c;
}

.error-message {
  color: red;
  font-size: 14px;
  margin-top: 10px;
}

.add-absen-button {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: #2ecc71;
  color: white;
  font-size: 24px;
  padding: 15px 30px;
  border-radius: 50%;
  cursor: pointer;
}

.add-absen-button:hover {
  background-color: #27ae60;
}

/* Sidebar styles */

.profile {
  display: flex;
  align-items: center;
  gap: 10px;
}

.profile-icon {
  font-size: 30px;
  color: #3498db;
}

/* Card styles */
.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.card {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
}

.card-icon {
  font-size: 30px;
  margin-bottom: 10px;
}

/* Modal styles */
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
  width: 60px; /* Lebar tombol */
  height: 60px; /* Tinggi tombol */
  border: none;
  border-radius: 50%; /* Membuat tombol berbentuk lingkaran */
  background-color: #3498db; /* Warna latar belakang */
  color: white;
  font-size: 24px; /* Ukuran ikon */
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
  margin: 20px auto; /* Mengatur margin atas dan bawah */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  z-index: 1000; /* Menjaga tombol tetap di atas konten lainnya */
}

.add-absen-button:hover {
  background-color: #2980b9; /* Ganti warna saat hover */
  transform: scale(1.1); /* Efek sedikit membesar saat hover */
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
