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
              </tr>
            </thead>
            <tbody>
              <tr v-for="record in filteredAbsenHistory" :key="record.id">
                <td>{{ record.nama }}</td>
                <td>{{ record.nama_kelas }}</td>
                <td>{{ record.keterangan }}</td>
                <td>{{ record.alasan }}</td>
                <td>{{ record.date }}</td>
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
      currentView: 'history',
      modalVisible: false,
      message: '',
      absenHistory: [], // Data histori absen dari database
      form: {
        id: null,
        nama: '',
        username: localStorage.getItem('username') || '',
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
      this.currentView = routeName === 'Home' ? 'home' : 'profile';
    },
    showModal() {
      this.modalVisible = true;
      this.form.username = this.username;
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
    closeDropdown() {
      this.dropdownVisible = false;
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

          // Update data absen yang telah diedit di absenHistory
          const index = this.absenHistory.findIndex(record => record.id === this.form.id);
          this.$set(this.absenHistory, index, this.form);

        } else {
          const response = await axios.post('/pegawai/absen', this.form);
          this.message = response.data.message;

          // Tambahkan data absen baru ke absenHistory
          this.absenHistory.push({ ...this.form, id: response.data.id }); // Gunakan ID dari respons API
        }
        this.closeModal();

        // Simpan data ke localStorage setelah submit
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
    resetForm() {
      this.form = {
        id: null,
        nama: '',
        username: this.username,
        keterangan: 'hadir',
        alasan: '',
        nama_kelas: '',
        date: ''
      };
      this.isEditing = false;
    },
    // Ambil data absen dari API dan simpan di absenHistory
    async fetchAbsenHistory() {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
        
        // Panggil API untuk mendapatkan histori absen dari database
        const response = await axios.get('/pegawai/absen/history');
        
        // Simpan data absen ke state dan localStorage
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

    // Cek apakah histori absen tersedia di localStorage
    const storedHistory = localStorage.getItem('absenHistory');
    if (storedHistory) {
      // Jika data ada, gunakan data dari localStorage
      this.absenHistory = JSON.parse(storedHistory);
    } else {
      // Jika tidak ada, lakukan fetch dari API
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
  background-color: #f0f2f5;
}

.sidebar {
  width: 220px;
  background-color: #fff;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  padding: 20px;
  position: relative;
}

.sidebar h2 {
  font-size: 1.5em;
  color: #007bff;
}

.sidebar ul {
  list-style: none;
  padding: 0;
}

.sidebar li {
  padding: 15px;
  cursor: pointer;
  transition: background 0.3s;
}

.sidebar li:hover {
  background-color: #007bff;
  color: white;
}

.content-area {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: #007bff;
  color: #fff;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.search-input {
  padding: 8px;
  border: none;
  border-radius: 4px;
}

.main-content {
  flex-grow: 1;
  padding: 20px;
  background-color: #f0f2f5;
}

h2 {
  color: #333;
  margin-bottom: 10px;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: #fff;
  padding: 20px;
  border-radius: 5px;
  width: 400px;
  max-width: 90%;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.close {
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
  font-size: 1.5em;
}

.absen-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.absen-table th,
.absen-table td {
  border: 1px solid #ddd;
  padding: 12px;
  text-align: left;
}

.absen-table th {
  background-color: #007bff;
  color: white;
}

.add-absen-button {
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  border: none;
  cursor: pointer;
  border-radius: 4px;
  transition: background 0.3s;
}

.add-absen-button:hover {
  background-color: #0056b3;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.submit-button {
  background-color: #28a745;
  color: white;
  padding: 10px 20px;
  border: none;
  cursor: pointer;
  border-radius: 4px;
  transition: background 0.3s;
}

.submit-button:hover {
  background-color: #218838;
}

.message {
  color: red;
  margin-top: 10px;
}
</style>
