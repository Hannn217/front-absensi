<template>
  <div>
    <h1>Absen Pegawai</h1>

    <form @submit.prevent="absenPegawai">
      <h2>Form Absen</h2>
      <input v-model="absenData.nama" placeholder="Nama" required />
      <input v-model="absenData.username" placeholder="Username" required />
      <select v-model="absenData.keterangan" required>
        <option value="" disabled>Keterangan</option>
        <option value="hadir">Hadir</option>
        <option value="izin">Izin</option>
        <option value="sakit">Sakit</option>
      </select>
      <input v-model="absenData.alasan" placeholder="Alasan" required />
      <input v-model="absenData.nama_kelas" placeholder="Nama Kelas" required />
      <input type="date" v-model="absenData.date" required />
      <button type="submit">Absen</button>
    </form>

    <p v-if="responseMessage" :class="{'success-message': success, 'error-message': !success}">
      {{ responseMessage }}
    </p>

    <h2>Daftar Absen Pegawai</h2>
    <ul>
      <li v-for="pegawai in pegawaiList" :key="pegawai.username">
        {{ pegawai.nama }} - {{ pegawai.keterangan }} ({{ pegawai.date }})
        <button @click="deleteAbsen(pegawai.username)">Hapus</button>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      pegawaiList: [],
      absenData: {
        nama: '',
        username: '',
        keterangan: '',
        alasan: '',
        nama_kelas: '',
        date: ''
      },
      responseMessage: '',
      success: false,
      token: 'YOUR_BEARER_TOKEN_HERE', // Ganti dengan token Bearer Anda
    };
  },
  created() {
    this.fetchAbsen();
  },
  methods: {
    async fetchAbsen() {
      try {
        const response = await fetch('http://127.0.0.1:8000/pegawai/absen', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.token}`,  // Tambahkan Bearer Token
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        this.pegawaiList = await response.json();
      } catch (error) {
        this.responseMessage = 'Gagal mengambil data absen pegawai.';
        this.success = false;
        console.error('Error fetching pegawai:', error);
      }
    },
    
    async absenPegawai() {
      try {
        const response = await fetch('http://127.0.0.1:8000/pegawai/absen', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.token}`, // Tambahkan Bearer Token
            'Content-Type': 'application/x-www-form-urlencoded', // Sesuaikan Content-Type
          },
          body: new URLSearchParams(this.absenData), // Gunakan URLSearchParams untuk format x-www-form-urlencoded
        });

        if (response.ok) {
          const addedAbsen = await response.json();
          this.pegawaiList.push(addedAbsen.pegawai);
          this.responseMessage = 'Absen pegawai berhasil.';
          this.success = true;
          this.resetForm();
        } else {
          this.responseMessage = 'Gagal mengirim absen pegawai.';
          this.success = false;
        }
      } catch (error) {
        this.responseMessage = 'Terjadi kesalahan saat absen pegawai.';
        this.success = false;
        console.error('Error absen pegawai:', error);
      }
    },

    async deleteAbsen(username) {
      try {
        const response = await fetch(`http://127.0.0.1:8000/pegawai/absen/${username}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${this.token}`, // Tambahkan Bearer Token
          },
        });

        if (response.ok) {
          this.pegawaiList = this.pegawaiList.filter(pegawai => pegawai.username !== username);
          this.responseMessage = 'Absen pegawai berhasil dihapus.';
          this.success = true;
        } else {
          this.responseMessage = 'Gagal menghapus absen pegawai.';
          this.success = false;
        }
      } catch (error) {
        this.responseMessage = 'Terjadi kesalahan saat menghapus absen pegawai.';
        this.success = false;
        console.error('Error deleting absen:', error);
      }
    },

    resetForm() {
      this.absenData = {
        nama: '',
        username: '',
        keterangan: '',
        alasan: '',
        nama_kelas: '',
        date: ''
      };
    }
  }
};
</script>

<style scoped>
/* Tambahkan gaya CSS untuk pesan sukses dan error */
.success-message {
  color: green;
}

.error-message {
  color: red;
}
</style>
