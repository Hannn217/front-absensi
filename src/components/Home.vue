<script setup>
import NavBar from './NavBar.vue';

</script>

<template>
  <NavBar />
  <div class="home">
    <h1>Selamat Datang di Aplikasi Perpustakaan</h1>
    <p>Ini adalah halaman beranda. Silakan pilih salah satu opsi di menu untuk melanjutkan.</p>
    <router-link to="/login">Login</router-link>
    <br />
    <router-link to="/register">Register</router-link>
  </div>
</template>
