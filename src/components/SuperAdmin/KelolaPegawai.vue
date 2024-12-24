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
                        <i v-if="employee.jabatan === 'Ketua Kelas'" class="fas fa-arrow-down action-icon"
                            @click="openDemotionDialog(employee)" title="Turunkan Jabatan"></i>
                        <i v-else class="fas fa-arrow-up action-icon" @click="openPromotionDialog(employee)"
                            title="Promosikan"></i>
                        <i class="fas fa-edit action-icon" @click="openEditDialog(employee)" title="Edit"></i>
                        <i class="fas fa-trash action-icon" @click="openDeleteDialog(employee)" title="Hapus"></i>
                    </td>
                </tr>
            </tbody>
        </table>
        <p v-else>Tidak ada data pegawai.</p>

        <!-- Modal Promosi -->
        <div v-if="showPromotionModal" class="modal">
            <div class="modal-content modal-small">
                <h3>Promosikan Pegawai</h3>
                <p>Apakah Anda yakin ingin mempromosikan {{ selectedEmployee.nama }} menjadi Ketua Kelas?</p>
                <button @click="closeModal">Tutup</button>
            </div>
        </div>

        <!-- Modal Demosi -->
        <div v-if="showDemotionModal" class="modal">
            <div class="modal-content modal-small">
                <h3>Turunkan Jabatan</h3>
                <p>Apakah Anda yakin ingin menurunkan jabatan {{ selectedEmployee.nama }} dari Ketua Kelas?</p>
                <button @click="closeModal">Tutup</button>
            </div>
        </div>

        <!-- Modal Edit -->
        <div v-if="showEditModal" class="modal">
            <div class="modal-content modal-small">
                <h3>Edit Pegawai</h3>
                <p>Edit data untuk {{ selectedEmployee.nama }}</p>
                <button @click="closeModal">Tutup</button>
            </div>
        </div>

        <!-- Modal Hapus -->
        <div v-if="showDeleteModal" class="modal">
            <div class="modal-content modal-small">
                <h3>Hapus Pegawai</h3>
                <p>Apakah Anda yakin ingin menghapus {{ selectedEmployee.nama }}?</p>
                <button @click="closeModal">Tutup</button>
            </div>
        </div>
    </div>
</template>

<script>
import axios from "axios";

export default {
    data() {
        return {
            employees: [],
            loading: false,
            error: "",
            showPromotionModal: false,
            showDemotionModal: false,
            showEditModal: false,
            showDeleteModal: false,
            selectedEmployee: null, // Pegawai yang dipilih
        };
    },
    methods: {
        async fetchEmployees() {
            this.loading = true;
            try {
                const response = await axios.get("http://localhost:8000/api/all/profile");
                this.employees = response.data.data || [];
            } catch (error) {
                console.error(error);
                this.error = "Gagal memuat data pegawai.";
            } finally {
                this.loading = false;
            }
        },
        openPromotionDialog(employee) {
            this.selectedEmployee = { ...employee };
            this.showPromotionModal = true;
        },
        openDemotionDialog(employee) {
            this.selectedEmployee = { ...employee };
            this.showDemotionModal = true;
        },
        openEditDialog(employee) {
            this.selectedEmployee = { ...employee };
            this.showEditModal = true;
        },
        openDeleteDialog(employee) {
            this.selectedEmployee = { ...employee };
            this.showDeleteModal = true;
        },
        closeModal() {
            this.showPromotionModal = false;
            this.showDemotionModal = false;
            this.showEditModal = false;
            this.showDeleteModal = false;
            this.selectedEmployee = null;
        },
    },
    mounted() {
        this.fetchEmployees();
    },
};
</script>

<style scoped>
/* Tabel */
.employee-table {
    width: 100%;
    border-collapse: collapse;
}

.employee-table th,
.employee-table td {
    border: 1px solid #ddd;
    padding: 8px;
}

.employee-table th {
    background-color: #f2f2f2;
    text-align: left;
}

/* Loader */
.loader {
    margin: auto;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #3498db;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    animation: spin 2s linear infinite;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

/* Modal */
.modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
}

.modal-content {
    background: white;
    padding: 20px;
    border-radius: 8px;
    text-align: center;
}

.modal-content.modal-small {
    width: 50%;
    max-width: 400px;
}

.modal-content button {
    margin: 5px;
}

.action-icon {
    cursor: pointer;
    margin: 0 5px;
}
</style>