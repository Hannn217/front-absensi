<template>
  <div class="container-outer">
    <div class="login-container">
      <h2>Masuk</h2>
      <form @submit.prevent="handleLogin">
        <div class="mb-3">
          <input type="text" v-model="username" class="form-control" placeholder="User Name" required />
        </div>
        <div class="mb-3 password-container">
          <input :type="showPassword ? 'text' : 'password'" v-model="password" class="form-control"
            placeholder="Kata Sandi" required />
          <span class="toggle-password" @click="togglePassword">
            <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
          </span>
        </div>
        <button type="submit" class="btn btn-success btn-block" :disabled="!isFormValid || isLoading">
          <span v-if="isLoading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          <span v-if="!isLoading">Masuk</span>
        </button>
      </form>
      <p v-if="errorMessage" class="text-danger mt-2">{{ errorMessage }}</p>
      <p class="mt-3">Belum punya akun? <router-link to="/register">Daftar</router-link></p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      username: "",
      password: "",
      showPassword: false,
      isLoading: false, // Kontrol untuk loading
      errorMessage: "",
    };
  },
  computed: {
    isFormValid() {
      return this.username.trim() !== "" && this.password.trim() !== "";
    },
  },
  methods: {
    togglePassword() {
      this.showPassword = !this.showPassword;
    },
    async handleLogin() {
      this.errorMessage = "";
      if (!this.isFormValid) {
        this.errorMessage = "Pastikan semua kolom terisi.";
        return;
      }

      this.isLoading = true; // Mulai loading

      try {
        const response = await axios.post('http://localhost:8000/api/login', {
          username: this.username,
          password: this.password,
        });

        const userData = response.data.userData;
        const token = response.data.token;
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', token);

        alert("Login berhasil!");

        // Redect lama sesuai jabatan
        switch (userData.jabatan) {
          case 'Super Admin':
            this.$router.push('/home/super-admin/pegawai');
            break;
          case 'System Admin':
            this.$router.push('/home/system-admin');
            break;
          case 'Ketua Kelas':
            this.$router.push('/home/ketua-kelas');
            break;
          case 'Pegawai':
            this.$router.push('/home/pegawai');
            break;
          default:
            this.errorMessage = "Role tidak dikenali.";
            break;
        }
      } catch (error) {
        if (error.response) {
          this.errorMessage = error.response.data.message || "Login gagal. Periksa username dan password.";
        } else {
          this.errorMessage = "Terjadi kesalahan. Coba lagi.";
        }
      } finally {
        this.isLoading = false; // Akhiri loading
      }
    },
  },
};
</script>

<style scoped>
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

.login-container {
  background-color: #fff;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 100%;
  text-align: center;
}

.login-container h2 {
  margin-bottom: 20px;
}

.btn-success {
  width: 100%;
}

.text-danger {
  color: #dc3545;
}

.password-container {
  position: relative;
}

.toggle-password {
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  cursor: pointer;
  color: #6c757d;
}

.spinner-border {
  vertical-align: middle;
}
</style>
