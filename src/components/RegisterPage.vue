<template>
  <div class="background">
    <div class="regis-container">
      <!-- Tambahkan elemen gambar untuk logo -->
      <div class="form">
        <img src="./Logo Kemdikbud.png" alt="Logo" class="logo" />
        <h2>Register</h2>
        <form @submit.prevent="handleRegister">
          <div class="form-group">
            <label for="password">Nama</label>
            <input type="text" v-model="Nama" id="password" placeholder="Enter your name" required />
          </div>
          <div class="form-group">
            <label for="username">Username</label>
            <input type="text" v-model="username" id="username" placeholder="Enter your username" required />
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" v-model="password" id="password" placeholder="Enter your password" required />
          </div>
          <button type="submit" :disabled="!isFormValid">Login</button>
          <router-link to="/" class="login-link">Have an account? Login</router-link>
          <router-link to="/forgot-password" class="forgot-password">Forgot Password?</router-link>
        </form>
        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: '',
      password: '',
      errorMessage: ''
    };
  },
  computed: {
    isFormValid() {
      return this.username.trim() !== '' && this.password.trim() !== '';
    }
  },
  methods: {
    handleLogin() {
      // Simulasi proses login
      if (this.username === 'admin' && this.password === 'password') {
        alert('Login berhasil!');
        // Lakukan navigasi atau pengalihan setelah login berhasil
      } else {
        this.errorMessage = 'Username atau password salah';
      }
    }
  }
};
</script>

<style scoped>
.background {
  background-image: url('/src/components/bg2.jpg');
  background-size: cover;
  background-position: center;
  height: 100vh;
  /* Membuat tinggi background full */
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.regis-container {
  width: 55%;
  height: 100vh;
  /* Membuat kontainer setinggi layar */
  padding: 30px;
  background-color: rgba(255, 255, 255, 0,3);
  backdrop-filter: blur(8px); /* Blur latar belakang */
  backdrop-filter: blur(8px); /* Blur latar belakang */
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px 0 0 8px;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}

.logo {
  width: 250px;
  /* Sesuaikan ukuran logo */
  height: auto;
  margin-bottom: 5px;
  margin-top: 40px;
  /* Beri jarak antara logo dan judul */
}

.form {
  width: 80%;
  background-color: #fff;
  height: auto;
  border: #000000 2px solid;
  border-radius: 10px;
  padding-top: -50px;
  padding: 0% 5% 5% 5%;
}

h2 {
  margin-top: 10%;
  margin-bottom: 20px;
  font-size: 2rem;
  font-weight: bold;
  color: #333;
}

.form-group {
  margin-bottom: 20px;
  position: relative;
}

label {
  display: block;
  font-size: 1rem;
  margin-bottom: 3px;
  text-align: left;
  color: #555;
}

input[type="text"],
input[type="password"] {
  width: 100%;
  padding: 10px 5px;
  font-size: 1rem;
  border: none;
  border-bottom: 2px solid #ccc;
  background: none;
  outline: none;
  transition: border-color 0.3s;
}

input[type="text"]:focus,
input[type="password"]:focus {
  border-bottom: 2px solid #007BFF;
}

button {
  width: 100%;
  padding: 10px;
  font-size: 1rem;
  color: #fff;
  background-color: #007BFF;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:disabled {
  background-color: #aaa;
}

button:hover:not(:disabled) {
  background-color: #0056b3;
}

.login-link,
.forgot-password {
  display: block;
  margin-top: 10px;
  color: #007BFF;
  text-decoration: none;
  font-size: 0.9rem;
}

.login-link:hover,
.forgot-password:hover {
  text-decoration: underline;
}

.error {
  color: red;
  margin-top: 10px;
}
</style>
