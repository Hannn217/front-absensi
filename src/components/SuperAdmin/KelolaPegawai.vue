<template>
    <div>
        <h1>Kelola Pegawai</h1>
        <div v-if="error" class="error">{{ error }}</div>
        <div v-if="success" class="success">{{ success }}</div>

        <div v-if="employees.length">
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
                            <!-- Kondisi untuk jabatan "pegawai" -->
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
                            <!-- Kondisi untuk jabatan "ketua kelas" -->
                            <template v-else-if="employee.jabatan === 'Ketua Kelas'">
                                <button @click="demoteEmployee(employee.username)" title="Demote"
                                    class="action-btn demote">
                                    <i class="fas fa-arrow-down"></i>
                                </button>
                                <button @click="deleteEmployee(employee.username)" title="Delete"
                                    class="action-btn delete">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </template>
                            <!-- Kondisi untuk jabatan "system admin" -->
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
        <div v-else>
            <p>No employees found.</p>
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
        };
    },
    mounted() {
        this.fetchEmployees();
    },
    methods: {
        async fetchEmployees() {
            try {
                const response = await axios.get('http://localhost:8000/api/all/profile', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                this.employees = response.data.data;
            } catch (error) {
                this.handleError(error);
            }
        },
        async promoteEmployee(username) {
            try {
                const response = await axios.post(`http://localhost:8000/api/pegawai/${username}/promote`, {}, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                this.success = response.data.message;
                this.fetchEmployees();
            } catch (error) {
                this.handleError(error);
            }
        },
        async updateEmployee(username) {
            // Implementasikan aksi update pegawai di sini
            alert(`Update action for ${username} clicked`);
        },
        async demoteEmployee(username) {
            try {
                const response = await axios.post(`http://localhost:8000/api/pegawai/${username}/demote`, {}, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                this.success = response.data.message;
                this.fetchEmployees();
            } catch (error) {
                this.handleError(error);
            }
        },
        async deleteEmployee(username) {
            try {
                const response = await axios.delete(`http://localhost:8000/api/pegawai/${username}/del`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                this.success = response.data.message;
                this.fetchEmployees();
            } catch (error) {
                this.handleError(error);
            }
        },
        handleError(error) {
            if (error.response) {
                this.error = error.response.data.message || 'An error occurred';
            } else if (error.request) {
                this.error = 'No response received from the server';
            } else {
                this.error = error.message;
            }
        },
    },
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
</style>
