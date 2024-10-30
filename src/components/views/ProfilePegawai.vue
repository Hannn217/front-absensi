<template>
    <Sidebar />
    <div class="profile-container">
        <h1>Profil Pengguna</h1>
        <div v-if="loading">Memuat profil...</div>
        <div v-else>
            <p><strong>Nama:</strong> {{ profile.nama }}</p>
            <p><strong>Username:</strong> {{ profile.username }}</p>
            <p><strong>Email:</strong> {{ profile.email }}</p>
            <p><strong>Nomor HP:</strong> {{ profile.nomor_hp }}</p>
            <p><strong>Jabatan:</strong> {{ profile.jabatan }}</p>
            <p><strong>Nama Kelas:</strong> {{ profile.nama_kelas }}</p>
            <p><strong>Dibuat pada:</strong> {{ profile.created_at }}</p>
            <p><strong>Diperbarui pada:</strong> {{ profile.updated_at }}</p>
        </div>
    </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import Sidebar from '../Sidebar.vue';

export default {
    name: 'ProfilePegawai',
    components: {
        Navbar,
        Sidebar,
    },
    setup() {
        const profile = ref({});
        const loading = ref(true);
        const username = ref('');

        onMounted(async () => {
            username.value = this.$route.params.username;
            await fetchProfile(username.value);
        });

        const fetchProfile = async (username) => {
            try {
                const response = await axios.get(`http://localhost:8000/api/profile/${username}`);
                profile.value = response.data;
                loading.value = false;
            } catch (error) {
                console.error('Gagal memuat profil', error);
                alert('Gagal memuat profil. Coba lagi.');
            }
        };

        return {
            profile,
            loading,
        };
    },
};
</script>

<style scoped>
.profile-container {
    padding: 20px;
    background-color: white;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
}
</style>