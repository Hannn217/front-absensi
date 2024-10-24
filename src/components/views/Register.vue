<template>
  <div class="container-outer">
    <div class="register-container">
      <h2>Buat Akun Baru</h2>
      <form @submit.prevent="handleRegister">
        <div class="mb-3">
          <input type="text" v-model="username" class="form-control" placeholder="User Name" required />
        </div>
        <div class="mb-3">
          <input type="text" v-model="nama" class="form-control" placeholder="Nama Lengkap" required />
        </div>
        <div class="mb-3">
          <input type="email" v-model="email" class="form-control" placeholder="Alamat Email" required />
        </div>
        <div class="mb-3">
          <input type="password" v-model="password" class="form-control" placeholder="Kata Sandi" required />
        </div>
        <div class="mb-3">
          <input type="password" v-model="confirmPassword" class="form-control" placeholder="Konfirmasi Kata Sandi" required />
        </div>
        <div class="mb-3">
          <input type="text" v-model="nomor_hp" class="form-control" placeholder="Nomor HP" required />
        </div>
        <input type="hidden" v-model="jabatan" />
        <button type="submit" class="btn btn-success btn-block" :disabled="!isFormValid || isLoading">
          <span v-if="isLoading">Loading...</span>
          <span v-else>Daftar</span>
        </button>
      </form>
      <p v-if="errorMessage" class="text-danger mt-2">{{ errorMessage }}</p>
      <p class="mt-3">Sudah punya akun? <router-link to="/login">Login</router-link></p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      username: "",
      nama: "",
      email: "",
      password: "",
      confirmPassword: "",
      nomor_hp: "",
      jabatan: "Pegawai", // jadi default kek jabatan
      errorMessage: "",
      isLoading: false, // loding e
    };
  },
  computed: {
    isFormValid() {
      return (
        this.username.trim() !== "" &&
        this.nama.trim() !== "" &&
        this.email.trim() !== "" &&
        this.password.trim() !== "" &&
        this.nomor_hp.trim() !== "" &&
        this.password === this.confirmPassword
      );
    },
  },
  methods: {
    async handleRegister() {
      this.errorMessage = ""; // kek reset pesan kesalahan
      if (!this.isFormValid) {
        this.errorMessage = "Pastikan semua kolom terisi dan kata sandi cocok.";
        return;
      }

      this.isLoading = true; 

      try {
        const response = await axios.post('http://localhost:8000/api/register', {
          username: this.username,
          nama: this.nama,
          email: this.email,
          password: this.password,
          nomor_hp: this.nomor_hp,
          jabatan: this.jabatan, // nambeh jabatan ke data yang dikirim kek user
        });

        alert("Registrasi berhasil!");
        this.$router.push('/home/pegawai'); // Redirect ke halaman ne men berhasil
      } catch (error) {
        if (error.response) {
          this.errorMessage = error.response.data.message || "Registrasi gagal. Coba lagi.";
        } else {
          this.errorMessage = "Registrasi gagal. Coba lagi.";
        }
      } finally {
        this.isLoading = false; // Reset loading men l udeh register
      }
    },
  },
};
</script>

<style scoped>
/* Flexbox untuk memastikan container selalu di tengah */
body,
html {
  margin: 0;
  padding: 0;
  height: 100%;
}

.container-outer {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f8f9fa;
}

.register-container {
  background-color: #fff;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 100%;
  text-align: center;
}

.register-container h2 {
  margin-bottom: 20px;
}

.btn-success {
  width: 100%;
}

.text-danger {
  color: #dc3545;
}
</style>
