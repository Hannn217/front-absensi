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
      <div>
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
import axios from 'axios'; // Import axios

export default {
  data() {
    return {
      // Existing data properties...
      modalVisible: false,
      form: {
        nama: '',
        username: '',
        keterangan: 'hadir',
        alasan: '',
        nama_kelas: '',
        date: ''
      },
      absenHistory: [], // Assuming this array holds the absen records
      showSuccessNotification: false,
      showErrorNotification: false,
      errorMessage: '',
      message: '',
      isEditing: false, // To manage edit mode if needed
      apiUrl: '/pegawai/absen', // API endpoint for absensi

      // Added missing properties
      searchQuery: '',
      username: '', // Set your username dynamically as needed
      dropdownVisible: false,
      currentView: 'home' // Set your default view; change as needed
    };
  },
  methods: {
    showModal() {
      this.modalVisible = true;
      this.resetForm(); // Reset the form when showing modal
    },
    closeModal() {
      this.modalVisible = false;
    },
    async submitAbsen() {
      // Validate the form if necessary
      if (this.form.nama && this.form.nama_kelas && this.form.keterangan && this.form.alasan && this.form.date) {
        try {
          // Send a POST request to the API
          const response = await axios.post(this.apiUrl, {
            ...this.form,
            timestamp: new Date().toISOString(), // Capture timestamp
          });

          // Assuming response returns the created record
          this.absenHistory.push(response.data);
          this.showSuccessNotification = true;
          this.message = 'Absen berhasil!';

          // Reset the form
          this.resetForm();
          this.closeModal();
        } catch (error) {
          this.showErrorNotification = true;
          this.errorMessage = error.response?.data?.message || 'Gagal Absen!';
        }
      } else {
        this.showErrorNotification = true;
        this.errorMessage = 'Please fill in all fields!';
      }
    },
    resetForm() {
      this.form = {
        nama: '',
        username: '',
        keterangan: 'hadir',
        alasan: '',
        nama_kelas: '',
        date: ''
      };
      this.message = '';
    },
    toggleDropdown() {
      this.dropdownVisible = !this.dropdownVisible; // Toggle dropdown visibility
    },
    // Other existing methods (navigateTo, logout, deleteAbsen, etc.)
  }
};
</script>


<style scoped>
.dashboard-container {
  display: flex;
  height: 100vh;
  font-family: 'Arial', sans-serif; /* Elegant font */
}

.sidebar {
  width: 250px;
  background-color: #2c3e50; /* Darker background for elegance */
  color: #ecf0f1; /* Light text color */
  padding: 20px;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.3); /* Subtle shadow */
  transition: width 0.3s; /* Smooth transition */
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
  transition: background-color 0.3s, transform 0.2s; /* Animation */
}

.sidebar li:hover {
  background-color: #34495e; /* Slightly lighter on hover */
  transform: scale(1.05); /* Scale effect */
}

.content-area {
  flex: 1;
  padding: 20px;
  background-color: #ecf0f1; /* Light background for contrast */
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: #3498db; /* Elegant color */
  color: white;
  border-radius: 5px; /* Rounded corners */
}

.search-input {
  padding: 8px;
  border-radius: 4px;
  border: none;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* Subtle shadow */
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
  padding: 10px;
  text-align: center; /* Centered text for better readability */
}

.absen-table th {
  background-color: #3498db; /* Header color */
  color: white;
}

.add-absen-button {
  padding: 10px 15px;
  background-color: #2ecc71; /* New color */
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 20px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* Shadow effect */
  transition: background-color 0.3s;
}

.add-absen-button:hover {
  background-color: #27ae60; /* Darker green on hover */
}

.delete-button {
  background: none;
  border: none;
  cursor: pointer;
  color: #e74c3c; /* Elegant red color */
}

.delete-button:hover {
  color: #c0392b; /* Darker red on hover */
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6); /* Dark background for modal */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  width: 400px; /* Fixed width */
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

.submit-button {
  padding: 10px 15px;
  background-color: #3498db; /* Elegant color */
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.submit-button:hover {
  background-color: #2980b9; /* Darker blue on hover */
}

.success-notification {
  background-color: #2ecc71;
  color: white;
  padding: 10px;
  position: fixed;
  top: 20px;
  right: 20px;
  border-radius: 5px;
  z-index: 1000;
}

.error-notification {
  background-color: #e74c3c;
  color: white;
  padding: 10px;
  position: fixed;
  top: 20px;
  right: 20px;
  border-radius: 5px;
  z-index: 1000;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0;
}
</style>
