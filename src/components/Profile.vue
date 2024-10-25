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
      absenHistory: [],
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
          const index = this.absenHistory.findIndex(record => record.id === this.form.id);
          this.$set(this.absenHistory, index, this.form);
        } else {
          const response = await axios.post('/pegawai/absen', this.form);
          this.message = response.data.message;
          this.absenHistory.push({ ...this.form, id: this.absenHistory.length + 1 });
        }
        this.closeModal();
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
    async fetchAbsenHistory() {
      try {
        const response = await axios.get('/pegawai/absen/history');
        this.absenHistory = response.data;
      } catch (error) {
        console.error('Error fetching history:', error);
      }
    }
  },
  mounted() {
    document.addEventListener('click', this.handleOutsideClick);
    this.fetchAbsenHistory();
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

.sidebar {
  width: 250px;
  background-color: #343a40;
  color: white;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  padding: 20px;
}

.sidebar ul li {
  display: flex;
  align-items: center; /* Align text with icons */
  cursor: pointer; /* Add pointer cursor */
  padding: 10px 0; /* Add padding for better click area */
}

.sidebar ul li i {
  margin-right: 10px; /* Space between icon and text */
  color: white; /* Change icon color */
}

.content-area {
  margin-left: 250px;
  padding: 20px;
  flex-grow: 1;
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #343a40;
  padding: 10px 20px;
  color: white;
}

.search-input {
  padding: 8px;
  border: none;
  border-radius: 4px;
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
  top: 40px; /* Position it below the button */
  right: 0;
  background-color: white;
  color: black;
  border: 1px solid #ccc;
  border-radius: 4px;
  z-index: 1000;
}

.dropdown-menu ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.dropdown-menu li {
  padding: 10px;
  cursor: pointer;
}

.dropdown-menu li:hover {
  background-color: #f0f0f0; /* Change background on hover */
}

.main-content {
  padding: 20px;
  background-color: #fff; /* White background for content */
  border-radius: 4px; /* Rounded corners for content area */
}

.absen-table {
  width: 100%;
  border-collapse: collapse;
}

.absen-table th, .absen-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

.absen-table th {
  background-color: #343a40;
  color: white;
}

.add-absen-button {
  background-color: #007bff; /* Button color */
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.add-absen-button:hover {
  background-color: #0056b3; /* Darker blue on hover */
}

/* Modal Styles */
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
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 30px;
  border-radius: 8px;
  width: 400px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  animation: fadeIn 0.3s;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.close {
  cursor: pointer;
  font-size: 24px;
  color: #343a40;
  position: absolute;
  top: 15px;
  right: 20px;
}

.close:hover {
  color: #ff0000;
}

.form-group {
  margin-bottom: 20px;
}

.submit-button {
  background-color: #007bff;
  color: white;
  padding: 12px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  width: 100%;
}

.submit-button:hover {
  background-color: #0056b3;
}

.message {
  color: red;
  margin-top: 10px;
}
</style>
