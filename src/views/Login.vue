<template>
  <div class="container-outer">
    <div class="login-container">
      <h2>Masuk</h2>
      <form @submit.prevent="handleLogin">
        <div class="mb-3">
          <input type="text" v-model="username" class="form-control" placeholder="User Name" required />
        </div>
        <div class="mb-3">
          <input type="password" v-model="password" class="form-control" placeholder="Kata Sandi" required />
        </div>
        <button type="submit" class="btn btn-success btn-block" :disabled="!isFormValid">
          Masuk
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
  name: 'Login',
  data() {
    return {
      username: "",
      password: "",
      errorMessage: "",
    };
  },
  computed: {
    isFormValid() {
      return this.username.trim() !== "" && this.password.trim() !== "";
    },
  },
  methods: {
    async handleLogin() {
      try {
        if (!this.isFormValid) {
          this.errorMessage = "Pastikan semua kolom terisi.";
          return;
        }

        // Log the login data for debugging
        // console.log({
        //   username: this.username,
        //   password: this.password,
        // });

        const response = await axios.post('http://localhost:8000/api/login', {
          username: this.username,
          password: this.password,
        });
        console.log(response.data)
        // Reset error message when login is successful
        this.errorMessage = "";

        // Assume the response contains user data including the role
        const userData = response.data.user; // Adjust according to your API response structure
        // console.log(userData)

        if (!userData || !userData.jabatan) {
          console.log('masuk')
          this.errorMessage = "Role tidak ditemukan. Hubungi admin.";
          return;
        }

        // Simpan user data di localStorage
        localStorage.setItem('user', JSON.stringify(userData));

        // Tampilkan alert login berhasil
        alert("Login berhasil!");

        // Redirect ke halaman berdasarkan role
        const validRoles = ['super_admin', 'system_admin', 'ketua_kelas', 'pegawai'];

        if (validRoles.includes(userData.jabatan)) {
          this.$router.push('/home');
        } else {
          this.errorMessage = "Role tidak valid.";
        }
      } catch (error) {
        if (error.response) {
          console.error(error.response.data);
          this.errorMessage = error.response.data.message || "Login gagal. Coba lagi.";
        } else {
          console.error(error);
          this.errorMessage = "Login gagal. Coba lagi.";
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
</style>
