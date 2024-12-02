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
                <!-- Tampilkan pesan jika data kelas kosong -->
                <tr v-if="kelasData.length === 0">
                    <td colspan="5">Tidak ada data kelas yang tersedia.</td>
                </tr>
                <!-- Render data kelas -->
                <tr v-for="kelas in kelasData" :key="kelas.id">
                    <td>{{ kelas.id }}</td>
                    <td>{{ kelas.nama_kelas }}</td>
                    <td>
                        <!-- Render daftar anggota sebagai list -->
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
            kelasData: [], // Menyimpan data kelas dari API
        };
    },
    methods: {
        // Format tanggal agar mudah dibaca
        formatDate(date) {
            if (!date) return 'N/A';
            const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
            return new Date(date).toLocaleDateString('id-ID', options);
        },
        // Fetch data kelas dari API
        async fetchData() {
            try {
                const response = await axios.get('http://localhost:8000/api/listkelas');
                if (response.data.status === "success") {
                    // Simpan data kelas di `kelasData`
                    this.kelasData = response.data.data;
                } else {
                    console.error("Gagal memuat data kelas:", response.data.message);
                }
            } catch (error) {
                console.error("Terjadi kesalahan saat mengambil data:", error.message);
            }
        }
    },
    mounted() {
        // Fetch data saat komponen dimuat
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
