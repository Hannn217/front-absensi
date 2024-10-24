<template>
  <div class="pegawai-container">
    <h2>Selamat Datang, {{ user.nama }}</h2>
    <div class="pegawai-details">
      <p><strong>User Name:</strong> {{ user.username }}</p>
      <p><strong>Nama Lengkap:</strong> {{ user.nama }}</p>
      <p><strong>Email:</strong> {{ user.email }}</p>
      <p><strong>Nomor HP:</strong> {{ user.nomor_hp }}</p>
      <p><strong>Jabatan:</strong> {{ user.jabatan }}</p>
    </div>
    <button @click="logout" class="btn btn-danger">Logout</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: {},
    };
  },
  created() {
    // kek ngambik data user
    this.user = JSON.parse(localStorage.getItem('user')) || {}; // Ganti dengan pengambilan data dari API jika perlu
  },
  methods: {
    logout() {
      localStorage.removeItem('user'); // ngapus data user
      this.$router.push('/login'); // Redirect ke halaman login
    },
  },
};
</script>

<style scoped>
.pegawai-container {
  padding: 20px;
  text-align: center;
}

.pegawai-details {
  margin: 20px 0;
}

.btn-danger {
  margin-top: 20px;
}
</style>
