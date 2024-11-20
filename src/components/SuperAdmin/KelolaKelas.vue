<template>
    <div>
        <h1>Kelola Kelas</h1>
        <table class="table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Nama Kelas</th>
                    <th>Daftar Anggota</th>
                    <th>Tanggal Dibuat</th>
                    <th>Tanggal Diperbarui</th>
                </tr>
            </thead>
            <tbody>
                <!-- Render data kelas jika tersedia -->
                <tr v-if="kelasData.length === 0">
                    <td colspan="5">Tidak ada data kelas yang tersedia.</td>
                </tr>
                <tr v-for="kelas in kelasData" :key="kelas.id">
                    <td>{{ kelas.id }}</td>
                    <td>{{ kelas.name }}</td>
                    <!-- Menampilkan daftar anggota dalam bentuk string atau list -->
                    <td>
                        <ul v-if="Array.isArray(kelas.daftar_anggota)">
                            <li v-for="(anggota, index) in kelas.daftar_anggota" :key="index">{{ anggota }}</li>
                        </ul>
                        <span v-else>Tidak ada anggota</span>
                    </td>
                    <td>{{ formatDate(kelas.created_at) }}</td>
                    <td>{{ formatDate(kelas.updated_at) }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'KelolaKelas',
    data() {
        return {
            kelasData: [], // Menyimpan data kelas yang diterima dari API
        };
    },
    methods: {
        // Format tanggal agar lebih mudah dibaca
        formatDate(date) {
            if (!date) return 'N/A';
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            return new Date(date).toLocaleDateString('id-ID', options);
        },
        // Fetch data kelas dari API
        async fetchData() {
            try {
                const response = await axios.get('http://localhost:8000/api/kelas');
                if (response.data.status === "success") {
                    this.kelasData = response.data.data; // Menyimpan data kelas
                } else {
                    console.error("Error fetching data:", response.data.message);
                }
            } catch (error) {
                console.error("Error fetching data:", error.message);
            }
        }
    },
    mounted() {
        // Memanggil fetchData saat komponen dimuat
        this.fetchData();
    }
};
</script>

<style scoped>
.table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
}

.table th,
.table td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
}

.table th {
    background-color: #f2f2f2;
}
</style>
