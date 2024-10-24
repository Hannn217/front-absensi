<template>
  <div class="dashboard-container">
    <aside class="sidebar">
      <h2>Menu</h2>
      <ul>
        <li @click="navigateTo('home/pegawai')">
          <i class="fas fa-tachometer-alt"></i> Dashboard
        </li>
        <li @click="navigateTo('porfil')">
          <i class="fas fa-users"></i> Profil
        </li>
        <li @click="navigateTo('laporan')">
          <i class="fas fa-file-alt"></i> Laporan
        </li>
        <li @click="logout">
          <i class="fas fa-sign-out-alt"></i> Logout
        </li>
      </ul>
    </aside>
    <main class="main-content">
      <nav class="navbar">
        <button @click="showAddAbsensiModal" class="btn-add">
          <i class="fas fa-plus"></i> Tambah Absensi
        </button>
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Cari..."
          class="search-input"
        />
      </nav>

      <div class="absensi">
        <h2>Absensi</h2>
        <table>
          <thead>
            <tr>
              <th>Tanggal</th>
              <th>Status</th>
              <th>Alasan</th>
              <th>Nama Kelas</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, index) in filteredAbsensiData"
              :key="index"
              :class="{ 'row-hover': index % 2 === 0 }"
            >
              <td>{{ item.date }}</td>
              <td>{{ item.keterangan }}</td>
              <td>{{ item.alasan }}</td>
              <td>{{ item.nama_kelas }}</td>
              <td>
                <button @click="editAbsensi(index)">
                  <i class="fas fa-edit"></i> Edit
                </button>
                <button @click="deleteAbsensi(index)">
                  <i class="fas fa-trash-alt"></i> Hapus
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <transition name="fade">
        <div v-if="isModalVisible" class="modal-overlay">
          <div class="modal-small">
            <h4>{{ isEditing ? 'Edit' : 'Tambah' }} Absensi</h4>
            <label for="tanggal">Tanggal:</label>
            <input
              id="tanggal"
              v-model="absensiForm.date"
              type="date"
              required
              class="input-field"
            />

            <label for="status">Status:</label>
            <select
              id="status"
              v-model="absensiForm.keterangan"
              required
              class="input-field"
            >
              <option value="hadir">Hadir</option>
              <option value="izin">Izin</option>
              <option value="sakit">Sakit</option>
            </select>

            <label for="alasan">Alasan:</label>
            <input
              id="alasan"
              v-model="absensiForm.alasan"
              type="text"
              placeholder="Masukkan alasan"
              required
              class="input-field"
            />

            <label for="nama_kelas">Nama Kelas:</label>
            <input
              id="nama_kelas"
              v-model="absensiForm.nama_kelas"
              type="text"
              placeholder="Masukkan nama kelas"
              required
              class="input-field"
            />

            <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

            <div class="modal-actions">
              <button @click="isEditing ? updateAbsensi() : addAbsensi()" class="btn-submit">
                <i class="fas" :class="isEditing ? 'fa-check' : 'fa-plus'"></i>
                {{ isEditing ? 'Update' : 'Tambah' }}
              </button>
              <button @click="closeModal" class="btn-cancel">
                <i class="fas fa-times"></i> Batal
              </button>
            </div>
          </div>
        </div>
      </transition>

      <router-view />
    </main>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      user: {},
      absensiData: [],
      absensiForm: {
        date: '',
        keterangan: 'hadir',
        alasan: '',
        nama_kelas: '',
      },
      isModalVisible: false,
      isEditing: false,
      editIndex: null,
      errorMessage: '',
      searchQuery: '', // Menyimpan nilai pencarian
    };
  },
  created() {
    this.user = JSON.parse(localStorage.getItem('user')) || {};
    this.loadAbsensiData();
  },
  computed: {
    filteredAbsensiData() {
      if (!this.searchQuery) return this.absensiData;

      const query = this.searchQuery.toLowerCase();
      return this.absensiData.filter(item => {
        return (
          item.date.toLowerCase().includes(query) ||
          item.keterangan.toLowerCase().includes(query) ||
          item.nama_kelas.toLowerCase().includes(query)
        );
      });
    },
  },
  methods: {
    navigateTo(route) {
      this.$router.push(`/${route}`);
    },
    logout() {
      localStorage.removeItem('user');
      this.$router.push('/');
    },
    showAddAbsensiModal() {
      this.isModalVisible = true;
      this.isEditing = false;
      this.absensiForm = { date: '', keterangan: 'hadir', alasan: '', nama_kelas: '' };
      this.errorMessage = '';
    },
    async addAbsensi() {
      this.errorMessage = '';
      if (this.validateForm()) {
        try {
          const response = await axios.post('http://localhost:8000/api/pegawai/absen', this.absensiForm);
          if (response.data) {
            this.absensiData.push(response.data);
            this.closeModal();
          } else {
            console.error('Error: Response data is invalid');
          }
        } catch (error) {
          console.error('Error adding absensi:', error);
          this.errorMessage = 'Gagal menambah absensi. Silakan coba lagi.';
        }
      }
    },
    editAbsensi(index) {
      this.isEditing = true;
      this.editIndex = index;
      this.absensiForm = { ...this.absensiData[index] };
      this.isModalVisible = true;
      this.errorMessage = '';
    },
    async updateAbsensi() {
      this.errorMessage = '';
      if (this.validateForm()) {
        try {
          const response = await axios.put(`http://localhost:8000/api/pegawai/absen/${this.absensiData[this.editIndex].id}`, this.absensiForm);
          this.absensiData[this.editIndex] = response.data;
          this.closeModal();
        } catch (error) {
          console.error('Error updating absensi:', error);
          this.errorMessage = 'Gagal mengupdate absensi. Silakan coba lagi.';
        }
      }
    },
    async deleteAbsensi(index) {
      try {
        const id = this.absensiData[index].id;
        await axios.delete(`http://localhost:8000/api/pegawai/absen/${id}`);
        this.absensiData.splice(index, 1);
      } catch (error) {
        console.error('Error deleting absensi:', error);
      }
    },
    loadAbsensiData() {
      axios.get('http://localhost:8000/api/pegawai/absen')
        .then(response => {
          this.absensiData = response.data;
        })
        .catch(error => {
          console.error('Error loading absensi data:', error);
        });
    },
    closeModal() {
      this.isModalVisible = false;
      this.absensiForm = { date: '', keterangan: 'hadir', alasan: '', nama_kelas: '' };
      this.errorMessage = '';
    },
    validateForm() {
      if (!this.absensiForm.date || !this.absensiForm.alasan || !this.absensiForm.nama_kelas) {
        this.errorMessage = 'Semua field harus diisi!';
        return false;
      }
      return true;
    },
  },
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
  padding: 20px;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
}

