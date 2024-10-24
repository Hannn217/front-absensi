<template>
  <div class="container-outer">
    <div class="register-container">
      <h2>Buat akun baru</h2>
      <form @submit.prevent="handleRegister">
        <div class="mb-3">
          <input type="text" v-model="username" class="form-control" placeholder="User Name" required />
        </div>
        <div class="mb-3">
          <input type="text" v-model="nama" class="form-control" placeholder="Nama Lengkap" required />
        </div>
        <div class="mb-3">
          <input type="email" v-model="email" class="form-control" placeholder="Alamat email" required />
        </div>
        <div class="mb-3">
          <input type="password" v-model="password" class="form-control" placeholder="Kata sandi" required />
        </div>
        <div class="mb-3">
          <input type="password" v-model="confirmPassword" class="form-control" placeholder="Konfirmasi Kata Sandi"
            required />
        </div>
        <div class="mb-3">
          <input type="text" v-model="nomor_hp" class="form-control" placeholder="Nomor HP" required />
        </div>
        <button type="submit" class="btn btn-success btn-block" :disabled="!isFormValid">
          Daftar
        </button>
      </form>
      <p v-if="errorMessage" class="text-danger mt-2">{{ errorMessage }}</p>
      <p class="mt-3">Sudah punya akun? <router-link to="/">Login</router-link></p>
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
      nomor_hp: "",
      confirmPassword: "",
      errorMessage: "",
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
      try {
        if (!this.isFormValid) {
          this.errorMessage = "Pastikan semua kolom terisi dan kata sandi cocok.";
          return;
        }

        // Log the registration data for debugging
        console.log({
          username: this.username,
          nama: this.nama,
          email: this.email,
          password: this.password,
          nomor_hp: this.nomor_hp,
          role: this.role, // Log the selected role
        });

        const response = await axios.post('http://localhost:8000/api/register', {
          username: this.username,
          nama: this.nama,
          email: this.email,
          password: this.password,
          nomor_hp: this.nomor_hp,
          jabatan: this.role, // Use selected role in the request
        });

        alert("Registrasi berhasil!");

        // Redirect to home page based on the user's role
        let homeRoute = '';
        switch (this.role) {
          case 'super_admin':
            homeRoute = '/home/super-admin';
            break;
          case 'system_admin':
            homeRoute = '/home/system-admin';
            break;
          case 'ketua_kelas':
            homeRoute = '/home/ketua-kelas';
            break;
          case 'pegawai':
            homeRoute = '/home/pegawai';
            break;
        }

        this.$router.push(homeRoute); // Redirect to the appropriate home route
      } catch (error) {
        if (error.response) {
          console.error(error.response.data);
          this.errorMessage = error.response.data.message || "Registrasi gagal. Coba lagi.";
        } else {
          console.error(error);
          this.errorMessage = "Registrasi gagal. Coba lagi.";
        }
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
