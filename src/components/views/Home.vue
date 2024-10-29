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
              <li @click="navigateToProfile">Profile</li>
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
                <td>
                  <button class="delete-button" @click="deleteAbsen(record.id)">
                    <i class="fas fa-trash-alt"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          <button @click="showModal" class="add-absen-button">Add Absen</button>
        </div>
        <div v-else>
          <h2>Welcome to the Dashboard</h2>
          <button @click="showModal" class="add-absen-button">Add Absen</button>
        </div>
      </main>
    </div>

    <!-- Notifikasi Sukses dan Error -->
    <transition name="fade">
      <div>
        <div v-if="showSuccessNotification" class="success-notification">
          Absen berhasil!
        </div>
        <div v-if="showErrorNotification" class="error-notification">
          {{ errorMessage }}
        </div>
      </div>
    </transition>

    <!-- Modal for Absen Form -->
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
      username: localStorage.getItem('username') || '',
      searchQuery: '',
      dropdownVisible: false,
      currentView: 'history', // Default tampilan history absen
      modalVisible: false,
      message: '',
      absenHistory: [], // Data histori absen dari database
      showSuccessNotification: false, // Variabel untuk notifikasi sukses
      showErrorNotification: false, // Variabel untuk notifikasi error
      errorMessage: '',
      form: {
        id: null,
        nama: '',
        username: this.username, // Ambil dari localStorage
        keterangan: 'hadir',
        alasan: '',
        nama_kelas: '',
        date: ''
      },
      isEditing: false,
    };
  },
  computed: {
    filteredAbsenHistory() {
      return this.absenHistory.filter(record => 
        record.nama.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        record.nama_kelas.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
  },
  methods: {
    navigateTo(routeName) {
      if (routeName === 'Home') {
        this.currentView = 'history'; // Tampilkan History Absen saat klik Home
      } else {
        this.currentView = 'profile'; // Tampilkan Profile jika Profile dipilih
      }
    },
    showModal() {
      this.modalVisible = true;
      this.resetForm();
    },
    closeModal() {
      this.modalVisible = false;
      this.resetForm();
    },
    logout() {
      localStorage.removeItem('username');
      localStorage.removeItem('absenHistory'); // Hapus histori absen dari localStorage
      this.currentView = 'login';
    },
    toggleDropdown() {
      this.dropdownVisible = !this.dropdownVisible;
    },
    handleOutsideClick(event) {
      if (!this.$el.contains(event.target)) {
        this.closeDropdown();
      }
    },
    async submitAbsen() {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }

        if (this.isEditing) {
          const response = await axios.put(`/pegawai/absen/${this.form.id}`, this.form);
          this.message = response.data.message;

          const index = this.absenHistory.findIndex(record => record.id === this.form.id);
          this.$set(this.absenHistory, index, this.form);
        } else {
          const response = await axios.post('/pegawai/absen', this.form);
          this.message = response.data.message;

          this.absenHistory.push({ ...this.form, id: response.data.id }); // Gunakan ID dari respons API
          this.showSuccessNotification = true; // Tampilkan notifikasi
          setTimeout(() => {
            this.showSuccessNotification = false; // Sembunyikan setelah 3 detik
          }, 3000);
        }
        this.closeModal();
        localStorage.setItem('absenHistory', JSON.stringify(this.absenHistory));

      } catch (error) {
        if (error.response) {
          if (error.response.data.errors) {
            this.message = Object.values(error.response.data.errors).flat().join(', ');
          } else {
            this.message = error.response.data.message || 'Terjadi kesalahan';
          }
        } else {
          this.message = 'Kesalahan jaringan';
        }
      }
    },
    async deleteAbsen(id) {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
        
        const response = await axios.delete(`/pegawai/absen/delete/${id}`);
        this.absenHistory = this.absenHistory.filter(record => record.id !== id);
        this.showSuccessNotification = true;
        setTimeout(() => {
          this.showSuccessNotification = false;
        }, 3000);
      } catch (error) {
        this.showErrorNotification = true;
        this.errorMessage = error.response?.data.message || 'Gagal menghapus absen';
        setTimeout(() => {
          this.showErrorNotification = false;
        }, 3000);
      }
    },
    resetForm() {
      this.form = {
        id: null,
        nama: '',
        username: this.username, // Ambil dari localStorage
        keterangan: 'hadir',
        alasan: '',
        nama_kelas: '',
        date: ''
      };
      this.isEditing = false;
    },
    async fetchAbsenHistory() {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
        
        const response = await axios.get('/pegawai/absen/history');
        this.absenHistory = response.data;
        localStorage.setItem('absenHistory', JSON.stringify(this.absenHistory));
        
      } catch (error) {
        console.error('Error fetching history:', error);
        this.message = 'Gagal mengambil data histori absen';
      }
    }
  },
  mounted() {
    document.addEventListener('click', this.handleOutsideClick);

    const storedHistory = localStorage.getItem('absenHistory');
    if (storedHistory) {
      this.absenHistory = JSON.parse(storedHistory);
    } else {
      this.fetchAbsenHistory();
    }
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
}

.sidebar {
  width: 250px;
  background-color: #3b3b3b;
  color: white;
  padding: 20px;
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
  transition: background-color 0.3s;
}

.sidebar li:hover {
  background-color: #575757;
}

.content-area {
  flex: 1;
  padding: 20px;
  background-color: #f5f5f5;
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
}

.search-input {
  padding: 8px;
  border-radius: 4px;
  border: none;
}

.user-dropdown {
  position: relative;
}

.user-button {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
}

.dropdown-menu {
  position: absolute;
  right: 0;
  background: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  z-index: 10;
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
  background-color: #f0f0f0;
}

.main-content {
  margin-top: 20px;
}

.absen-table {
  width: 100%;
  border-collapse: collapse;
}

.absen-table th,
.absen-table td {
  border: 1px solid #ddd;
  padding: 8px;
}

.absen-table th {
  background-color: #4CAF50;
  color: white;
}

.add-absen-button {
  padding: 10px 15px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 20px;
}

.add-absen-button:hover {
  background-color: #45a049;
}

.delete-button {
  background: none;
  border: none;
  cursor: pointer;
  color: #f44336; /* Merah */
}

.delete-button:hover {
  color: #d32f2f; /* Merah lebih gelap */
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 5px;
  width: 400px;
  position: relative;
}

.close {
  position: absolute;
  top: 10px;
  right: 15px;
  font-size: 20px;
  cursor: pointer;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
}

.success-notification {
  position: fixed;
  top: 20px;
  right: 20px;
  background-color: #4CAF50;
  color: white;
  padding: 15px;
  border-radius: 5px;
  z-index: 2000;
}

.error-notification {
  position: fixed;
  top: 60px;
  right: 20px;
  background-color: #f44336;
  color: white;
  padding: 15px;
  border-radius: 5px;
  z-index: 2000;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