.sidebar h2 {
  margin-bottom: 20px;
  text-align: center;
}

.sidebar ul {
  list-style-type: none;
  padding: 0;
}

.sidebar li {
  margin: 15px 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 10px;
  border-radius: 5px;
  transition: background 0.3s;
}

.sidebar li:hover {
  background: #495057;
}

.main-content {
  flex: 1;
  padding: 20px;
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.btn-add {
  background-color: #28a745;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
}

.search-input {
  padding: 8px;
  border: 1px solid #ced4da;
  width:300px;
  border-radius: 50px;
}



.absensi {
  margin-top: 20px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

th, td {
  border: 1px solid #ced4da;
  padding: 10px;
  text-align: left;
}

th {
  background-color: #007bff;
  color: white;
}

.row-hover {
  background-color: #f8f9fa;
}

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

.modal-small {
  background: white;
  padding: 20px;
  border-radius: 5px;
  width: 400px;
}

.input-field {
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ced4da;
  border-radius: 5px;
}

.modal-actions {
  display: flex;
  justify-content: space-between;
}

.btn-submit {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
}

.btn-submit:hover {
  background-color: #0056b3;
}

.btn-cancel {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
}

.btn-cancel:hover {
  background-color: #c82333;
}

.error-message {
  color: red;
  font-size: 14px;
  margin: 10px 0;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0;
}
</style>
