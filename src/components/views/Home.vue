<template>
  <div>
    <h2>Absen Pegawai</h2>
    <form @submit.prevent="submitAbsen">
      <div>
        <label>Nama:</label>
        <input v-model="form.nama" type="text" required />
      </div>
      <div>
        <label>Username:</label>
        <input v-model="form.username" type="text" required />
      </div>
      <div>
        <label>Keterangan:</label>
        <select v-model="form.keterangan" required>
          <option value="hadir">Hadir</option>
          <option value="izin">Izin</option>
          <option value="sakit">Sakit</option>
        </select>
      </div>
      <div>
        <label>Alasan:</label>
        <input v-model="form.alasan" type="text" required />
      </div>
      <div>
        <label>Nama Kelas:</label>
        <input v-model="form.nama_kelas" type="text" required />
      </div>
      <div>
        <label>Tanggal:</label>
        <input v-model="form.date" type="date" required />
      </div>
      <button type="submit">Submit Absen</button>
    </form>
    <p v-if="message">{{ message }}</p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      form: {
        nama: '',
        username: '',
        keterangan: 'hadir', // Default option
        alasan: '',
        nama_kelas: '',
        date: ''
      },
      message: ''
    };
  },
  methods: {
    async submitAbsen() {
      try {
        // Ambil token dari localStorage (jika menggunakan token)
        const token = localStorage.getItem('token'); 
        if (token) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }

        const response = await axios.post('/pegawai/absen', this.form);
        this.message = response.data.message; // Menampilkan pesan dari respons
        this.resetForm(); // Reset form setelah submit berhasil
      } catch (error) {
        if (error.response) {
          // Cek apakah ada kesalahan validasi
          if (error.response.data.errors) {
            this.message = Object.values(error.response.data.errors).flat().join(', '); // Gabungkan semua pesan kesalahan
          } else {
            this.message = error.response.data.message || 'Terjadi kesalahan'; // Pesan kesalahan umum
          }
        } else {
          this.message = 'Kesalahan jaringan'; // Pesan kesalahan untuk kesalahan jaringan
        }
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
    }
  }
};
</script>

<style scoped>
form div {
  margin-bottom: 10px;
}
</style>
