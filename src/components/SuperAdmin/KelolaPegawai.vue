<template>
    <div>
        <h1>Daftar Pegawai</h1>
        <button @click="fetchEmployees">Refresh Data</button>
        <div v-if="loading" class="loader"></div>

        <table v-if="!loading">
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
                        <button @click="promoteEmployee(employee.username)">Promosikan</button>
                        <button @click="demoteEmployee(employee.username)">Demosi</button>
                        <button @click="deleteEmployee(employee.username)">Hapus</button>
                    </td>
                </tr>
            </tbody>
        </table>

        <div v-if="success">{{ success }}</div>
        <div v-if="error">{{ error }}</div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            employees: [],
            loading: false,
            success: '',
            error: '',
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
            } catch (error) {
                this.handleError(error);
            } finally {
                this.loading = false;
            }
        },
        async promoteEmployee(username) {
            try {
                const response = await axios.post(`http://localhost:8000/api/pegawai/${username}/promote`);
                this.success = response.data.message;
                this.fetchEmployees();
            } catch (error) {
                this.handleError(error);
            }
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
    },
    mounted() {
        this.fetchEmployees();
    },
};
</script>

<style>
.loader {
    border: 4px solid #f3f3f3;
    border-top: 4px solid #3498db;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}
</style>