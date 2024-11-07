<template>
    <div>
        <h1>Kelola Pegawai</h1>
        <div v-if="error" class="error">{{ error }}</div>
        <div v-if="success" class="success">{{ success }}</div>

        <div v-if="employees.length">
            <ul>
                <li v-for="(employee, index) in employees" :key="index">
                    <strong>{{ employee.nama }}</strong> - {{ employee.jabatan }}
                    <button @click="promoteEmployee(employee.username)">Promote</button>
                    <button @click="demoteEmployee(employee.username)">Demote</button>
                    <button @click="deleteEmployee(employee.username)">Delete</button>
                </li>
            </ul>
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
                const response = await axios.get('http://localhost:8000/api/pegawai', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`, // Replace with your token storage strategy
                    },
                });
                this.employees = response.data.message;
            } catch (error) {
                this.handleError(error);
            }
        },
        async promoteEmployee(username) {
            try {
                const response = await axios.post(`http://localhost:8000//api/pegawai/${username}/promote`, {}, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                this.success = response.data.message;
                this.fetchEmployees(); // Refresh the list after promoting
            } catch (error) {
                this.handleError(error);
            }
        },
        async demoteEmployee(username) {
            try {
                const response = await axios.post(`http:/localhost:8000/api/pegawai/${username}/demote`, {}, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                this.success = response.data.message;
                this.fetchEmployees(); // Refresh the list after demoting
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
                this.fetchEmployees(); // Refresh the list after deletion
            } catch (error) {
                this.handleError(error);
            }
        },
        handleError(error) {
            if (error.response) {
                // Server responded with a status other than 200 range
                this.error = error.response.data.message || 'An error occurred';
            } else if (error.request) {
                // Request was made but no response received
                this.error = 'No response received from the server';
            } else {
                // Something else caused an error
                this.error = error.message;
            }
        },
    },
};
</script>

<style>
.error {
    color: red;
}

.success {
    color: green;
}
</style>