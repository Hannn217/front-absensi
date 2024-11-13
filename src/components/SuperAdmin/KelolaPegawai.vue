<template>
    <div>
        <h1>Kelola Pegawai</h1>

        <!-- Tampilkan pesan error dan sukses -->
        <div v-if="error" class="error">{{ error }}</div>
        <div v-if="success" class="success">{{ success }}</div>

        <!-- Pesan loading dan ketika tidak ada pegawai ditemukan -->
        <div v-if="loading" class="loading-container">
            <div class="loader"></div>
        </div>
        <div v-else-if="!employees.length">Tidak ada pegawai yang ditemukan.</div>

        <!-- Tabel Pegawai -->
        <div v-if="employees.length && !loading">
            <table class="employee-table">
                <thead>
                    <tr>
                        <th>Nama</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Nomor HP</th>
                        <th>Jabatan</th>
                        <th>Nama Kelas</th>
                        <th>Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(employee, index) in employees" :key="index">
                        <td>{{ employee.nama }}</td>
                        <td>{{ employee.username }}</td>
                        <td>{{ employee.email }}</td>
                        <td>{{ employee.nomor_hp }}</td>
                        <td>{{ employee.jabatan }}</td>
                        <td>{{ employee.nama_kelas }}</td>
                        <td class="actions">
                            <!-- Tindakan untuk pegawai dengan jabatan "Pegawai" -->
                            <template v-if="employee.jabatan === 'Pegawai'">
                                <button @click="promoteEmployee(employee.username)" title="Promote"
                                    class="action-btn promote">
                                    <i class="fas fa-arrow-up"></i>
                                </button>
                                <button @click="updateEmployee(employee.username)" title="Update"
                                    class="action-btn update">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button @click="deleteEmployee(employee.username)" title="Delete"
                                    class="action-btn delete">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </template>
                            <!-- Tindakan untuk pegawai dengan jabatan "Ketua Kelas" -->
                            <template v-else-if="employee.jabatan === 'Ketua Kelas'">
                                <button @click="confirmDemote(employee)" title="Demote" class="action-btn demote">
                                    <i class="fas fa-arrow-down"></i>
                                </button>
                                <button @click="deleteEmployee(employee.username)" title="Delete"
                                    class="action-btn delete">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </template>
                            <!-- Tindakan untuk pegawai dengan jabatan "System Admin" -->
                            <template v-else-if="employee.jabatan === 'System Admin'">
                                <button @click="deleteEmployee(employee.username)" title="Delete"
                                    class="action-btn delete">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </template>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            employees: [],
            error: null,
            success: null,
            loading: true
        };
    },
    mounted() {
        this.fetchEmployees();
    },
    methods: {
        async fetchEmployees() {
            try {
                const response = await axios.get('http://localhost:8000/api/all/profile', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                });
                this.employees = response.data.data;
                this.loading = false;
            } catch (error) {
                this.loading = false;
                this.handleError(error);
            }
        },
        confirmDemote(employee) {
            // Menampilkan dialog konfirmasi
            const confirmed = confirm(`Apakah Anda yakin ingin mengubah jabatan ${employee.nama} dari Ketua Kelas menjadi Pegawai Biasa?`);
            if (confirmed) {
                this.demoteEmployee(employee.username);
            }
        },
        async demoteEmployee(username) {
            try {
                const response = await axios.post(`http://localhost:8000/api/pegawai/${username}/demote`, {}, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                    withCredentials: true
                });
                this.success = response.data.message;
                this.fetchEmployees();
            } catch (error) {
                this.handleError(error);
            }
        },
        handleError(error) {
            if (error.response) {
                this.error = error.response.data.message || 'Terjadi kesalahan';
            } else if (error.request) {
                this.error = 'Tidak ada respons dari server';
            } else {
                this.error = error.message;
            }
        },
        async promoteEmployee(username) {
            try {
                const response = await axios.post(`http://localhost:8000/api/pegawai/${username}/promote`, {}, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                    withCredentials: true
                });
                this.success = response.data.message;
                this.fetchEmployees();
            } catch (error) {
                this.handleError(error);
            }
        },
        updateEmployee(username) {
            // Logika untuk memperbarui data pegawai
            alert(`Update action for ${username} clicked`);
        },
        deleteEmployee(username) {
            // Logika untuk menghapus pegawai
            alert(`Delete action for ${username} clicked`);
        },
    }
};
</script>

<style>
.error {
    color: red;
    margin-top: 10px;
}

.success {
    color: green;
    margin-top: 10px;
}

.employee-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
    font-family: Arial, sans-serif;
}

.employee-table th,
.employee-table td {
    padding: 12px;
    border: 1px solid #ddd;
    text-align: left;
}

.employee-table th {
    background-color: #f2f2f2;
    font-weight: bold;
}

.actions {
    display: flex;
    gap: 8px;
    justify-content: center;
}

.action-btn {
    border: none;
    background: none;
    cursor: pointer;
    padding: 5px;
    font-size: 1.1em;
}

.promote {
    color: green;
}

.update {
    color: blue;
}

.demote {
    color: orange;
}

.delete {
    color: red;
}

.action-btn i {
    font-size: 1.2em;
}

.loading-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 60vh;
}

.loader {
    width: 50px;
    padding: 8px;
    aspect-ratio: 1;
    border-radius: 50%;
    background: #25b09b;
    --_m: conic-gradient(#0000 10%, #000), linear-gradient(#000 0 0) content-box;
    -webkit-mask: var(--_m);
    mask: var(--_m);
    -webkit-mask-composite: source-out;
    mask-composite: subtract;
    animation: l3 1s infinite linear;
}

@keyframes l3 {
    to {
        transform: rotate(1turn);
    }
}
</style>
