<template>
  <div class="dashboard-container">
    <div class="sidebar">
      <h2>Menu</h2>
      <ul>
        <li @click="navigateTo('Home')">
          <i class="fas fa-home"></i> Home
        </li>
        <li @click="showModal">
          <i class="fas fa-calendar-check"></i> Absen
        </li>
        <li @click="navigateTo('Profile')">
          <i class="fas fa-user"></i> Profile
        </li>
        <li @click="logout">
          <i class="fas fa-sign-out-alt"></i> Logout
        </li>
      </ul>
    </div>
    <div class="content-area">
      <header class="navbar">
        <input type="text" placeholder="Search..." v-model="searchQuery" class="search-input" />
        <div class="user-dropdown">
          <button @click.stop="toggleDropdown" class="user-button">
            <i class="fas fa-user-circle"></i> {{ username }}
          </button>
          <div v-if="dropdownVisible" class="dropdown-menu" @click.stop>
            <ul>
              <li @click="navigateTo('Profile')">Profile</li>
              <li @click="logout">Logout</li>
            </ul>
          </div>
        </div>
      </header>

      <main class="main-content">
        <div v-if="currentView === 'history'">
          <h2>History Absen</h2>
          <table class="absen-table">
            <thead>
              <tr>
                <th>Nama</th>
                <th>Nama Kelas</th>
                <th>Keterangan</th>
                <th>Alasan</th>
                <th>Tanggal</th>
                <th>Timestamp</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="record in filteredAbsenHistory" :key="record.id">
                <td>{{ record.nama }}</td>
                <td>{{ record.nama_kelas }}</td>
                <td>{{ record.keterangan }}</td>
                <td>{{ record.alasan }}</td>
                <td>{{ record.date }}</td>
                <td>{{ record.timestamp }}</td>
                <td>
                  <button class="delete-button" @click="deleteAbsen(record.id)">
                    <i class="fas fa-trash-alt"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-else>
          <h2>Tambahkan Absen</h2>
        </div>
        <button @click="showModal" class="add-absen-button">Tambah Absen</button>
      </main>
    </div>

    <transition name="fade">
      <div v-if="showSuccessNotification || showErrorNotification">
        <div v-if="showSuccessNotification" class="success-notification">
          Absen berhasil!
        </div>
        <div v-if="showErrorNotification" class="error-notification">
          {{ errorMessage }}
        </div>
      </div>
    </transition>

    <div v-if="modalVisible" class="modal" @click.self="closeModal">
      <div class="modal-content">
        <span class="close" @click="closeModal">&times;</span>
        <h2>Absen Pegawai</h2>
        <form @submit.prevent="submitAbsen">
          <div class="form-group">
            <label>Nama:</label>
            <input v-model="form.nama" type="text" required />
          </div>
          <div class="form-group">
            <label>Username:</label>
            <input v-model="form.username" type="text" />
          </div>
          <div class="form-group">
            <label>Keterangan:</label>
            <select v-model="form.keterangan" required>
              <option value="hadir">Hadir</option>
              <option value="izin">Izin</option>
              <option value="sakit">Sakit</option>
            </select>
          </div>
          <div class="form-group">
            <label>Alasan:</label>
            <input v-model="form.alasan" type="text" required />
          </div>
          <div class="form-group">
            <label>Nama Kelas:</label>
            <input v-model="form.nama_kelas" type="text" required />
          </div>
          <div class="form-group">
            <label>Tanggal:</label>
            <input v-model="form.date" type="date" required />
          </div>
          <button type="submit" class="submit-button">{{ isEditing ? 'Update' : 'Submit' }} Absen</button>
          <p v-if="message" class="message">{{ message }}</p>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      absenHistory: [],
      searchQuery: '',
      username: '',
      dropdownVisible: false,
      currentView: 'history',
      modalVisible: false,
      showSuccessNotification: false,
      showErrorNotification: false,
      errorMessage: '',
      isEditing: false,
      message: '',
      form: {
        nama: '',
        username: '',
        keterangan: '',
        alasan: '',
        nama_kelas: '',
        date: ''
      }
    };
  },
  computed: {
    filteredAbsenHistory() {
      return this.absenHistory.filter(record => {
        return record.nama.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
               record.nama_kelas.toLowerCase().includes(this.searchQuery.toLowerCase());
      });
    }
  },
  methods: {
    async fetchAbsenHistory() {
      try {
        const token = localStorage.getItem('authToken');
        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };
        const response = await axios.get('http://localhost:8000/api/pegawai/absen/history', config);
        this.absenHistory = response.data;
      } catch (error) {
        console.error('Error fetching absence history:', error);
      }
    },
    toggleDropdown() {
      this.dropdownVisible = !this.dropdownVisible;
    },
    navigateTo(view) {
      this.currentView = view;
    },
    logout() {
      localStorage.removeItem('authToken');
      this.isLoggedIn = false;
    },
    showModal() {
      this.modalVisible = true;
    },
    closeModal() {
      this.modalVisible = false;
      this.isEditing = false;
      this.form = { nama: '', username: '', keterangan: '', alasan: '', nama_kelas: '', date: '' };
    },
    async submitAbsen() {
      try {
        const token = localStorage.getItem('authToken');
        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };
        
        if (this.isEditing) {
          // Update existing record
          await axios.put(`api/pegawai/absen`, this.form, config);
        } else {
          // Create new record
          await axios.post('/pegawai/absen', this.form, config);
        }

        this.showSuccessNotification = true;
        this.fetchAbsenHistory();
        this.closeModal();
      } catch (error) {
        this.showErrorNotification = true;
        this.errorMessage = 'Failed to submit absence';
      }
    },
    async deleteAbsen(id) {
      try {
        const token = localStorage.getItem('authToken');
        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };
        await axios.delete(`http://localhost:8000/api/pegawai/absen/${id}`, config);
        this.fetchAbsenHistory();
      } catch (error) {
        console.error('Error deleting absence:', error);
      }
    }
  },
  created() {
    const token = localStorage.getItem('authToken');
    if (token) {
      this.isLoggedIn = true;
      this.fetchAbsenHistory();
    }
  }
};
</script>

