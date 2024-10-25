Register.vue
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

        <!-- Input untuk Kata Sandi -->
        <div class="mb-3 password-field">
          <input :type="showPassword ? 'text' : 'password'" v-model="password" class="form-control"
            placeholder="Kata Sandi" required />
          <span class="toggle-password" @click="toggleShowPassword">
            <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
          </span>
        </div>

        <!-- Input untuk Konfirmasi Kata Sandi -->
        <div class="mb-3 password-field">
          <input :type="showConfirmPassword ? 'text' : 'password'" v-model="confirmPassword" class="form-control"
            placeholder="Konfirmasi Kata Sandi" required />
          <span class="toggle-password" @click="toggleShowConfirmPassword">
            <i :class="showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
          </span>
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
      <p class="mt-3">Sudah punya akun? <router-link to="/">Login</router-link></p>
      <p class="mt-3">Sudah punya akun? <router-link to="/">Login</router-link></p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Register',
  data() {
    return {
      username: "",
      nama: "",
      email: "",
      password: "",
      confirmPassword: "",
      nomor_hp: "",
      jabatan: "Pegawai",
      errorMessage: "",
      isLoading: false,
      showPassword: false,
      showConfirmPassword: false,
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
    toggleShowPassword() {
      this.showPassword = !this.showPassword;
    },
    toggleShowConfirmPassword() {
      this.showConfirmPassword = !this.showConfirmPassword;
    },
    async handleRegister() {
      this.errorMessage = "";

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
          jabatan: this.jabatan,
        });

        alert("Registrasi berhasil!");
        this.$router.push('/home/pegawai');
      } catch (error) {
        if (error.response) {
          this.errorMessage = error.response.data.message || "Registrasi gagal. Coba lagi.";
        } else {
          this.errorMessage = "Registrasi gagal. Coba lagi.";
        }
      } finally {
        this.isLoading = false;
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

.password-field {
  position: relative;
}

.toggle-password {
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  cursor: pointer;
  color: #6c757d;
  /* Sama seperti warna di login.vue */
}

.toggle-password i {
  font-size: 18px;
}

.btn-success {
  width: 100%;
  background-color: #28a745;
  /* Sesuaikan dengan warna tombol di login */
  border-color: #28a745;
}

.btn-success:hover {
  background-color: #218838;
  border-color: #1e7e34;
}

.text-danger {
  color: #dc3545;
}

.form-control {
  padding: 10px;
  border: 1px solid #ced4da;
  border-radius: 5px;
  width: 100%;
  margin-bottom: 10px;
}

.form-control:focus {
  border-color: #28a745;
  box-shadow: 0 0 5px rgba(40, 167, 69, 0.5);
}
</style>
