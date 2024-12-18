<template>
    <div>
        <h1>Daftar Pegawai</h1>
        <div v-if="loading" class="loader"></div>

        <!-- Tabel Pegawai -->
        <table v-if="!loading && employees.length" class="employee-table">
            <thead>
                <tr>
                    <th>Nama</th>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Nomor HP</th>
                    <th>Jabatan</th>
                    <th>Kelas</th>
                    <th>Aksi</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="employee in employees" :key="employee.username">
                    <td>{{ employee.nama || 'Tidak Ada Data' }}</td>
                    <td>{{ employee.username || 'Tidak Ada Data' }}</td>
                    <td>{{ employee.email || 'Tidak Ada Data' }}</td>
                    <td>{{ employee.nomor_hp || 'Tidak Ada Data' }}</td>
                    <td>{{ employee.jabatan || 'Tidak Ada Data' }}</td>
                    <td>{{ employee.nama_kelas || 'Belum Ditambahkan ke dalam kelas' }}</td>
                    <td>
                        <!-- Aksi -->
                        <div v-if="employee.jabatan === 'System Admin'">
                            <i class="fas fa-edit action-icon" @click="editEmployee(employee.username)"
                                title="Edit"></i>
                            <i class="fas fa-trash action-icon" @click="deleteEmployee(employee.username)"
                                title="Hapus"></i>
                        </div>
                        <div v-else-if="employee.jabatan === 'Pegawai'">
                            <i class="fas fa-arrow-up action-icon" @click="openPromotionDialog(employee)"
                                title="Promosikan"></i>
                            <i class="fas fa-edit action-icon" @click="editEmployee(employee.username)"
                                title="Edit"></i>
                            <i class="fas fa-trash action-icon" @click="deleteEmployee(employee.username)"
                                title="Hapus"></i>
                        </div>
                        <div v-else-if="employee.jabatan === 'Ketua Kelas'">
                            <i class="fas fa-arrow-down action-icon" @click="demoteEmployee(employee.username)"
                                title="Demote"></i>
                            <i class="fas fa-edit action-icon" @click="editEmployee(employee.username)"
                                title="Edit"></i>
                            <i class="fas fa-trash action-icon" @click="deleteEmployee(employee.username)"
                                title="Hapus"></i>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
        <p v-else>Tidak ada data pegawai.</p>
    </div>
</template>

<script>
import axios from "axios";

export default {
    data() {
        return {
            employees: [], // Data pegawai
            loading: false, // Status loading
            error: "", // Pesan error jika ada
        };
    },
    methods: {
        // Mengambil data pegawai dari API
        async fetchEmployees() {
            this.loading = true;
            try {
                const response = await axios.get("http://localhost:8000/api/all/profile");
                this.employees = response.data.data || []; // Gunakan data API, validasi jika kosong
            } catch (error) {
                console.error(error);
                this.error = "Gagal memuat data pegawai.";
            } finally {
                this.loading = false;
            }
        },

        // Fungsi untuk mengedit pegawai
        editEmployee(username) {
            alert(`Edit pegawai dengan username: ${username}`);
        },

        // Fungsi untuk menghapus pegawai
        deleteEmployee(username) {
            alert(`Hapus pegawai dengan username: ${username}`);
        },

        // Fungsi untuk membuka dialog promosi
        openPromotionDialog(employee) {
            alert(`Promosikan pegawai: ${employee.nama}`);
        },

        // Fungsi untuk menurunkan jabatan pegawai
        demoteEmployee(username) {
            alert(`Demote pegawai dengan username: ${username}`);
        },
    },
    mounted() {
        // Memuat data pegawai saat komponen di-mount
        this.fetchEmployees();
    },
};
</script>

<style scoped>
/* Gaya untuk loader */
.loader {
    border: 8px solid #f3f3f3;
    border-top: 8px solid #3498db;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    animation: spin 1s linear infinite;
    margin: 20px auto;
}

/* Animasi loading */
@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

/* Tabel gaya */
.employee-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
}

.employee-table th,
.employee-table td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
}

.employee-table th {
    background-color: #f4f4f4;
    font-weight: bold;
}

/* Gaya untuk ikon */
.action-icon {
    cursor: pointer;
    margin-right: 10px;
    color: #3498db;
}

.action-icon:hover {
    color: #1abc9c;
}
</style>
