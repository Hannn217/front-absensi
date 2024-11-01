<template>
    <div>
        <h1>Kelola Pegawai</h1>
        <p>Konten untuk mengelola pegawai.</p>

        <div class="search-bar">
            <input type="text" v-model="searchQuery" placeholder="Cari pegawai..." />
        </div>

        <table class="employee-table">
            <thead>
                <tr>
                    <th>No</th>
                    <th>Nama</th>
                    <th>Jabatan</th>
                    <th>Aksi</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="employee in filteredEmployees" :key="employee.id">
                    <td>{{ employee.id }}</td>
                    <td>{{ employee.name }}</td>
                    <td>{{ employee.position }}</td>
                    <td>
                        <button v-if="employee.position !== 'Ketua Kelas'" @click="promoteToLeader(employee)">
                            Jadikan Ketua Kelas
                        </button>
                        <button v-else @click="demoteToMember(employee)">
                            Demosi ke Pegawai Biasa
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
export default {
    name: 'KelolaPegawai',
    data() {
        return {
            searchQuery: '',
            employees: [
                { id: 1, name: 'Ahmad', position: 'Anggota' },
                { id: 2, name: 'Siti', position: 'Anggota' },
                { id: 3, name: 'Budi', position: 'Ketua Kelas' },
                // Tambahkan data pegawai lain di sini
            ]
        };
    },
    computed: {
        filteredEmployees() {
            return this.employees.filter(employee =>
                employee.name.toLowerCase().includes(this.searchQuery.toLowerCase())
            );
        }
    },
    methods: {
        promoteToLeader(employee) {
            if (confirm(`Apakah Anda yakin ingin menjadikan ${employee.name} sebagai Ketua Kelas?`)) {
                employee.position = 'Ketua Kelas';
                alert(`${employee.name} telah dijadikan Ketua Kelas.`);
            }
        },
        demoteToMember(employee) {
            if (confirm(`Apakah Anda yakin ingin mendemosi ${employee.name} menjadi pegawai biasa?`)) {
                employee.position = 'Anggota';
                alert(`${employee.name} telah didemosi menjadi pegawai biasa.`);
            }
        }
    }
};
</script>

<style scoped>
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
}

.search-bar input {
    margin-bottom: 15px;
    padding: 8px;
    width: 100%;
    max-width: 300px;
}
</style>
