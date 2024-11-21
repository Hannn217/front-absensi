<template>
    <div>
        <h1>Daftar Pegawai</h1>
        <button @click="fetchEmployees" class="refresh-button">Refresh Data</button>
        <div v-if="loading" class="loader"></div>

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
                        <!-- Conditional buttons based on employee role -->
                        <div v-if="employee.jabatan === 'System Admin'">
                            <button @click="editEmployee(employee.username)" class="edit-button">Edit</button>
                            <button @click="deleteEmployee(employee.username)" class="delete-button">Hapus</button>
                        </div>
                        <div v-else-if="employee.jabatan === 'Pegawai'">
                            <button @click="openPromotionDialog(employee)" class="action-button">Promosikan</button>
                            <button @click="editEmployee(employee.username)" class="edit-button">Edit</button>
                            <button @click="deleteEmployee(employee.username)" class="delete-button">Hapus</button>
                        </div>
                        <div v-else-if="employee.jabatan === 'Ketua Kelas'">
                            <button @click="demoteEmployee(employee.username)" class="action-button">Demosi</button>
                            <button @click="editEmployee(employee.username)" class="edit-button">Edit</button>
                            <button @click="deleteEmployee(employee.username)" class="delete-button">Hapus</button>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>

        <!-- Promotion Dialog -->
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

        <div v-if="success" class="success-message">{{ success }}</div>
        <div v-if="error" class="error-message">{{ error }}</div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            employees: [],
            classes: [],
            loading: false,
            success: '',
            error: '',
            showPromotionDialog: false,
            selectedClass: null,
            selectedEmployee: null
        };
    },
    methods: {
        async fetchEmployees() {
            this.loading = true;
            this.success = '';
            this.error = '';
            try {
                const response = await axios.get('http://localhost:8000/api/all/profile');
                this.employees = response.data.data;
                await this.fetchClasses(); // Load available classes
            } catch (error) {
                this.handleError(error);
            } finally {
                this.loading = false;
            }
        },
        async fetchClasses() {
            try {
                const response = await axios.get('http://localhost:8000/api/listkelas');
                this.classes = response.data.data;
            } catch (error) {
                this.error = 'Gagal memuat daftar kelas';
            }
        },
        openPromotionDialog(employee) {
            // Check if the employee is in a class
            if (employee.nama_kelas === "Belum Ditambahkan ke dalam kelas") {
                this.selectedEmployee = employee;
                this.showPromotionDialog = true;
            } else {
                this.promoteEmployee(employee.username);
            }
        },
        async promoteEmployee(username) {
            try {
                // If a class is selected, include it in the promotion request
                const response = await axios.post(`http://localhost:8000/api/pegawai/${username}/promote`, {
                    class_id: this.selectedClass
                });
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
                const response = await axios.post(`http://localhost:8000/api/pegawai/${username}/demote`);
                this.success = response.data.message;
                this.fetchEmployees();
            } catch (error) {
                this.handleError(error);
            }
        },
        async deleteEmployee(username) {
            if (confirm("Apakah Anda yakin ingin menghapus pegawai ini?")) {
                try {
                    const response = await axios.delete(`http://localhost:8000/api/pegawai/${username}`);
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
                this.error = 'Tidak ada respon dari server';
            } else {
                this.error = 'Terjadi kesalahan: ' + error.message;
            }
        },
        editEmployee(username) {
            // Implement your edit logic here
            alert(`Edit pegawai: ${username}`);
        }
    },
    mounted() {
        this.fetchEmployees();
    },
};
</script>

<style>
/* Same CSS styles as before + Modal Styles */
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

.class-selector {
    width: 100%;
    padding: 10px;
    margin-bottom: 15px;
}

.confirm-button {
    background-color: #2ecc71;
    color: white;
    padding: 10px;
    border: none;
    cursor: pointer;
    margin-right: 10px;
    border-radius: 3px;
}

.cancel-button {
    background-color: #e74c3c;
    color: white;
    padding: 10px;
    border: none;
    cursor: pointer;
    border-radius: 3px;
}
</style>
