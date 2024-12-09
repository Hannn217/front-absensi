<template>
    <div>
        <h1>Daftar Pegawai</h1>
        <div v-if="loading" class="loader"></div>

        <!-- Tabel Pegawai -->
        <table v-if="!loading" class="employee-table">
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
                <tr v-for="employee in employees" :key="employee.id">
                    <td>{{ employee.nama }}</td>
                    <td>{{ employee.username }}</td>
                    <td>{{ employee.email }}</td>
                    <td>{{ employee.nomor_hp }}</td>
                    <td>{{ employee.jabatan }}</td>
                    <td>{{ employee.nama_kelas }}</td>
                    <td>
                        <div v-if="employee.jabatan === 'System Admin'">
                            <i class="fas fa-edit action-icon" @click="editEmployee(employee.username)"
                                title="Edit"></i>
                            <i class="fas fa-trash action-icon" @click="deleteEmployee(employee.username)"
                                title="Hapus"></i>
                        </div>
                        <div v-else-if="employee.jabatan === 'Pegawai'">
                            <i class="fas fa-arrow-up action-icon" @click="openPromotionDialog(employee.username)"
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

        <!-- Modal Promosi -->
        <div v-if="showPromotionDialog" class="modal">
            <div class="modal-content">
                <h3>Pilih Kelas untuk Promosi</h3>
                <select v-model="selectedClass" class="class-selector">
                    <option v-for="kelas in classes" :key="kelas.id" :value="kelas.id">
                        {{ kelas.nama_kelas }}
                    </option>
                </select>
                <button @click="promoteEmployee(selectedEmployee)" class="confirm-button">Promosikan</button>
                <button @click="closePromotionDialog" class="cancel-button">Batal</button>
            </div>
        </div>

        <!-- Pesan Sukses -->
        <div v-if="success" class="success-message">{{ success }}</div>
        <div v-if="error" class="error-message">{{ error }}</div>
    </div>
</template>

<script>
import axios from "axios";

export default {
    data() {
        return {
            employees: [],
            classes: [],
            loading: false,
            success: "",
            error: "",
            showPromotionDialog: false,
            selectedClass: null,
            selectedEmployee: null,
        };
    },
    methods: {
        async fetchEmployees() {
            this.loading = true;
            this.success = "";
            this.error = "";
            try {
                const response = await axios.get("http://localhost:8000/api/all/profile");
                this.employees = response.data.data;
            } catch (error) {
                this.handleError(error);
            } finally {
                this.loading = false;
            }
        },
        openPromotionDialog(employee) {
            if (employee.nama_kelas === "Belum Ditambahkan ke dalam kelas") {
                this.selectedEmployee = employee;
                this.showPromotionDialog = true;
            } else {
                this.promoteEmployee(employee.username);
            }
        },
        async promoteEmployee(employee) {
            try {
                const response = await axios.post(
                    `http://localhost:8000/api/pegawai/${employee.username}/promote`,
                    { class_id: this.selectedClass }
                );
                this.success = response.data.message;
                this.closePromotionDialog();
                this.fetchEmployees();
            } catch (error) {
                this.handleError(error);
            }
        },
        closePromotionDialog() {
            this.showPromotionDialog = false;
            this.selectedClass = null;
            this.selectedEmployee = null;
        },
        async demoteEmployee(username) {
            try {
                const response = await axios.post(
                    `http://localhost:8000/api/pegawai/${username}/demote`
                );
                this.success = response.data.message;
                this.fetchEmployees();
            } catch (error) {
                this.handleError(error);
            }
        },
        async deleteEmployee(username) {
            if (confirm("Apakah Anda yakin ingin menghapus pegawai ini?")) {
                try {
                    const response = await axios.delete(
                        `http://localhost:8000/api/pegawai/${username}/delet`
                    );
                    this.success = response.data.message;
                    this.fetchEmployees();
                } catch (error) {
                    this.handleError(error);
                }
            }
        },
        handleError(error) {
            if (error.response) {
                this.error = error.response.data.message;
            } else if (error.request) {
                this.error = "Tidak ada respon dari server";
            } else {
                this.error = "Terjadi kesalahan: " + error.message;
            }
        },
        editEmployee(username) {
            alert(`Edit pegawai: ${username}`);
        },
    },
    mounted() {
        this.fetchEmployees();
    },
};
</script>

<style>
/* Gaya untuk tabel */
.employee-table {
    width: 100%;
    border-collapse: collapse;
}

.employee-table th,
.employee-table td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
}

.employee-table th {
    background-color: #f2f2f2;
}

/* Gaya ikon aksi */
.action-icon {
    margin: 0 5px;
    cursor: pointer;
    font-size: 16px;
    transition: color 0.3s ease, transform 0.2s ease;
}

/* Warna untuk masing-masing ikon */
.fa-edit {
    color: #3498db;
    /* Biru untuk tombol edit */
}

.fa-edit:hover {
    color: #2980b9;
    /* Biru lebih gelap saat hover */
}

.fa-trash {
    color: #e74c3c;
    /* Merah untuk tombol hapus */
}

.fa-trash:hover {
    color: #c0392b;
    /* Merah lebih gelap saat hover */
}

.fa-arrow-up {
    color: #2ecc71;
    /* Hijau untuk promosi */
}

.fa-arrow-up:hover {
    color: #27ae60;
    /* Hijau lebih gelap saat hover */
}

.fa-arrow-down {
    color: #f1c40f;
    /* Kuning untuk demosi */
}

.fa-arrow-down:hover {
    color: #f39c12;
    /* Kuning lebih gelap saat hover */
}

/* Tambahkan efek hover */
.action-icon:hover {
    transform: scale(1.2);
    /* Perbesar sedikit saat hover */
}

/* Gaya untuk modal */
.modal {
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
}

.modal-content {
    background-color: white;
    padding: 20px;
    border-radius: 5px;
    width: 300px;
    text-align: center;
}

/* Gaya untuk selector */
.class-selector {
    width: 100%;
    padding: 10px;
    margin-bottom: 15px;
}

/* Tombol konfirmasi */
.confirm-button {
    background-color: #2ecc71;
    color: white;
    padding: 10px;
    border: none;
    cursor: pointer;
    margin-right: 10px;
    border-radius: 3px;
}

.confirm-button:hover {
    background-color: #27ae60;
    /* Hijau lebih gelap saat hover */
}

/* Tombol batal */
.cancel-button {
    background-color: #e74c3c;
    color: white;
    padding: 10px;
    border: none;
    cursor: pointer;
    border-radius: 3px;
}

.cancel-button:hover {
    background-color: #c0392b;
    /* Merah lebih gelap saat hover */
}

/* Pesan sukses */
.success-message {
    color: green;
    margin-top: 10px;
}

/* Pesan error */
.error-message {
    color: red;
    margin-top: 10px;
}
</style>