<style scoped>
.dashboard-container {
  display: flex;
  height: 100vh;
  font-family: 'Arial', sans-serif;
}

.sidebar {
  width: 250px;
  background-color: #2c3e50;
  color: #ecf0f1;
  padding: 20px;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.3);
  transition: width 0.3s;
}

.sidebar h2 {
  font-size: 24px;
  margin-bottom: 20px;
}

.sidebar ul {
  list-style-type: none;
  padding: 0;
}

.sidebar li {
  padding: 15px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
}

.sidebar li:hover {
  background-color: #34495e;
  transform: scale(1.05);
}

.content-area {
  flex: 1;
  padding: 20px;
  background-color: #ecf0f1;
  position: relative;
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.search-input {
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #bdc3c7;
  width: 200px;
}

.user-dropdown {
  position: relative;
}

.user-button {
  background: none;
  border: none;
  color: #2c3e50;
  cursor: pointer;
  font-size: 18px;
}

.dropdown-menu {
  position: absolute;
  right: 0;
  background-color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  overflow: hidden;
  z-index: 1000;
}

.dropdown-menu ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.dropdown-menu li {
  padding: 10px 15px;
  cursor: pointer;
}

.dropdown-menu li:hover {
  background-color: #f2f2f2;
}

.main-content {
  background-color: #ffffff;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.absen-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.absen-table th,
.absen-table td {
  padding: 10px;
  border: 1px solid #bdc3c7;
  text-align: left;
}

.add-absen-button {
  padding: 10px 15px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 20px;
}

.add-absen-button:hover {
  background-color: #2980b9;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  width: 400px;
}

.close {
  cursor: pointer;
  float: right;
  font-size: 20px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 8px;
  border: 1px solid #bdc3c7;
  border-radius: 5px;
}

.submit-button {
  padding: 10px 15px;
  background-color: #2ecc71;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.submit-button:hover {
  background-color: #27ae60;
}

.message {
  margin-top: 10px;
  color: #e74c3c;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0;
}

.success-notification {
  background-color: #2ecc71;
  color: white;
  padding: 10px;
  margin: 10px;
  border-radius: 5px;
}

.error-notification {
  background-color: #e74c3c;
  color: white;
  padding: 10px;
  margin: 10px;
  border-radius: 5px;
}
</style>
