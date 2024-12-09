<template>
    <div>
        <h1>Kelola Kelas</h1>
        <table class="table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Nama Kelas</th>
                    <th>Daftar Anggota</th>
                    <th>Aksi</th>
                </tr>
            </thead>
            <tbody>
                <!-- Tampilkan pesan jika data kelas kosong -->
                <tr v-if="kelasData.length === 0">
                    <td colspan="4">{{ errorMessage || "Tidak ada data kelas yang tersedia." }}</td>
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
                    <td>
                        <!-- Tombol aksi (Edit dan Hapus) -->
                        <button @click="editKelas(kelas.id)" class="btn btn-warning">Edit</button>
                        <button @click="deleteKelas(kelas.id)" class="btn btn-danger">Hapus</button>
                    </td>
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
            errorMessage: null, // Pesan error jika terjadi masalah
        };
    },
    methods: {
        // Fetch data kelas dari API
        async fetchData() {
            try {
                console.log('Fetching data from:', 'http://localhost:8000/api/listkelas'); // Debugging
                const response = await axios.get('http://localhost:8000/api/listkelas');
                if (response.data.status === "success") {
                    this.kelasData = response.data.data;
                } else {
                    this.errorMessage = "Gagal memuat data kelas: " + response.data.message;
                }
            } catch (error) {
                this.errorMessage = "Terjadi kesalahan saat mengambil data: " + error.message;
                console.error(error);
            }
        },
        // Fungsi untuk tombol edit
        editKelas(id) {
            console.log(`Edit kelas dengan ID: ${id}`);
            // Anda bisa menambahkan navigasi ke halaman edit atau membuka modal edit
        },
        // Fungsi untuk tombol hapus
        async deleteKelas(id) {
            const confirmation = confirm("Apakah Anda yakin ingin menghapus kelas ini?");
            if (confirmation) {
                try {
                    const response = await axios.delete(`http://localhost:8000/api/kelas/${id}`);
                    if (response.status === 200) {
                        alert("Kelas berhasil dihapus.");
                        this.fetchData(); // Refresh data setelah penghapusan
                    }
                } catch (error) {
                    console.error("Gagal menghapus kelas:", error.message);
                    alert("Terjadi kesalahan saat menghapus kelas.");
                }
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

.btn {
    padding: 5px 10px;
    margin: 2px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.btn-warning {
    background-color: #f0ad4e;
    color: white;
}

.btn-danger {
    background-color: #d9534f;
    color: white;
}
</style>
